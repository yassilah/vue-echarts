<script setup lang="ts">
import {
    OptionsGrid,
    OptionsXAxis,
    OptionsYAxis,
    SeriesCustom,
    SeriesLine
} from 'vue-echarts/components'
import { ref } from 'vue'

const data = ref([5, 20, 36, 10, 10, 20])

setInterval(() => {
    data.value = data.value.map(() => Math.floor(Math.random() * 10))
}, 1000)

function onFinished() {
    console.log('finished')
}
</script>

<template>
    <ECharts style="height: 500px; width: 500px">
        <OptionsGrid />
        <OptionsXAxis :show="false" />
        <OptionsYAxis />
        <SeriesLine :data="data" @finished="onFinished" />
        <SeriesCustom
            :render-item="
                () => ({
                    type: 'group',
                    children: [
                        { type: 'rect', shape: { width: 100, height: 100 } }
                    ]
                })
            "
            :data="data"
        />
    </ECharts>
</template>
