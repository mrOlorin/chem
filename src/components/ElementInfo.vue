<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Atom from '@/chem/Atom';

@Component
export default class ElementInfo extends Vue {
  @Prop(Atom) private atom!: Atom;
}
</script>
<style>
    .element-info {
        border: 1px solid #2c3e50;
        padding: 2px;
        margin-right: 4px;
        margin-bottom: 4px;
    }
</style>
<template>
    <svg width="80" height="80" class="element-info">
        <text y="10" x="2" font-size="0.6em">
            <title>Массовое число</title>
            {{atom.nucleus.A}}
        </text>
        <text y="21" x="2" font-size="0.6em">
            <title>Атомное число</title>
            {{atom.nucleus.Z}}
        </text>
        <text y="19" :x="10 + 3 * atom.nucleus.A.toString().length" font-size="1.2em">
            {{atom.nucleus.name}}
        </text>
        <text y="10" x="68" font-size="0.6em">
            <title>{{atom.electronConfiguration}}</title>
            e
        </text>
    </svg>
</template>
