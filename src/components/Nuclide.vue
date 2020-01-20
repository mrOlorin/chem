<template>
    <svg width="80" height="80" class="element">
        <circle v-if="false" cx="75" cy="75" :r="nuclide.R * 2e15" fill="red" stroke="blue" stroke-width="2">
            <title>Радиус ({{nuclide.R}}м)</title>
        </circle>
        <text y="10" x="2" font-size="0.6em">
            <title>Массовое число</title>
            {{nuclide.A}}
        </text>
        <text y="21" x="2" font-size="0.6em">
            <title>Атомное число</title>
            {{nuclide.Z}}
        </text>
        <text y="19" :x="10 + 3 * nuclide.A.toString().length" font-size="1.2em">
            {{nuclide.name}}
        </text>
        <text y="10" x="50" font-size="0.6em">
            {{nuclide.magneticMoment.toPrecision(2)}}μN
            <title>Магнитный момент ({{nuclide.magneticMoment}}μN)</title>
        </text>
        <text y="21" x="45" font-size="0.6em">
            {{nuclide.bindingEnergy.toPrecision(2)}}
            <title>Энергия связи ({{nuclide.bindingEnergy}}МэВ)</title>
        </text>
    </svg>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/Nucleus';

@Component
export default class Nuclide extends Vue {
  @Prop(Nucleus) private nuclide!: Nucleus;
}
</script>
<style>
    .element {
        cursor: default;
        height: 80px;
        width: 80px;
        border: 1px solid #2c3e50;
        padding: 2px;
    }
</style>
