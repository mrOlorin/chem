<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Electron } from '@/chem/paricles/Atom';

@Component({
  name: 'orbital-list',
  components: {
    OrbitalInfo: () => import('@/components/OrbitalInfo.vue')
  }
})
export default class ElementList extends Vue {
  public sblevels: Array<Array<Array<Electron>>> = [];

  private buildOrbitals () {
    const n = 5;
    for (let l = 0; l <= n - 1; l++) {
      this.sblevels[l] = [];
      for (let m = -l; m <= l; m++) {
        this.sblevels[l].push([{ n: 4, l, m, ms: 0.5 }, { n: 4, l, m, ms: -0.5 }]);
      }
    }
  }

  private beforeMount () {
    this.buildOrbitals();
  }
};
</script>
<style>
    .orbital {
        display: inline-block;
        width: 160px;
        height: 160px;
    }
</style>
<template>
    <div class="orbital-list">
        <div class="orbitals" v-for="(orbitals, i) in sblevels" v-bind:key="i">
            <div class="orbital" v-for="(electrons, j) in orbitals" v-bind:key="j">
                <OrbitalInfo :electrons="electrons" :id="`orbital-${electrons[0].n}-${electrons[0].l}-${electrons[0].m}`"/>
            </div>
        </div>
    </div>
</template>
