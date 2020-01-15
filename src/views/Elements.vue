<template>
    <div class="elements">
        <ElementList />
    </div>
</template>

<script lang="ts">
// @ is an alias to /src
import ElementList from '@/components/Elements.vue'

export default {
  name: 'home',
  components: {
    ElementList
  }
}
</script>
