<template>
    <div class="nuclide-list">
        <canvas id="n-canvas" />
        <table id="table">
            <tr v-for="(isotopes, i) in nuclides" v-bind:key="i">
                <td v-for="(nuclide, j) in isotopes" v-bind:key="j" :id="`isotope-${i}-${j}`">
                    <svg v-if="nuclide" width="80" height="40" class="element">
                        <circle cx="75" cy="75" :r="nuclide.R * 2e15" fill="red" stroke="blue" stroke-width="2">
                            <title>Радиус ({{nuclide.R}}м)</title>
                        </circle>
                        <text y="10" x="2" font-size="0.6em">
                            <title>Массовое число</title>
                            {{nuclide.A}}
                        </text>
                        <text y="21" x="2" font-size="0.6em">
                            <title>Атомное число</title>
                            {{nuclide.Z}}
                        </text>
                        <text y="19" :x="10 + 3 * nuclide.A.toString().length" font-size="1.2em">
                            {{nuclide.name}}
                        </text>
                        <text y="10" x="50" font-size="0.6em">
                            <title>Спин</title>
                            {{nuclide.spin}}ħ
                        </text>
                        <text y="21" x="50" font-size="0.6em">
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
import * as THREE from 'three';
import { Component, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/Nucleus';
import ISOTOPES from '@/chem/isotopes';
import ParticleBuilder from '@/chem/ParticleBuilder';
import NuclideMesh from '@/chem/NuclideMesh';
import ThreeML from '@/ThreeML';

@Component
export default class Elements extends Vue {
  private nuclides: Array<Array<Nucleus>> = [];
  private threeML!: ThreeML;

  private beforeMount () {
    this.nuclides = [];
    for (let protons = 1; protons <= 118; protons++) {
      this.nuclides[protons] = [];
      for (let neutrons = ISOTOPES[protons][0]; neutrons <= ISOTOPES[protons][1]; neutrons++) {
        this.nuclides[protons][neutrons] = ParticleBuilder.buildNucleus(protons, neutrons);
      }
    }
  }

  private async mounted () {
    this.threeML = new ThreeML(document.getElementById('n-canvas') as HTMLCanvasElement);
    this.initScenes();
    this.addEventListeners();
  }

  private beforeDestroy () {
    this.threeML.stopRender();
    this.removeEventListeners();
  }

  private async initScenes (): Promise<void> {
    const chunkSize = 13;
    let i = 0;
    for (const isotopes of this.nuclides) {
      if (!isotopes) continue;
      for (const isotope of isotopes) {
        if (!isotope) continue;
        const el = document.getElementById(`isotope-${isotope.Z}-${isotope.N}`) as HTMLElement;
        const mesh = new NuclideMesh(isotope);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(1, 1, 1);
        scene.add(mesh);
        this.threeML.addScene(scene, el, mesh.tick);
        if (i++ % chunkSize === 0) {
          await new Promise(requestAnimationFrame);
        }
      }
    }
  }

  private addEventListeners () {
    this.$el.addEventListener('wheel', this.onWheel);
  }

  private removeEventListeners () {
    this.$el.removeEventListener('wheel', this.onWheel);
  }

  private onWheel (e: Event) {
    const f = this.$el.scrollWidth / (this.$el.scrollHeight);
    e.preventDefault();
    window.scrollBy((e as WheelEvent).deltaY * f, (e as WheelEvent).deltaY);
  }
}
</script>
<style>
    .element {
        cursor: default;
        height: 80px;
        width: 80px;
        border: 1px solid #2c3e50;
        padding: 2px;
    }
</style>
