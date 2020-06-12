<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import ParticleBuilderCached from '@/chem/ParticleBuilderCached';
import ISOTOPES from '@/chem/literals/isotopes';
import Atom from '@/chem/paricles/Atom';
import { MultiThreeScene } from '@/MultiThree';

@Component({
  name: 'element-view',
  components: {
    ElementDetails: () => import('@/components/ElementDetails.vue')
  }
})
export default class Element extends Vue {
  @Prop(Number) private Z!: number;
  private atom!: Atom;
  private scene!: MultiThreeScene;

  private beforeMount () {
    this.atom = ParticleBuilderCached.buildAtom(this.Z, ISOTOPES[this.Z][2]);
  }
};
</script>
<template>
    <div>
        <ElementDetails :atom="atom"/>
    </div>
</template>
