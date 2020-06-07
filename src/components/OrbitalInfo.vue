<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MultiThree, { MultiThreeScene } from '@/MultiThree';
import NucleusMesh from '@/chem/mesh/NucleusMesh';
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
    (this.scene.scene.children[0] as NucleusMesh).dispose();
    MultiThree.removeScene(this.scene);
  }

  private buildScene (electrons: Array<Electron>): MultiThreeScene {
    const mesh = new ElectronCloudMesh(electrons);
    mesh.position.y -= 0.2;
    const scene = new THREE.Scene();
    scene.add(mesh);
    mesh.matrixAutoUpdate = true;
    return { element: this.$el, scene, tick: mesh.tick };
  }
}
</script>
<template>
    <svg :id="`orbital-${electrons[0].n}-${electrons[0].l}-${electrons[0].m}`" class="orbital">
        <text x="50" y="100" text-anchor="middle" font-size="0.6em">
            {{electrons[0].n}}, {{electrons[0].l}}, {{electrons[0].m}}
        </text>
    </svg>
</template>
