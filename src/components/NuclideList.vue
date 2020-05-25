<script lang="ts">
import * as THREE from 'three';
import { Component, Vue } from 'vue-property-decorator';
import NucleusMesh from '@/chem/mesh/NucleusMesh';
import MultiThree from '@/MultiThree';
import NuclideInfo from '@/components/NuclideInfo.vue';
import { Action, State } from 'vuex-class';
import Particles from '@/store/Particles';

@Component({
  components: { NuclideInfo }})
export default class NuclideList extends Vue {
  private nuclidesCount: number = 3000;

  @State('Particles')
  public state!: Particles;

  @Action
  public buildNuclides!: () => void;

  private multiThree!: MultiThree;

  private beforeMount () {
    this.buildNuclides();
  }

  private async mounted () {
    if (!this.multiThree) {
      this.multiThree = new MultiThree(this.$refs.scene as HTMLCanvasElement);
    }
    this.initScenes(10);
    this.addEventListeners();
  }

  private async beforeDestroy () {
    this.multiThree.stopRender();
    this.removeEventListeners();
  }

  private async initScenes (chunkSize: number): Promise<void> {
    if (this.state.nuclides.length === 0) {
      this.$watch('state.nuclides', () => {
        this.initScenes(chunkSize);
      });
      return;
    }
    let i = 0;
    const progressBar = this.$refs.progress as HTMLProgressElement;
    const backgroundColor = new THREE.Color(1, 1, 1);
    for (const isotopes of this.state.nuclides) {
      if (!isotopes) continue;
      for (const nucleus of isotopes) {
        if (!nucleus) continue;
        const el: HTMLElement | null = document.getElementById(`isotope-${nucleus.Z}-${nucleus.N}`);
        if (!el) continue;
        const mesh = new NucleusMesh(nucleus);
        mesh.position.y -= 0.2;
        mesh.position.z -= 0.006 * nucleus.Z;
        const scene = new THREE.Scene();
        scene.background = backgroundColor;
        scene.add(mesh);
        this.multiThree.addScene(scene, el, mesh.tick);
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
    .nuclide-row {
        border-spacing: revert;
    }
</style>
<template>
    <div class="nuclide-list">
        <canvas ref="scene"/>
        <progress title="Инициализация сцен" ref="progress" value="0" :max="nuclidesCount"/>
        <table id="table" v-if="state.nuclides.length > 0">
            <tr class="nuclide-row" v-for="(isotopes, i) in state.nuclides" v-bind:key="i">
                <td v-for="(nuclide, j) in isotopes" v-bind:key="j">
                    <NuclideInfo v-if="nuclide" :nuclide="nuclide" :id="`isotope-${i}-${j}`"/>
                </td>
            </tr>
        </table>
    </div>
</template>
