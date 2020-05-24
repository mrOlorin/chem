<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ParticleBuilder from '@/chem/ParticleBuilder';
import Atom from '@/chem/Atom';
import ISOTOPES from '@/chem/literals/isotopes';

@Component({
  name: 'home',
  components: {
    ElementList: () => import('@/components/ElementList.vue')
  }
})
export default class ElementList extends Vue {
  private atoms: Array<Atom> = [];

  private async beforeMount () {
    this.buildAtoms();
  }

  private async mounted () {
    Atom.testElectronGenerator();
  }

  private buildAtoms () {
    this.atoms = [];
    for (let i = 0; i < 118; i++) {
      this.atoms[i] = ParticleBuilder.buildAtom(i + 1, ISOTOPES[i + 1][2]);
    }
  }
};
</script>
<template>
    <div class="element-list">
        <ElementList :elements="atoms"/>
    </div>
</template>
