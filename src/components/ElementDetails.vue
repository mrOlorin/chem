<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Atom from '@/chem/paricles/Atom';
import MultiThree, { MultiThreeScene } from '@/MultiThree';
import * as THREE from 'three';
import ElementMesh from '@/chem/mesh/ElementMesh';

@Component
export default class ElementDetails extends Vue {
  @Prop(Atom) private atom!: Atom;
  private scene!: MultiThreeScene;
  private mesh!: ElementMesh;

  public mounted () {
    this.scene = this.buildScene(this.atom);
    MultiThree.addScene(this.scene);
    this.$el.addEventListener('wheel', this.onWheel.bind(this));
  }

  public beforeDestroy () {
    MultiThree.removeScene(this.scene);
    this.$el.removeEventListener('wheel', this.onWheel);
  }

  private buildScene (atom: Atom): MultiThreeScene {
    this.mesh = new ElementMesh({ atom, timeScale: 0.1 });
    const scene = new THREE.Scene();
    scene.add(this.mesh);
    return { element: this.$refs.scene as HTMLElement, scene };
  }

  private onWheel = (e: Event) => {
    const camera: any = MultiThree.camera;
    camera.position.z += Math.sign((e as WheelEvent).deltaY) * 0.01;
    console.log(camera.position.z);
    camera.updateProjectionMatrix();
  }
}
</script>
<style>
    .scene {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: -1;
    }
</style>
<template>
    <div>
        <div class="scene" ref="scene"></div>
        <svg width="80" height="80" class="element-details">
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
    </div>
</template>
