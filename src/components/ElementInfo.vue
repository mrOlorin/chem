<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Atom from '@/chem/paricles/Atom';
import MultiThree, { MultiThreeScene } from '@/MultiThree';
import * as THREE from 'three';
import ElementMesh from '@/chem/mesh/ElementMesh';

@Component
export default class ElementInfo extends Vue {
  @Prop(Atom) private atom!: Atom;
  private scene!: MultiThreeScene;

  public mounted () {
    this.scene = this.buildScene(this.atom);
    MultiThree.addScene(this.scene);
  }

  public beforeDestroy () {
    (this.scene.scene.children[0] as ElementMesh).dispose();
    MultiThree.removeScene(this.scene);
  }

  private buildScene (atom: Atom): MultiThreeScene {
    const mesh = new ElementMesh(atom);
    mesh.position.y -= 1;
    mesh.position.z -= 6;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element: this.$el, scene, tick: mesh.tick };
  }
}
</script>
<style>
    .element-info {
        padding: 2px;
        margin-right: 4px;
        border: 1px dashed #2c3e50;
    }
</style>
<template>
    <svg width="80" height="80" class="element-info">
        <text x="2" y="10" font-size="0.6em">
            <title>Массовое число</title>
            {{atom.nucleus.A}}
        </text>
        <text x="2" y="21" font-size="0.6em">
            <title>Атомное число</title>
            {{atom.nucleus.Z}}
        </text>
        <text :x="10 + 3 * atom.nucleus.A.toString().length" y="19" font-size="1.2em">
            {{atom.nucleus.name}}
        </text>
        <text text-anchor="end" x="79" y="10" font-size="0.7em">
            <title>{{atom.electronConfiguration}}</title>
            {{atom.electronConfigurationShort}}
        </text>
    </svg>
</template>
