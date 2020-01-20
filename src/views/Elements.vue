<template>
    <div class="elements">
        <Nuclides />
    </div>
</template>

<script lang="ts">

export default {
  name: 'home',
  components: {
    Nuclides: () => import('@/components/Nuclides.vue')
  }
};
</script>
