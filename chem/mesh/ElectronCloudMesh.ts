import * as THREE from 'three';
import Electron from '../paricles/Electron'

interface ElectronCloudMeshOptions {
  electrons: Array<Electron>;
  timeScale: number;
  timeShift: number;
  size: number;
}

export default class ElectronCloudMesh extends THREE.Points {
  public readonly material: THREE.RawShaderMaterial;
  public readonly options: ElectronCloudMeshOptions;

  public constructor (options: Partial<ElectronCloudMeshOptions>) {
    super();
    this.options = {
      timeScale: 0.01,
      timeShift: 0,
      size: 100,
      ...options
    } as ElectronCloudMeshOptions;
    this.material = this.buildMaterial();
    this.geometry = this.buildGeometry();
    this.onBeforeRender = this.tick.bind(this);
  }

  public tick = (_renderer: THREE.Renderer, _scene: THREE.Scene, camera: THREE.Camera) => {
    camera.getWorldPosition(this.material.uniforms.rayOrigin.value);
    camera.getWorldDirection(this.material.uniforms.rayDirection.value);
    this.material.uniforms.uTime.value = performance.now() * this.options.timeScale + this.options.timeShift;
  }

  private buildGeometry (): THREE.BufferGeometry {
    const positions = [];
    positions.push(this.position.x, this.position.y, this.position.z);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }

  private buildMaterial (): THREE.ShaderMaterial {
    const shells = this.options.electrons.reduce((acc: Array<Array<Electron>>, electron: Electron) => {
      if (!acc[electron.n]) acc[electron.n] = [];
      acc[electron.n].push(electron);
      return acc;
    }, []).filter(shell => shell.length > 0);
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        rayOrigin: { value: new THREE.Vector3(0, 0, 0) },
        rayDirection: { value: new THREE.Vector3(0, 0, 0) },
        uPointSize: { value: this.options.size }
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
          lightPos = vec3(1., 2., -3.);
          vTime = vec4(uTime, uTime * .5, uTime * .25, uTime * .125);
        }
      `,
      fragmentShader: `
        #define MAX_STEPS 128
        #define MIN_DIST .01
        #define FOG_DIST 10.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        #define swizzleStep vec2(MIN_DIST, 0)
        #define gammaCorrection vec3(0.45454545454545453)

        uniform float uTime;
        uniform vec3 rayOrigin;
        flat in vec4 vElectron;
        in vec4 vTime;
        in mat3 camera;
        in vec3 lightPos;

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

        float opSmoothUnion( float d1, float d2, float k ) {
            float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
            return mix( d2, d1, h ) - k*h*(1.0-h); }

        float opSmoothSubtraction( float d1, float d2, float k ) {
            float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
            return mix( d2, -d1, h ) + k*h*(1.0-h); }

        float opSmoothIntersection( float d1, float d2, float k ) {
            float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
            return mix( d2, d1, h ) + k*h*(1.0-h); }
        float smoothMix(float a, float b, float x) {
          float t = x*x*(3.0 - 2.0*x);
          return mix(a, b, t);
        }
        vec2 cExp(in float x) {
          float s = sin(x);
          return vec2(-s, s) + cos(x);
        }
        void transform(inout vec3 p) {
          p.z += 1.7;
          p.yz = p.zy;
          // rotate(p.yz, vTime.w);
          // rotate(p.xz, vTime.z);
          // rotate(p.xy, vTime.w);
        } 
        float getDistance(vec3 p) {
          transform(p);
          float r = length(p);
          float r2 = r * r;
          float r3 = r2 * r;
          float r4 = r3 * r;
          float rThird = r * .3;
          float sh;
          ${shells.map(shell => shell.map(e => `
            sh = max(sh, abs(${e.sphericalHarmonic}) * ${e.ms} * cos(vTime.w));
          `).join("\n")).join("\n")}
          return rThird - sh;
        }
        void getMaterial(inout HitObject hitObject) {
          vec3 p = hitObject.point;
          transform(p);
          float r = length(p);
          float r2 = r * r;
          float r3 = r2 * r;
          float r4 = r3 * r;
          float sh = 0.;
          ${shells.map(shell => shell.map(e => `
            sh += ${e.sphericalHarmonic} * ${e.ms} * cos(vTime.w);
          `).join("\n")).join("\n")}
          vec2 esh = cExp(sh);

          // vec3 magentaYellow = vec3(1., esh);
          // vec3 orangeGreen = vec3(esh, 0.);
          // vec3 purpleBlue = vec3(1.-esh, 1.);
          // vec3 redGreenLight = vec3(esh, 1.);
          // vec3 magentaYellowLight = vec3(1., esh);
          // vec3 blueGreen = 1. - vec3(esh.x, 0., esh.y);
          // vec3 pinkPink = 1. - vec3(esh.x, 0., esh.y);
          // vec3 blueGreenLight = vec3(0., esh);
          // vec3 purpleRed = vec3(esh.x, 0., esh.y);

          vec3 blueOrange = vec3(1. - esh.x, 0., 1. - esh.y);
          //vec3 redGreen = vec3(1. - esh, 0.);
          //vec3 yellowBlue = vec3(esh.x, 1., esh.y);
          //vec3 purpleGreen = vec3(0., 1. - esh);

          vec3 color = blueOrange;
          hitObject.material.color = color;
          hitObject.material.diffuse = .4;
          hitObject.material.specular = .4;
          hitObject.material.ambient = .3;
          hitObject.material.shininess = .8;

          vec3 lightDir = normalize(hitObject.point - lightPos);
          float diffuse = hitObject.material.diffuse * dot(hitObject.normal, lightDir);
          float specular = pow(max(0., hitObject.material.specular * dot(lightDir, reflect(hitObject.rayDirection, hitObject.normal))), hitObject.material.shininess);

          hitObject.material.color = 
            (hitObject.material.ambient + diffuse) 
            * pow(hitObject.material.color, gammaCorrection)
            + specular;
        }
        void rayMarch(inout HitObject obj) {
          float stepDistance;
          obj.distance = MIN_DIST;
          for (int i = 0; i < MAX_STEPS; i++) {
            stepDistance = getDistance(obj.rayOrigin + obj.rayDirection * obj.distance);
            obj.distance += stepDistance;
            if (stepDistance < MIN_DIST || obj.distance >= FOG_DIST) {
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
          return vec4(hitObject.material.color, 1.);
        }
        void main() {
          vec2 uv = gl_PointCoord - vec2(.5);
          gl_FragColor = getColor(rayOrigin, normalize(camera * vec3(uv, .6)));
        }
      `
    });
  }
}
