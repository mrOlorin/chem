<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MultiThree from '@/MultiThree';
import ElementInfo from '@/components/ElementInfo.vue';
import { State, Action } from 'vuex-class';
import Particles from '@/store/Particles';

@Component({
  components: { ElementInfo }
})
export default class ElementList extends Vue {
  @State('Particles')
  public state!: Particles;

  @Action
  public buildAtoms!: () => void;

  private multiThree!: MultiThree;

  private beforeMount () {
    this.buildAtoms();
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
        <div class="element" v-for="(element, i) in state.atoms" v-bind:key="i">
            <ElementInfo :atom="element" :id="`element-${element.nucleus.Z}`"/>
        </div>
    </div>
</template>
