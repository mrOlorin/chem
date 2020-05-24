<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Nucleus from '@/chem/Nucleus';

@Component
export default class NuclideInfo extends Vue {
  @Prop(Nucleus) private nuclide!: Nucleus;
}
</script>
<style>
    .nuclide {
        height: 80px;
        width: 80px;
        border: 1px solid #2c3e50;
    }
</style>
<template>
    <svg class="nuclide">
        <text x="2" y="10" font-size="0.6em">
            <title>Массовое число</title>
            {{nuclide.A}}
        </text>
        <text x="2" y="21" font-size="0.6em">
            <title>Атомное число</title>
            {{nuclide.Z}}
        </text>
        <text :x="10 + 3 * nuclide.A.toString().length" y="19" font-size="1.2em">
            {{nuclide.name}}
        </text>
        <text text-anchor="end" x="79" y="10" font-size="0.6em">
            <title>Энергия связи {{nuclide.bindingEnergy}} МэВ</title>
            {{nuclide.bindingEnergy.toPrecision(4)}}
        </text>
    </svg>
</template>
