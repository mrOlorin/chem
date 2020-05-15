<template>
    <div class="nuclide">
        <canvas id="n-canvas"/>
        <NuclideInfo :nuclide="nuclide" />
        <div id="isotope"></div>
    </div>
</template>
<script lang="ts">
import * as THREE from 'three';
import { Component, Prop, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/Nucleus';
import MultiThree from '@/MultiThree';
import ParticleBuilder from '@/chem/ParticleBuilder';
import NuclideMesh from '@/chem/NuclideMesh';
import NuclideInfo from '@/components/NuclideInfo.vue';

@Component({
  components: { NuclideInfo }
})
export default class Nuclide extends Vue {
  @Prop(Number) private p!: number;
  @Prop(Number) private n!: number;
  private threeML!: MultiThree;
  private nuclide!: Nucleus;

  private beforeMount () {
    this.nuclide = ParticleBuilder.buildNucleus(this.p, this.n);
  }

  private mounted () {
    this.threeML = new MultiThree(document.getElementById('n-canvas') as HTMLCanvasElement);
    this.threeML.timeScale = 0.002;
    this.initScene();
  }

  private initScene (): void {
    const el = document.getElementById('isotope') as HTMLElement;
    const mesh = new NuclideMesh(this.nuclide, 50, 2);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(1, 1, 1);
    scene.add(mesh);
    this.threeML.addScene(scene, el, mesh.tick);
  }
}
</script>
<style scoped>
    .element {
        position: absolute;
        right: 0;
    }
    #isotope {
        height: 600px;
        width: 600px;
    }
</style>
