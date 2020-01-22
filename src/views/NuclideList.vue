<template>
    <div class="nuclide-list">
        <NuclideList />
    </div>
</template>

<script lang="ts">

export default {
  name: 'home',
  components: {
    NuclideList: () => import('@/components/NuclideList.vue')
  }
};
</script>
