<template>
    <div class="nuclide-list">
        <canvas id="c"/>
        <table id="table">
            <tr v-for="(isotopes, i) in nuclides" v-bind:key="i">
                <td v-for="(nuclide, j) in isotopes" v-bind:key="j" :id="`isotope-${i}-${j}`">
                    <svg v-if="nuclide" width="80" height="40" class="element">
                        <circle cx="75" cy="75" :r="nuclide.R * 2e15" fill="red" stroke="blue" stroke-width="2">
                            <title>Радиус ({{nuclide.R}}м)</title>
                        </circle>
                        <text y="10" x="2" font-size="0.5em">
                            <title>Массовое число</title>
                            {{nuclide.A}}
                        </text>
                        <text y="19" x="2" font-size="0.5em" >
                            <title>Атомное число</title>
                            {{nuclide.Z}}
                        </text>
                        <text y="17" :x="10 + 3 * nuclide.A.toString().length" font-size="1em">
                            {{nuclide.name}}
                        </text>
                        <text y="10" x="50" font-size="0.5em">
                            <title>Спин</title>
                            {{nuclide.spin}}ħ
                        </text>
                        <text y="19" x="50" font-size="0.5em">
                            {{nuclide.magneticMoment.toPrecision(2)}}μN
                            <title>Магнитный момент ({{nuclide.magneticMoment}}μN)</title>
                        </text>
                    </svg>
                </td>
            </tr>
        </table>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Nucleus from '@/chem/Nucleus'
import * as THREE from 'three'
import ISOTOPES from '@/chem/isotopes'
import ParticleBuilder from '@/chem/ParticleBuilder'

@Component
export default class Elements extends Vue {
  private nuclides: Array<Array<Nucleus>> = []
  private canvas!: HTMLCanvasElement
  private renderer!: THREE.WebGLRenderer
  private scenes: Array<THREE.Scene> = []
  private doRender: boolean = false

  private beforeMount () {
    this.nuclides = []
    for (let protons = 1; protons <= 118; protons++) {
      this.nuclides[protons] = []
      for (let neutrons = ISOTOPES[protons][0]; neutrons <= ISOTOPES[protons][1]; neutrons++) {
        this.nuclides[protons][neutrons] = ParticleBuilder.buildNucleus(protons, neutrons)
      }
    }
  }

  private async mounted () {
    this.initRenderer()
    this.initEvents()
    this.initScenes()
    this.adjustCanvas()
  }

  private beforeDestroy () {
    this.doRender = false
  }

  private initRenderer () {
    this.canvas = document.getElementById('c') as HTMLCanvasElement
    const context = this.canvas.getContext('webgl2', { alpha: true }) as WebGLRenderingContext
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, context, antialias: true })
    this.renderer.setClearColor(0xffffff, 1)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.initRenderLoop()
  }

  private async initEvents () {
    const f = this.$el.scrollWidth / (this.$el.scrollHeight)
    this.$el.addEventListener('wheel', (e: Event) => {
      e.preventDefault()
      window.scrollBy((e as WheelEvent).deltaY * f, (e as WheelEvent).deltaY)
    })
    document.addEventListener('scroll', (e: Event) => {
      this.adjustCanvas()
    })
    window.addEventListener('resize', (e: Event) => {
      this.adjustCanvas()
    })
    window.addEventListener('touchmove', (e: Event) => {
      this.adjustCanvas()
    })
  }

  private adjustCanvas () {
    this.canvas.style.transform = `translate(${window.scrollX}px, ${window.scrollY}px)`
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false)
    }
  }

  private initRenderLoop () {
    const dirtyHack = -95
    const area = new THREE.Vector4()
    let rect: ClientRect
    const render = (time: number) => {
      time *= 0.01
      this.renderer.setScissorTest(false)
      this.renderer.clear()
      this.renderer.setScissorTest(true)
      for (const scene of this.scenes) {
        rect = scene.userData.element.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > this.renderer.domElement.clientHeight ||
          rect.right < 0 || rect.left > this.renderer.domElement.clientWidth) {
          // off screen
          continue
        }
        time += 1.7;
        ((scene.children[0] as THREE.Points).material as THREE.ShaderMaterial).uniforms.uTime.value = time
        area.set(
          rect.left,
          this.renderer.domElement.clientHeight - rect.top + dirtyHack,
          rect.right - rect.left,
          rect.bottom - rect.top
        )
        this.renderer.setViewport(area)
        this.renderer.setScissor(area)
        this.renderer.render(scene, scene.userData.camera)
      }
    }
    this.doRender = true
    const animate = (time: number) => {
      if (this.doRender) {
        requestAnimationFrame(animate)
        render(time)
      }
    }
    animate(0)
  }

  private async initScenes (): Promise<void> {
    const material = this.buildMaterial()
    const hardcodedAspectRatio = 0.954545
    const camera = new THREE.PerspectiveCamera(90, hardcodedAspectRatio, 1, 10)
    camera.position.z = 2
    const chunkSize = 20
    let i = 0
    for (const isotopes of this.nuclides) {
      if (!isotopes) continue
      for (const isotope of isotopes) {
        if (!isotope) continue
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(1, 1, 1)
        scene.userData.element = document.getElementById(`isotope-${isotope.Z}-${isotope.N}`) as HTMLElement
        scene.userData.camera = camera
        scene.add(new THREE.Points(this.buildGeometry(isotope), material))
        this.scenes.push(scene)
        if (i++ >= chunkSize) {
          await new Promise(requestAnimationFrame)
          i = 0
        }
      }
    }
  }

  private buildGeometry (isotope: Nucleus) {
    const sphericalCurve = (a: number, t: number): [number, number, number] => {
      const q = Math.sqrt(1 + a * a * t * t)
      return [
        Math.cos(t) / q,
        -(a * t) / q,
        Math.sin(t) / q
      ]
    }

    const count = isotope.Z + isotope.N
    const positions = new Float32Array(count * 3)
    const attributes = new Float32Array(count * 3)

    const a = 1
    const scale = 1e14
    let offset = 0
    let radius
    let c: [number, number, number]
    for (let i = Number.EPSILON; i < isotope.Z; i++) {
      radius = isotope.R
      c = sphericalCurve(a / i, isotope.Z - i)
      positions[offset] = c[0] * radius * scale
      attributes[offset++] = 1
      positions[offset] = c[1] * radius * scale
      attributes[offset++] = 0
      positions[offset] = c[2] * radius * scale
      attributes[offset++] = isotope.spin
    }
    for (let i = Number.EPSILON; i < isotope.N; i++) {
      radius = isotope.R
      c = sphericalCurve(-a / i, isotope.N - i)
      positions[offset] = c[0] * radius * scale
      attributes[offset++] = 0
      positions[offset] = c[1] * radius * scale
      attributes[offset++] = 1
      positions[offset] = c[2] * radius * scale
      attributes[offset++] = isotope.spin
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('attributes', new THREE.BufferAttribute(attributes, 3))
    geometry.computeBoundingSphere()
    return geometry
  }

  buildMaterial () {
    return new THREE.ShaderMaterial({
      extensions: {
        derivatives: false,
        fragDepth: false,
        drawBuffers: true,
        shaderTextureLOD: false
      },
      uniforms: {
        uTime: { value: 0.0 },
        pointSize: { value: 15 }
      },
      vertexShader: `
        #define PI 3.141592653589793
        in vec3 attributes;
        varying vec4 vPosition;
        varying vec3 vAttributes;
        uniform float pointSize;
        uniform float uTime;
        out mat3 camera;
        out vec3 lightPos;

        vec3 getPosition(vec3 p) {
            p.z += .035 * sin(uTime * attributes.x + p.x + p.y);
            p.x += .025 * cos(uTime * attributes.y + p.x + p.y);
            return p;
        }
        void main() {
            vec3 rayDirection = vec3(0, 0, -1);
            vec3 forward = normalize(rayDirection);
            vec3 right = normalize(cross(vec3(0., 1., 0.), forward));
            vec3 up = normalize(cross(forward, right));
            camera = mat3(right, up, forward);

            vec3 p = getPosition(position);
            gl_PointSize = pointSize;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );

            vPosition = gl_Position;
            vAttributes = attributes;
            lightPos = vec3(2., 2., 2.);
        }
    `,
      fragmentShader: `
        #define PI 3.141592653589793
        #define MAX_STEPS 64
        #define PLANK_LENGTH .01
        #define FOG_DIST 11.
        #define MAX_DIST FOG_DIST
        #define FOG_COLOR vec3(1.,1.,1.)
        in vec3 lightPos;
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
            p -= vec3(0, 0, -2. - vAttributes.y * .5);
            return length(p) - .5;
        }
        Material getMaterial(vec3 p) {
            Material m;
            m.color = vec3(vAttributes.x, vAttributes.y, 0.);
            m.diffuse = .4;
            m.specular = .3;
            m.ambient = .3;
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
                if (stepDistance < plankLength) {
                    break;
                }
                if (obj.distance >= FOG_DIST) {
                    break;
                }
            }
            obj.point = rayOrigin + rayDirection * obj.distance;
        }
        vec3 getNormal(in HitObject hitObject) {
            vec2 offset = vec2(.01, 0);
            return normalize(hitObject.distance - vec3(
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
            vec3 lightDir = normalize(lightPos - hitObject.point);
            float diffuse = max(0., mat.diffuse * dot(normal, lightDir));
            float specular = pow(max(0., mat.specular * dot(lightDir, reflect(ray, normal))), mat.shininess);
            float shadow = mat.receiveShadows * softShadow(hitObject.point, lightDir) * ambientOcclusion(hitObject.point, normal);
            return (mat.ambient + diffuse * shadow) * pow(mat.color, gammaCorrection) + specular * shadow * vec3(1.);
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
    `,
      blending: THREE.MultiplyBlending,
      depthTest: true,
      transparent: true
    })
  }
}
</script>
<style>
    #c {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    .element {
        cursor: default;
        height: 80px;
        width: 80px;
        border: 1px solid #2c3e50;
        padding: 2px;
    }
</style>
