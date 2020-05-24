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
        <text x="2" y="10" font-size="0.6em">
            <title>Массовое число</title>
            {{atom.nucleus.A}}
        </text>
        <text x="2" y="21" font-size="0.6em">
            <title>Атомное число</title>
            {{atom.nucleus.Z}}
        </text>
        <text :x="10 + 3 * atom.nucleus.A.toString().length" y="19" font-size="1.2em">
            {{atom.nucleus.name}}
        </text>
        <text text-anchor="end" x="79" y="10" font-size="0.6em">
            <title>{{atom.electronConfiguration}}</title>
            {{atom.electronConfigurationShort}}
        </text>
        <text text-anchor="end" x="79" y="21" font-size="0.6em">
            <title>Масса {{Math.round((atom.mass + Number.EPSILON) * 10000) / 10000}}МэВ</title>
            {{atom.mass.toPrecision(1)}}
        </text>
    </svg>
</template>
