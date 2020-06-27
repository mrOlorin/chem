import * as THREE from 'three';

interface BackgroundMeshOptions {
  timeScale: number;
}

export default class BackgroundMesh extends THREE.Mesh {
  public readonly material: THREE.RawShaderMaterial;
  private options: BackgroundMeshOptions;

  public constructor () {
    super();
    this.options = {
      timeScale: 1
    };
    this.material = this.buildMaterial();
    this.geometry = new THREE.PlaneBufferGeometry(2, 2);
    this.onBeforeRender = this.tick.bind(this);
  }

  public tick = () => {
    this.material.uniforms.uTime.value = performance.now() * this.options.timeScale;
  }

  public buildMaterial (): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 1.0 },
        rayOrigin: { value: new THREE.Vector3(0, 0, 0) },
        rayDirection: { value: new THREE.Vector3(0, 0, 0) },
        uPointSize: { value: 1000 }
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
        uniform float uTime;
        uniform vec3 rayDirection;
        uniform float uPointSize;
        out vec4 vTime;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // gl_PointSize = uPointSize / -mvPosition.z;
          vTime = .1 * vec4(uTime, uTime * .5, uTime * .25, uTime * .125);
        }
      `,
      fragmentShader: `
        const vec3 gammaCorrection = vec3(1.0 / 2.2);

        uniform float uTime;
        in vec4 vTime;

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

        vec2 cExp(float x) {
          float s = sin(x);
          return vec2(-s, s) + cos(x);
        }

        void main() {
          gl_FragColor = .6+.4*sin(gl_PointCoord.x+gl_PointCoord.y+vTime*.01) * vec4(1);
        }
      `
    });
  }
}
