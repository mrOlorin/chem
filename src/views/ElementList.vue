<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'element-list',
  components: {
    ElementList: () => import('@/components/ElementList.vue')
  }
})
export default class ElementList extends Vue {
};
</script>
<template>
    <div class="element-list">
        <ElementList/>
    </div>
</template>
