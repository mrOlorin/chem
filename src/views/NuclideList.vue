<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'home',
  components: {
    NuclideList: () => import('@/components/NuclideList.vue')
  }
})
export default class NuclideList extends Vue {
};
</script>
<template>
    <div class="nuclide-list">
        <NuclideList/>
    </div>
</template>
