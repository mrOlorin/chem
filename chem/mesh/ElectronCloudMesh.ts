import * as THREE from 'three';
import { Electron } from '../paricles/Atom'

interface ElectronCloudMeshOptions {
  electrons: Array<Electron>;
  timeScale: number;
}

export default class ElectronCloudMesh extends THREE.Points {
  public readonly material: THREE.RawShaderMaterial;
  public readonly options: ElectronCloudMeshOptions;
  private readonly timeShift: number;
  public constructor (options: Partial<ElectronCloudMeshOptions>) {
    super();
    this.options = {
      timeScale: 0.1,
      ...options
    } as ElectronCloudMeshOptions;
    this.timeShift = this.options.electrons.length * 10;
    this.material = this.buildMaterial();
    this.geometry = this.buildGeometry();
    this.onBeforeRender = this.tick.bind(this);
  }

  public tick = (_renderer: THREE.Renderer, _scene: THREE.Scene, camera: THREE.Camera) => {
    camera.getWorldPosition(this.material.uniforms.rayOrigin.value);
    camera.getWorldDirection(this.material.uniforms.rayDirection.value);
    this.material.uniforms.uTime.value = performance.now() * this.options.timeScale + this.timeShift;
  }

  private buildGeometry (): THREE.BufferGeometry {
    const positions = [];
    positions.push(this.position.x, this.position.y, this.position.z);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }

  // http://en.wikipedia.org/wiki/Table_of_spherical_harmonics#Real_spherical_harmonics
  private sphericalHarmonic: { [l: number]: { [m: number]: string } } = {
    0: {
      0: '0.28209479177387814'
    },
    1: {
      [-1]: '0.4886025119029199 * (p.y / r)',
      [0]: '0.4886025119029199 * (p.z / r)',
      [1]: '0.4886025119029199 * (p.x / r)'
    },
    2: {
      [-2]: '1.0925484305920792 * ((p.x * p.y) / (r2))',
      [-1]: '1.0925484305920792 * ((p.y * p.z) / (r2))',
      [0]: '0.31539156525252005 * ((-(p.x * p.x) - (p.y * p.y) + 2.0 * (p.z * p.z)) / (r2))',
      [1]: '1.0925484305920792 * ((p.z * p.x) / (r2))',
      [2]: '0.5462742152960396 * (((p.x * p.x) - (p.y * p.y)) / (r2))'
    },
    3: {
      [-3]: '0.5900435899266435 * (((3.0 * p.x * p.x - p.y * p.y) * p.y) / (r3))',
      [-2]: '2.890611442640554 * ((p.x * p.y * p.z) / (r3))',
      [-1]: '0.4570457994644658 * ((p.y * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (r3))',
      [0]: '0.3731763325901154 * ((p.z * (2.0 * p.z * p.z - 3.0 * p.x * p.x - 3.0 * p.y * p.y)) / (r3))',
      [1]: '0.4570457994644658 * ((p.x * (4.0 * p.z * p.z - p.x * p.x - p.y * p.y)) / (r3))',
      [2]: '1.445305721320277 * (((p.x * p.x - p.y * p.y) * p.z) / (r3))',
      [3]: '0.5900435899266435 * (((p.x * p.x - 3.0 * p.y * p.y) * p.x) / (r3))'
    },
    4: {
      [-4]: '2.5033429417967046 * (((p.x * p.y) * (p.x * p.x - p.y * p.y)) / (r4))',
      [-3]: '1.7701307697799304 * (((3. * (p.x * p.x) - (p.y * p.y)) * p.y * p.z) / (r4))',
      [-2]: '0.9461746957575601 * (((p.x * p.y) * (7. * (p.z * p.z) - (r2))) / (r4))',
      [-1]: '0.6690465435572892 * (((p.y * p.z) * (7. * (p.z * p.z) - 3. * (r2))) / (r4))',
      [0]: '0.10578554691520431 * ((35. * (p.z * p.z * p.z * p.z) - 30. * (p.z * p.z) * (r2) + 3. * (r4)) / (r4))',
      [1]: '0.6690465435572892 * (((p.x * p.z) * (7. * p.z * p.z - 3. * (r2))) / (r4))',
      [2]: '0.47308734787878004 * (((p.x * p.x - p.y * p.y) * (7. * (p.z * p.z) - (r2))) / (r4))',
      [3]: '1.7701307697799304 * (((p.x * p.x - 3. * (p.y * p.y)) * p.x * p.z) / (r4))',
      [4]: '0.6258357354491761 * (((p.x * p.x) * (p.x * p.x - 3. * (p.y * p.y)) - (p.y * p.y) * (3. * (p.x * p.x) - p.y * p.y)) / (r4))'
    }
  }

  private buildMaterial (): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        rayOrigin: { value: new THREE.Vector3(0, 0, 0) },
        rayDirection: { value: new THREE.Vector3(0, 0, 0) },
        uPointSize: { value: 100 }
      },
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: true,
      extensions: {
        derivatives: false,
        fragDepth: true,
        drawBuffers: false,
        shaderTextureLOD: false
      },
      vertexShader: `
        attribute vec4 electron;
        uniform float uTime;
        uniform vec3 rayDirection;
        uniform float uPointSize;
        out vec3 lightPos;
        flat out vec4 vElectron;
        out vec4 vTime;
        out mat3 camera;
        void setCamera(out mat3 camera) {
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
          gl_PointSize = uPointSize / -mvPosition.z;
          lightPos = vec3(-1., -2., -4.);
          vTime = .1 * vec4(uTime, uTime * .5, uTime * .25, uTime * .125);
        }
      `,
      fragmentShader: `
        #define MAX_STEPS 64
        #define PLANK_LENGTH .01
        #define FOG_DIST 5.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        const vec2 swizzleStep = vec2(PLANK_LENGTH, 0);
        const vec3 gammaCorrection = vec3(1.0 / 2.2);

        uniform float uTime;
        uniform vec3 rayOrigin;
        flat in vec4 vElectron;
        in vec4 vTime;
        in mat3 camera;
        in vec3 lightPos;

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

        void rotate(inout vec2 p, in float a) {
          vec2 cs = vec2(cos(a), sin(a));
          p *= mat2(cs.x, -cs.y, cs.y, cs.x);
        }

        float getDistance(vec3 p) {
          p.z += 3.5;
          rotate(p.yz, vTime.w);
          rotate(p.xz, vTime.z);
          rotate(p.xy, vTime.w);
          float r = length(p);
          float r2 = r * r;
          float r3 = r2 * r;
          float r4 = r3 * r;
          float rThird = r * .3;
          float dist = MAX_DIST;
          ${this.options.electrons.map(e => `
          dist = min(dist, rThird - abs(${this.sphericalHarmonic[e.l][e.m]}));
          `).join("\n")}
          return dist;
        }

        vec2 cExp(float x) {
          float s = sin(x);
          return vec2(-s, s) + cos(x);
        }

        void getMaterial(inout HitObject hitObject) {
          hitObject.material.color = vec4(1., 1., 1., 1.);
          hitObject.material.diffuse = .4;
          hitObject.material.specular = .4;
          hitObject.material.ambient = .2;
          hitObject.material.shininess = 1.;

          vec3 lightDir = normalize(hitObject.point - lightPos);
          float diffuse = hitObject.material.diffuse * dot(hitObject.normal, lightDir);
          float specular = pow(max(0., hitObject.material.specular * dot(lightDir, reflect(hitObject.rayDirection, hitObject.normal))), hitObject.material.shininess);

          hitObject.material.color.xyz = 
            (hitObject.material.ambient + diffuse) 
            * pow(hitObject.material.color.xyz, gammaCorrection)
            + specular;
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
          gl_FragColor = getColor(rayOrigin, normalize(camera * vec3(uv, .6)));
        }
      `
    });
  }
}
