<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Action, State } from 'vuex-class';
import Particles from '@/store/Particles';

@Component({
  name: 'element-list',
  components: {
    ElementInfo: () => import('@/components/ElementInfo.vue')
  }
})
export default class ElementList extends Vue {
  @State('Particles')
  public state!: Particles;

  @Action
  public buildAtoms!: () => void;

  private beforeMount () {
    this.buildAtoms();
  }
};
</script>
<style>
    .element {
        display: inline-block;
    }
</style>
<template>
    <div class="element-list">
        <div class="element" v-for="(element, i) in state.atoms" v-bind:key="i">
            <ElementInfo :atom="element" :id="`element-${element.nucleus.Z}`"/>
        </div>
    </div>
</template>
