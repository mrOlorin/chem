<template>
    <div class="nuclide-list">
        <canvas id="n-canvas"/>
        <progress title="Инициализация сцен" ref="progress" value="0" :max="nuclidesCount"/>
        <table id="table">
            <tr v-for="(isotopes, i) in nuclides" v-bind:key="i">
                <td v-for="(nuclide, j) in isotopes" v-bind:key="j" :id="`isotope-${i}-${j}`">
                    <div v-if="nuclide">
                        <router-link :to="`/nuclide/${nuclide.Z}-${nuclide.N}`">
                            <NuclideInfo :nuclide="nuclide" />
                        </router-link>
                    </div>
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
import NuclideInfo from '@/components/NuclideInfo.vue';

@Component({
  components: { NuclideInfo }
})
export default class NuclideList extends Vue {
  private nuclides: Array<Array<Nucleus>> = [];
  private nuclidesCount: number = 0;
  private threeML!: ThreeML;

  private beforeMount () {
    this.nuclides = [];
    for (let protons = 1; protons <= 118; protons++) {
      this.nuclides[protons] = [];
      for (let neutrons = ISOTOPES[protons][0]; neutrons <= ISOTOPES[protons][1]; neutrons++) {
        this.nuclides[protons][neutrons] = ParticleBuilder.buildNucleus(protons, neutrons);
        Object.freeze(this.nuclides[protons][neutrons]);
        this.nuclidesCount++;
      }
    }
  }

  private mounted () {
    this.threeML = new ThreeML(document.getElementById('n-canvas') as HTMLCanvasElement);
    this.initScenes(25);
    this.addEventListeners();
  }

  private beforeDestroy () {
    this.threeML.stopRender();
    this.removeEventListeners();
  }

  private async initScenes (chunkSize: number): Promise<void> {
    let i = 0;
    const progressBar = this.$refs.progress as HTMLProgressElement;
    for (const isotopes of this.nuclides) {
      if (!isotopes) continue;
      for (const isotope of isotopes) {
        if (!isotope) continue;
        const el: HTMLElement | null = document.getElementById(`isotope-${isotope.Z}-${isotope.N}`);
        if (!el) continue;
        const mesh = new NuclideMesh(isotope, 12, 1.5);
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(1, 1, 1);
        scene.add(mesh);
        this.threeML.addScene(scene, el, mesh.tick);
        if (i++ % chunkSize === 0) {
          progressBar.value = i;
          await new Promise(requestAnimationFrame);
        }
      }
    }
    progressBar.hidden = true;
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
    progress {
        position: fixed;
        right: 0;
        top: 0;
    }
</style>
