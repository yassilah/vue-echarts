<script setup lang="ts">
import { SeriesCustom } from 'vue-echarts/components'
import { ref } from 'vue'

const data = ref(
    [5, 20, 36, 10, 10, 20].map((item, index) => {
        return {
            name: `#${index} ${item}`,
            value: item
        }
    })
)

function shuffle() {
    const arr = data.value
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
}

function randomHexColor() {
    return `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padEnd(6, '0')}`
}

setInterval(() => {
    shuffle()
}, 5000)
</script>

<template>
    <ECharts v-slot="{ height, width }" style="height: 100vh; width: 100vw">
        <SeriesCustom :data="data" coordinate-system="none">
            <template #default="{ index, length, item }">
                <group
                    :y="(index * height) / length"
                    :name="item.name"
                    :silent="true"
                    :update-animation:duration="3000"
                    update-animation:easing="cubicInOut"
                >
                    <rect
                        :name="item.name + '-rect'"
                        :transition="['style']"
                        :update-animation:duration="3000"
                        :style:fill="index % 2 ? randomHexColor() : 'lightgray'"
                        :shape:width="width"
                        :shape:height="height / length"
                    />

                    <text
                        :style:font-size="18"
                        style:font-weight="bold"
                        style:align="left"
                        :y="height / length / 2"
                        :x="width / 4"
                        :style:height="height / length"
                        style:vertical-align="middle"
                        :style:width="width / 2"
                        style:fill="white"
                    >
                        {{ item.name }}
                    </text>

                    <text
                        :style:font-size="12"
                        style:font-weight="bold"
                        style:align="center"
                        :y="height / length / 2"
                        :x="width / 4 + width / 2"
                        :style:height="height / length"
                        :style:width="width / 2"
                        style:vertical-align="middle"
                    >
                        {{ item.value }}
                    </text>
                </group>
            </template>
        </SeriesCustom>
    </ECharts>
</template>
