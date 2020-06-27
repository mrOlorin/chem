import * as THREE from 'three';
import distribution from './distribution/NucleonDistribution';
import Nucleus from '../paricles/Nucleus'

interface NucleusMeshOptions {
  nucleus: Nucleus;
  timeScale: number;
}

export default class NucleusMesh extends THREE.Points {
  private static commonMaterial: THREE.ShaderMaterial = NucleusMesh.buildMaterial();
  public readonly geometry: THREE.BufferGeometry;
  public readonly material: THREE.ShaderMaterial;
  public readonly options: NucleusMeshOptions;
  private readonly nucleus: Nucleus;
  private readonly timeScale: number = 0.1;

  public constructor (options: NucleusMeshOptions) {
    super();
    this.options = options;
    this.nucleus = this.options.nucleus;
    this.material = NucleusMesh.commonMaterial;

    const { positions, attributes } = distribution.sphericalCurve(this.nucleus);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('attributes', new THREE.BufferAttribute(attributes, 3));
    this.geometry.computeBoundingSphere();
    this.onBeforeRender = this.tick.bind(this);
  }

  // @ts-ignore
  public tick = (renderer: THREE.Renderer, scene: THREE.Scene, camera: THREE.Camera) => {
    camera.getWorldPosition(this.material.uniforms.rayOrigin.value);
    camera.getWorldDirection(this.material.uniforms.rayDirection.value);
    this.material.uniforms.uTime.value = performance.now() * this.timeScale;
  }

  private static buildMaterial () {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        rayOrigin: { value: new THREE.Vector3(0, 0, 0) },
        rayDirection: { value: new THREE.Vector3(0, 0, 0) },
        pointSize: { value: 150 }
      },
      side: THREE.FrontSide,
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: true,
      extensions: {
        derivatives: false,
        fragDepth: false,
        drawBuffers: false,
        shaderTextureLOD: false
      },
      vertexShader: `
        #define PI 3.1415926
        uniform float pointSize;
        uniform float uTime;
        uniform vec3 rayDirection;
        in vec3 attributes;
        varying vec4 vPosition;
        varying vec3 vAttribute;
        varying vec3 lightPos;
        varying vec3 a;
        out mat3 camera;
        out vec4 vTime;

        vec3 getPosition(vec3 p) {
          p.x += .01 * sin(.9 * uTime + attributes.x + p.x + p.y + p.z);
          p.y += .01 * cos(.7 * uTime + attributes.y + p.x + p.y + p.z);
          return p;
        }

        void setCamera(out mat3 camera) {
          vec3 forward = normalize(rayDirection);
          vec3 right = normalize(cross(vec3(0., 1., 0.), forward));
          vec3 up = normalize(cross(forward, right));
          camera = mat3(right, up, forward);
        }

        void main() {
          setCamera(camera);
          vAttribute = attributes;
          vec3 pos = position; //getPosition(position);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = pointSize / -mvPosition.z;
          vPosition = gl_Position;
          lightPos = pos - vec3(5., 5., -5.);
          vTime = vPosition.x+vPosition.y+vPosition.z + .1 * vec4(uTime, uTime * .5, uTime * .25, uTime * .125);
        }
    `,
      fragmentShader: `
        #define PI 3.141592653589793
        #define MAX_STEPS 16
        #define PLANK_LENGTH .01
        #define FOG_DIST 11.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        in mat3 camera;
        varying vec4 vPosition;
        varying vec3 vAttribute;
        varying vec3 lightPos;
        varying vec3 a;
        in vec4 vTime;
        uniform vec3 rayOrigin;
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
          p -= vec3(0, 0, -vAttribute.y * .5);
          p.xy *= mat2(cos(vTime.x), -sin(vTime.x), sin(vTime.x), cos(vTime.x));
          p.yz *= mat2(cos(vTime.y), -sin(vTime.y), sin(vTime.y), cos(vTime.y));
          p.xz *= mat2(cos(vTime.z), -sin(vTime.z), sin(vTime.z), cos(vTime.z));

          vec2 q = vec2(length(p.xy) - .4, p.z);
          return length(q) - .1;
        }
        Material getMaterial(vec3 p) {
          Material m;
          m.color = vec3(vAttribute.x * .923, vAttribute.y * .927, 0.);
          m.diffuse = .4;
          m.specular = .4;
          m.ambient = .3;
          m.shininess = 1.;
          m.receiveShadows = 1.;
          return m;
        }

        void rayMarch(inout HitObject obj, in vec3 rayOrigin, in vec3 rayDirection) {
          float stepDistance;
          obj.distance = PLANK_LENGTH;
          for (int i = 0; i < MAX_STEPS; i++) {
            stepDistance = abs(getDistance(rayOrigin + rayDirection * obj.distance));
            obj.distance += stepDistance;
            if (stepDistance < PLANK_LENGTH || obj.distance >= FOG_DIST) {
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
        vec3 phongLighting(in HitObject hitObject, in vec3 direction) {
          vec3 normal = getNormal(hitObject);
          vec3 lightDir = normalize(lightPos - hitObject.point);
          float diffuse = max(0., hitObject.material.diffuse * dot(normal, lightDir));
          float specular = pow(max(0., hitObject.material.specular * dot(lightDir, reflect(direction, normal))), hitObject.material.shininess);
          float shadow = 1.;//hitObject.material.receiveShadows * softShadow(hitObject.point, lightDir) * ambientOcclusion(hitObject.point, normal);
          return (hitObject.material.ambient + diffuse * shadow) * pow(hitObject.material.color, gammaCorrection) + specular * shadow;
        }
        vec4 getColor(in vec3 origin, in vec3 direction) {
          HitObject hitObject;
          rayMarch(hitObject, origin, direction);
          if (hitObject.distance >= FOG_DIST) {
            discard;
          }
          hitObject.material = getMaterial(hitObject.point);
          vec3 color = phongLighting(hitObject, direction);
          return vec4(color, 1.);//blend(color, FOG_COLOR, hitObject.distance / FOG_DIST);
        }
        void main() {
          vec2 uv = gl_PointCoord - vec2(.5);
          gl_FragColor = getColor(rayOrigin, normalize(camera * vec3(uv, .6)));
        }
    `
    });
  }
}
