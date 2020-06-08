import * as THREE from 'three';
import { Electron } from '@/chem/paricles/Atom';
import { rBohr } from '@/chem/literals/constants';

export default class ElectronCloudMesh extends THREE.Points {
  private static staticMaterial: THREE.RawShaderMaterial = ElectronCloudMesh.buildMaterial();
  public material: THREE.RawShaderMaterial;

  public static get material (): THREE.RawShaderMaterial {
    return ElectronCloudMesh.staticMaterial;
  }

  public constructor (private electrons: Array<Electron> = []) {
    super();
    this.material = ElectronCloudMesh.material;
    this.geometry = this.buildGeometry();
  }

  public dispose () {
    this.geometry.dispose();
  }

  public tick = (time: number, deltTime: number) => {
    this.material.uniforms.uTime.value = time;
  }

  private buildGeometry (): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const vertexCount = this.electrons.length;
    const electrons = [];
    for (const e of this.electrons) {
      electrons.push(e.n, e.l, e.m, e.ms * 2);
    }
    for (let i = 0; i < vertexCount; i++) {
      positions.push(this.position.x, this.position.y, this.position.z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('electron', new THREE.Float32BufferAttribute(electrons, 4));
    return geometry;
  }

  static buildMaterial (): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 }
      },
      extensions: {
        derivatives: false,
        fragDepth: false,
        drawBuffers: false,
        shaderTextureLOD: false
      },
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: true,
      vertexShader: `
        attribute vec4 electron;
        uniform float uTime;
        out vec3 lightPos;
        flat out vec4 vElectron;
        out vec4 vTime;
        out mat3 camera;
        void setCamera(out mat3 camera) {
          vec3 rayDirection = vec3(0, 0, -1);
          vec3 forward = normalize(rayDirection);
          vec3 right = normalize(cross(vec3(0., 1., 0.), forward));
          vec3 up = normalize(cross(forward, right));
          camera = mat3(right, up, forward);
        }
        void main() {
          setCamera(camera);
          vElectron = electron;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = 1000. / -mvPosition.z;
          lightPos = vec3(3., 2., -3.);
          vTime = .1 * vec4(uTime, uTime * .5, uTime * .25, uTime * .125);
        }
      `,
      fragmentShader: `
        #define MAX_STEPS 64
        #define PLANK_LENGTH .001
        #define FOG_DIST 5.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        const vec2 swizzleStep = vec2(PLANK_LENGTH, 0);
        const vec3 gammaCorrection = vec3(1.0 / 2.2);

        uniform float uTime;
        flat in vec4 vElectron;
        in vec4 vTime;
        in mat3 camera;
        in vec3 lightPos;
        float rBohr = ${rBohr};

        struct Material {
          vec4 color;
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
          vec3 normal;
          float distance;
          Material material;
          vec3 rayOrigin;
          vec3 rayDirection;
        };

        float sphericalHarmonic(in vec4 e, vec3 p)
        {
          // http://en.wikipedia.org/wiki/Table_of_spherical_harmonics#Real_spherical_harmonics
          if (e.y == 0.) {
            return 0.28;
          }
          float r = length(p);
          if (e.y == 1.) {
            if (e.z == -1.) return 0.49 * (p.y / r);
            if (e.z == 0.) return 0.49 * (p.z / r);
            if (e.z == 1.) return 0.49 * (p.x / r);
          } 
          if (e.y == 2.) {
            float r2 = r * r;
            if (e.z == -2.) return 1.09 * ((p.x * p.y) / r2);
            if (e.z == -1.) return 1.09 * ((p.y * p.z) / r2);
            if (e.z == 0.) return 0.32 * ((-(p.x * p.x) - (p.y * p.y) + 2.0 * (p.z * p.z)) / r2);
            if (e.z == 1.) return 1.09 * ((p.z * p.x) / r2);
            if (e.z == 2.) return 0.55 * (((p.x * p.x) - (p.y * p.y)) / r2);
          }
          if (e.y == 3.) {
            float r3 = r * r * r;
            if (e.z == -3.) return 0.59 * (((3.0 * p.x * p.x - p.y * p.y) * p.y) / r3);
            if (e.z == -2.) return 2.89 * ((p.x * p.y * p.z) / r3);
            if (e.z == -1.) return 0.46 * ((p.y * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / r3);
            if (e.z == 0.) return 0.37 * ((p.z * (2.0 * p.z * p.z - 3.0 * p.x * p.x - 3.0 * p.y * p.y)) / r3);
            if (e.z == 1.) return 0.46 * ((p.x * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / r3);
            if (e.z == 2.) return 1.45 * (((p.x * p.x - p.y * p.y) * p.z) / r3);
            if (e.z == 3.) return 0.59 * (((p.x * p.x - 3.0 * p.y * p.y) * p.x) / r3);
          }
          if (e.y == 4.) {
            float r2 = r * r;
            float r4 = r2 * r2;
            if (e.z == -4.) return 2.50 * (((p.x*p.y)*(p.x*p.x-p.y*p.y))/r4);
            if (e.z == -3.) return 1.77 * (((3. * (p.x * p.x) - (p.y * p.y)) * p.y * p.z) / r4);
            if (e.z == -2.) return 0.95 * (((p.x * p.y) * (7. * (p.z* p.z) - r2)) / r4);
            if (e.z == -1.) return 0.67 * (((p.y * p.z)* (7. * (p.z* p.z) - 3. * r2)) / r4);
            if (e.z == 0.) return 0.11 * ((35. * (p.z * p.z * p.z * p.z) - 30. * (p.z * p.z) * r2 + 3. * r4) / r4);
            if (e.z == 1.) return 0.67 * (((p.x * p.z) * (7. * p.z * p.z - 3. * r2)) / r4);
            if (e.z == 2.) return 0.47 * (((p.x * p.x - p.y * p.y) * (7. * (p.z * p.z) - r2)) / r4);
            if (e.z == 3.) return 1.77 * (((p.x * p.x - 3. * (p.y * p.y)) * p.x * p.z) / r4);
            if (e.z == 4.) return 0.63 * (((p.x * p.x) * (p.x * p.x - 3. * (p.y * p.y)) - (p.y * p.y) * (3. * (p.x * p.x) - p.y * p.y)) / r4);
          }
        }

        mat2 rotationMatrix(float a) {
            vec2 cs = vec2(cos(a), sin(a));
            return mat2(cs.x, -cs.y, cs.y, cs.x);
        }

        float getDistance(vec3 p) {
          p.z += 2.8;
          p.xz *= rotationMatrix((vElectron.x) + vTime.z * .5);
          p.xy *= rotationMatrix((vElectron.x) + vTime.z * .75);
          p.yz *= rotationMatrix((vElectron.x) + vTime.z);

          float sh = sphericalHarmonic(vElectron, p);

          float cloudDistance = length(p) - abs(sh * (.5 * sin((vElectron.x) + vTime.z) + vElectron.a * 0.5));
          cloudDistance *= .6 - vElectron.y * .1;
          return cloudDistance;
          return max(p.z,  cloudDistance);
        }

        vec2 cExp(float x) {
          float s = sin(x);
          return vec2(-s, s) + cos(x);
        }

        void getMaterial(inout HitObject hitObject) {
          float sh = sphericalHarmonic(vElectron, hitObject.point);
          hitObject.material.color.grb = vec3(cExp(sh), vElectron.a);
          hitObject.material.color.a = .75;
          hitObject.material.diffuse = .4;
          hitObject.material.specular = .3;
          hitObject.material.ambient = .3;
          hitObject.material.shininess = 1.;
          hitObject.material.receiveShadows = 1.;

          vec3 lightDir = normalize(hitObject.point - lightPos);
          float diffuse = hitObject.material.diffuse * dot(hitObject.normal, lightDir);
          float specular = pow(max(0., hitObject.material.specular * dot(lightDir, reflect(hitObject.rayDirection, hitObject.normal))), hitObject.material.shininess);

          hitObject.material.color.xyz = (hitObject.material.ambient + diffuse) * pow(hitObject.material.color.xyz, gammaCorrection) + specular;
        }
        void rayMarch(inout HitObject obj) {
          float stepDistance;
          obj.distance = PLANK_LENGTH;
          for (int i = 0; i < MAX_STEPS; i++) {
            stepDistance = getDistance(obj.rayOrigin + obj.rayDirection * obj.distance);
            obj.distance += stepDistance;
            if (stepDistance < PLANK_LENGTH || obj.distance >= FOG_DIST) {
              break;
            }
          }
          obj.point = obj.rayOrigin + obj.rayDirection * obj.distance;
        }
        void getNormal(inout HitObject hitObject) {
          hitObject.normal = normalize(getDistance(hitObject.point) - vec3(
            getDistance(hitObject.point - swizzleStep.xyy),
            getDistance(hitObject.point - swizzleStep.yxy),
            getDistance(hitObject.point - swizzleStep.yyx)
          ));
        }
        vec4 getColor(in vec3 origin, in vec3 direction) {
          HitObject hitObject;
          hitObject.rayOrigin = origin;
          hitObject.rayDirection = direction;
          rayMarch(hitObject);
          if (hitObject.distance >= FOG_DIST) {
            discard;
          }
          getNormal(hitObject);
          getMaterial(hitObject);
          return hitObject.material.color;
        }
        void main() {
          vec2 uv = gl_PointCoord - vec2(.5);
          gl_FragColor = getColor(vec3(0,0,0), normalize(camera * vec3(uv, .6)));
        }
      `,
    });
  }
}
