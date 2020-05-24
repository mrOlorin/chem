<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/Nucleus';
import ISOTOPES from '@/chem/literals/isotopes';
import ParticleBuilder from '@/chem/ParticleBuilder';

@Component({
  name: 'home',
  components: {
    NuclideList: () => import('@/components/NuclideList.vue')
  }
})
export default class NuclideList extends Vue {
  private nuclides: Array<Array<Nucleus>> = [];
  private nuclidesCount: number = 0;
  private async beforeMount () {
    this.buildNuclides();
  }

  private buildNuclides () {
    this.nuclides = [];
    for (let Z = 1; Z <= 118; Z++) {
      this.nuclides[Z] = [];
      for (let N = ISOTOPES[Z][0]; N <= ISOTOPES[Z][1]; N++) {
        this.nuclides[Z][N] = ParticleBuilder.buildNucleus(Z, N);
        this.nuclidesCount++;
      }
    }
  }
};
</script>
<template>
    <div class="nuclide-list">
        <NuclideList :nuclides="nuclides" :nuclidesCount="nuclidesCount"/>
    </div>
</template>
