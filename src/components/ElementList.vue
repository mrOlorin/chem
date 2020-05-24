<script lang="ts">
import * as THREE from 'three';
import { Component, Prop, Vue } from 'vue-property-decorator';
import MultiThree from '@/MultiThree';
import Atom from '@/chem/Atom';
import ElementMesh from '@/chem/mesh/ElementMesh';
import ElementInfo from '@/components/ElementInfo.vue';

@Component({
  components: { ElementInfo }
})
export default class ElementList extends Vue {
  @Prop(Array) private elements!: Array<Atom>;
  private multiThree!: MultiThree;

  private async mounted () {
    this.multiThree = new MultiThree(this.$refs.scene as HTMLCanvasElement);
    this.initScenes(10);
  }

  private async beforeDestroy () {
    this.multiThree.stopRender();
  }

  private async initScenes (chunkSize: number): Promise<void> {
    let i = 0;
    const backgroundColor = new THREE.Color(1, 1, 1);
    for (const atom of this.elements) {
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
        <div class="element" v-for="(element, i) in elements" v-bind:key="i" >
            <ElementInfo :atom="element" :id="`element-${element.nucleus.Z}`"/>
        </div>
    </div>
</template>
