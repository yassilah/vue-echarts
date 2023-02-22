<script setup lang="ts">
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
    <ECharts v-slot="{ width }" style="height: 100vh; width: 100vw">
        <SeriesCustom
            v-slot="{ index, length, item }"
            :data="data"
            coordinate-system="none"
        >
            <ShapeGroup :x="(index * width) / length">
                <ShapeRect
                    :shape:width="20"
                    :shape:height="10"
                    style:fill="yellow"
                />
                <ShapeText
                    style:rich:name:font-size="50"
                    style:rich:value:font-size="20"
                    :style:fill="randomHexColor()"
                >
                    <span name="name">{{ item.name }}</span>
                    <span name="value">{{ item.value }}</span>
                </ShapeText>
            </ShapeGroup>
        </SeriesCustom>
    </ECharts>
</template>
