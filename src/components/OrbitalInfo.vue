<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MultiThree, { MultiThreeScene } from '@/MultiThree';
import * as THREE from 'three';
import { Electron } from '@/chem/paricles/Atom';
import ElectronCloudMesh from '@/chem/mesh/ElectronCloudMesh';

@Component
export default class OrbitalInfo extends Vue {
  @Prop() private electrons!: Array<Electron>;
  private scene!: MultiThreeScene;

  public mounted () {
    this.scene = this.buildScene(this.electrons);
    MultiThree.addScene(this.scene);
  }

  public beforeDestroy () {
    MultiThree.removeScene(this.scene);
  }

  private buildScene (electrons: Array<Electron>): MultiThreeScene {
    const mesh = new ElectronCloudMesh({ electrons, timeScale: 1 });
    mesh.options.timeScale = 0.1;
    mesh.position.z -= 7;
    const scene = new THREE.Scene();
    scene.add(mesh);
    mesh.matrixAutoUpdate = true;
    return { element: this.$el, scene };
  }
}
</script>
<template>
    <svg :id="`orbital-${electrons[0].n}-${electrons[0].l}-${electrons[0].m}`" class="orbital">
        <text y="100%" x="50%" text-anchor="middle" font-size="0.6em">
            n: {{electrons[0].n}} l: {{electrons[0].l}} m: {{electrons[0].m}}
        </text>
    </svg>
</template>
