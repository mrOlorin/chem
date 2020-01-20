import * as THREE from 'three';
import Nucleus from './Nucleus';

export default class NuclideMesh extends THREE.Points {
  private static mat: THREE.ShaderMaterial = NuclideMesh.buildMaterial();
  private readonly isotope: Nucleus;

  public constructor (isotope: Nucleus) {
    super();
    this.isotope = isotope;
    this.geometry = this.buildGeometry(this.isotope);
    this.material = NuclideMesh.mat;
  }

  public tick = (time: number, deltTime: number) => {
    (this.material as THREE.ShaderMaterial).uniforms.uTime.value = time + this.isotope.magneticMoment;
  }

  private buildGeometry (isotope: Nucleus) {
    const sphericalCurve = (a: number, t: number): [number, number, number] => {
      const q = Math.sqrt(1 + a * a * t * t);
      return [
        Math.cos(t) / q,
        Math.sin(t) / q,
        -(a * t) / q,
      ];
    };
    const getA = (isotope: Nucleus): number => {
      return (isotope.bindingEnergy / isotope.A) * (isotope.magneticMoment / isotope.A);
    };
    const positions = new Float32Array(isotope.A * 3);
    const attributes = new Float32Array(isotope.A * 3);

    let aSign = 1;
    const scale = 1.5e14;
    let offset = 0;
    let radius;
    let c: [number, number, number];
    for (let i = Number.EPSILON; i < isotope.Z; i++) {
      radius = isotope.R * scale;
      aSign = -aSign;
      c = sphericalCurve(aSign * getA(isotope) / i, isotope.Z - i);
      positions[offset] = c[0] * radius;
      attributes[offset++] = 1;
      positions[offset] = c[1] * radius;
      attributes[offset++] = 0;
      positions[offset] = c[2] * radius;
      attributes[offset++] = isotope.bindingEnergy / isotope.A;
    }
    for (let i = Number.EPSILON; i < isotope.N; i++) {
      radius = isotope.R * scale;
      aSign = -aSign;
      c = sphericalCurve(aSign * getA(isotope) / i, isotope.N - i);
      positions[offset] = c[0] * radius;
      attributes[offset++] = 0;
      positions[offset] = c[1] * radius;
      attributes[offset++] = 1;
      positions[offset] = c[2] * radius;
      attributes[offset++] = isotope.bindingEnergy / isotope.A;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('attributes', new THREE.BufferAttribute(attributes, 3));
    geometry.computeBoundingSphere();
    return geometry;
  }

  private static buildMaterial () {
    return new THREE.ShaderMaterial({
      extensions: {
        derivatives: false,
        fragDepth: false,
        drawBuffers: false,
        shaderTextureLOD: false
      },
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: true,
      uniforms: {
        uTime: { value: 0.0 },
        pointSize: { value: 12 }
      },
      vertexShader: `
        #define PI 3.141592653589793
        in vec3 attributes;
        varying vec4 vPosition;
        varying vec3 vAttributes;
        uniform float pointSize;
        uniform float uTime;
        out mat3 camera;

        vec3 getPosition(vec3 p) {
            p.x += .05 * sin(1.1 * uTime + attributes.x + p.x + p.y + p.z);
            p.y += .05 * cos(1.3 * uTime + attributes.y + p.x + p.y + p.z);
            return p;
        }

        void main() {
            vAttributes = attributes;
            vec3 rayDirection = vec3(0, 0, -1);
            vec3 forward = normalize(rayDirection);
            vec3 right = normalize(cross(vec3(0., 1., 0.), forward));
            vec3 up = normalize(cross(forward, right));
            camera = mat3(right, up, forward);
            gl_PointSize = pointSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( getPosition(position), 1.0 );
            vPosition = gl_Position;
        }
    `,
      fragmentShader: `
        #define PI 3.141592653589793
        #define MAX_STEPS 32
        #define PLANK_LENGTH .01
        #define FOG_DIST 11.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        in mat3 camera;
        varying vec4 vPosition;
        varying vec3 vAttributes;
        uniform float pointSize;
        uniform float uTime;
        const vec3 gammaCorrection = vec3(1.0 / 2.2);
        struct Material {
            vec3 color;
            float diffuse;
            float specular;
            float ambient;
            float shininess;
            float reflection;
            float transparency;
            float ior;
            float receiveShadows;
        };
        struct HitObject {
            vec3 point;
            float distance;
            Material material;
        };

        float getDistance(vec3 p) {
            p -= vec3(0, 0, -1. - vAttributes.y * .5);
            return length(p) - .5;
        }
        Material getMaterial(vec3 p) {
            Material m;
            m.color = vec3(vAttributes.x, vAttributes.y, 0.);
            m.diffuse = .5;
            m.specular = .4;
            m.ambient = .4;
            m.shininess = 1.;
            m.receiveShadows = 1.;
            return m;
        }

        void rayMarch(inout HitObject obj, in vec3 rayOrigin, in vec3 rayDirection, float plankLength) {
            float stepDistance;
            obj.distance = plankLength;
            for (int i = 0; i < MAX_STEPS; i++) {
                stepDistance = abs(getDistance(rayOrigin + rayDirection * obj.distance));
                obj.distance += stepDistance;
                if (stepDistance < plankLength || obj.distance >= FOG_DIST) {
                    break;
                }
            }
            obj.point = rayOrigin + rayDirection * obj.distance;
        }
        vec3 getNormal(in HitObject hitObject) {
            vec2 offset = vec2(.01, 0);
            return normalize(getDistance(hitObject.point) - vec3(
                getDistance(hitObject.point - offset.xyy),
                getDistance(hitObject.point - offset.yxy),
                getDistance(hitObject.point - offset.yyx)
            ));
        }
        vec3 blend(in vec3 color, in vec3 blendColor, in float blendAmount) {
            return color * (1. - blendAmount) + blendColor * blendAmount;
        }
        float softShadow(in vec3 point, in vec3 lightDir) {
            point += lightDir * .1;
            float totalDist = .1;
            float result = 1.;
            float d;
            for ( int i = 0; i < 32; i ++ ) {
                d = getDistance(point);
                if (d <= PLANK_LENGTH) return 0.;
                result = min(result, d / (totalDist * .001));
                totalDist += d;
                if (totalDist > 10.) return result;
                point += lightDir * d;
            }
            return result;
        }
        float ambientOcclusion(in vec3 p, in vec3 n) {
            float k = 1.;
            float occ = 0.;
            float len;
            for ( float i = 1.; i < 6.; i += 1. ) {
                len = .15 * i;
                occ += (len - getDistance(n * len + p)) * k;
                k *= .5;
            }
            return clamp(1. - occ, 0., 1.);
        }
        vec3 phongLighting(in HitObject hitObject, in Material mat, in vec3 ray) {
            vec3 normal = getNormal(hitObject);
            vec3 lightDir = normalize(vec3(-6., -3., 3.) - hitObject.point);
            float diffuse = max(0., mat.diffuse * dot(normal, lightDir));
            float specular = pow(max(0., mat.specular * dot(lightDir, reflect(ray, normal))), mat.shininess);
            float shadow = mat.receiveShadows * softShadow(hitObject.point, lightDir) * ambientOcclusion(hitObject.point, normal);
            return (mat.ambient + diffuse * shadow) * pow(mat.color, gammaCorrection) + specular * shadow;
        }
        vec4 getColor(in vec3 origin, in vec3 direction) {
            HitObject hitObject;
            rayMarch(hitObject, origin, direction, PLANK_LENGTH);
            if (hitObject.distance >= FOG_DIST) {
                discard;
            }
            hitObject.material = getMaterial(hitObject.point);
            vec3 color = phongLighting(hitObject, hitObject.material, direction);
            return vec4(color, 1.);//blend(color, FOG_COLOR, hitObject.distance / FOG_DIST);
        }
        void main() {
            vec2 uv = gl_PointCoord - vec2(.5);
            gl_FragColor = getColor(vec3(0,0,0), normalize(camera * vec3(uv, .6)));
        }
    `
    });
  }
}
