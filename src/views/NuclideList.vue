<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import Particles from '@/store/Particles';
import ISOTOPES from '@/chem/literals/isotopes';

@Component({
  name: 'nuclide-list',
  components: {
    NuclideInfo: () => import('@/components/NuclideInfo.vue')
  }
})
export default class NuclideList extends Vue {
  @State('Particles')
  public particles!: Particles;

  @Action
  public buildNuclides!: () => void;

  protected ISOTOPES: Array<[number, number, number]> = ISOTOPES;

  private beforeMount () {
    this.buildNuclides();
  }

  public mounted () {
    this.$el.addEventListener('wheel', this.onWheel);
  }

  private beforeDestroy () {
    this.$el.removeEventListener('wheel', this.onWheel);
  }

  private onWheel (e: Event) {
    const f = this.$el.scrollWidth / (this.$el.scrollHeight);
    e.preventDefault();
    window.scrollBy((e as WheelEvent).deltaY * f, (e as WheelEvent).deltaY);
  }
};
</script>
<template>
    <div class="nuclide-list">
        <table>
            <tr v-for="(isotopes, i) in particles.nuclides" v-bind:key="i">
                <td :colspan="ISOTOPES[i][0] + 1"></td>
                <td v-for="(nuclide, j) in isotopes" v-bind:key="j">
                    <NuclideInfo v-if="nuclide" v-bind:nuclide="nuclide"/>
                </td>
            </tr>
        </table>
    </div>
</template>
