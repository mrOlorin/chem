<template>
    <div>
        <Nuclide :n="n" :p="p" />
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
  name: 'nuclide',
  components: {
    Nuclide: () => import('@/components/Nuclide.vue')
  }
})
export default class Nuclide extends Vue {
  @Prop(Number) private n!: number;
  @Prop(Number) private p!: number;
};
</script>
