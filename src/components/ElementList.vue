<script lang="ts">
import * as THREE from 'three';
import { Component, Vue } from 'vue-property-decorator';
import MultiThree from '@/MultiThree';
import ElementMesh from '@/chem/mesh/ElementMesh';
import ElementInfo from '@/components/ElementInfo.vue';
import { State, Action } from 'vuex-class';
import Particles from '@/store/Particles';

@Component({
  components: { ElementInfo },
})
export default class ElementList extends Vue {
  @State('Particles')
  public state!: Particles;

  @Action
  public buildAtoms!: () => void;

  private multiThree!: MultiThree;

  private beforeMount () {
    this.buildAtoms();
  }

  private mounted () {
    this.multiThree = new MultiThree(this.$refs.scene as HTMLCanvasElement);
    this.initScenes(20);
  }

  private async beforeDestroy () {
    this.multiThree.stopRender();
  }

  private async initScenes (chunkSize: number): Promise<void> {
    if (this.state.atoms.length === 0) {
      this.$watch('state.atoms', () => {
        this.initScenes(chunkSize);
      });
      return;
    }
    let i = 0;
    const backgroundColor = new THREE.Color(1, 1, 1);
    for (const atom of this.state.atoms) {
      if (!atom) continue;
      const el: HTMLElement | null = document.getElementById(`element-${atom.nucleus.Z}`);
      if (!el) continue;
      const mesh = new ElementMesh(atom);
      mesh.position.y -= 0.2;
      mesh.position.z -= 0.006 * atom.nucleus.Z;
      const scene = new THREE.Scene();
      scene.background = backgroundColor;
      scene.add(mesh);
      this.multiThree.addScene(scene, el, mesh.tick);
      if (i++ % chunkSize === 0) {
        await new Promise(requestAnimationFrame);
      }
    }
  }
}
</script>
<style>
    .element {
        display: inline-block;
    }
</style>
<template>
    <div class="element-list">
        <canvas ref="scene"/>
        <div v-if="state.atoms && state.atoms.length > 0">
            <div class="element" v-for="(element, i) in state.atoms" v-bind:key="i">
                <ElementInfo :atom="element" :id="`element-${element.nucleus.Z}`"/>
            </div>
        </div>
    </div>
</template>
