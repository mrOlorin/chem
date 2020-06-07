<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/paricles/Nucleus';
import ISOTOPES from '@/chem/literals/isotopes';
import MultiThree, { MultiThreeScene } from '@/MultiThree';
import NucleusMesh from '@/chem/mesh/NucleusMesh';
import * as THREE from 'three';

@Component
export default class NuclideInfo extends Vue {
  @Prop(Nucleus) private nuclide!: Nucleus;
  private elements = ISOTOPES.map(I => I[2]);
  private scene!: MultiThreeScene;

  public mounted () {
    this.scene = this.buildScene(this.nuclide);
    MultiThree.addScene(this.scene);
  }

  public beforeDestroy () {
    (this.scene.scene.children[0] as NucleusMesh).dispose();
    MultiThree.removeScene(this.scene);
  }

  private buildScene (nucleus: Nucleus): MultiThreeScene {
    const mesh = new NucleusMesh(nucleus);
    mesh.position.y -= 0.2;
    mesh.position.z -= 0.007 * nucleus.Z;
    const scene = new THREE.Scene();
    scene.add(mesh);
    return { element: this.$el, scene, tick: mesh.tick };
  }
}
</script>
<style>
    .nuclide {
        height: 80px;
        width: 80px;
        border: 1px dashed #2c3e50;
    }

    .is-element {
        border: 2px solid green;
        border-radius: 5px;
    }
</style>
<template>
    <svg :id="`isotope-${nuclide.Z}-${nuclide.N}`" class="nuclide"
         v-bind:class="{ ['is-element']: nuclide.N - elements[nuclide.Z] === 0 }">
        <text x="2" y="10" font-size="0.6em">
            <title>Массовое число</title>
            {{nuclide.A}}
        </text>
        <text x="2" y="21" font-size="0.6em">
            <title>Атомное число</title>
            {{nuclide.Z}}
        </text>
        <text x="2" y="32" font-size="0.6em">
            <title>Число нейтронов</title>
            {{nuclide.N}}
        </text>
        <text :x="10 + 3 * nuclide.A.toString().length" y="19" font-size="1.2em">
            {{nuclide.name}}
        </text>
        <text text-anchor="end" x="79" y="10" font-size="0.6em">
            <title>Радиус {{nuclide.R}}м</title>
            {{(nuclide.R).toPrecision(4)}}
        </text>
    </svg>
</template>
