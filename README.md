# Vue + ECharts = 🚀

This package is a wrapper around [Apache Echarts](https://echarts.apache.org/) to allow for creating complex charts with the simplicity of Vue SFCs.

## Features

* [x] `ECharts` wrapper component
* [x] Auto-generation of components for all `options`
* [x] Auto-generation of components for all `series`
* [x] Auto-generation of components for all `shapes`
* [x] Global components injection using plugin
* [x] Separate components by concern
* [x] Fully typed components 

## Installation

```bash
npm install echarts @yassidev/vue-echarts
```

You can then either install the plugin in your Vue app and get all components globally registered:

```ts
import VueEcharts from '@yassidev/vue-echarts'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(VueEcharts).mount('#app')
```

Or you can import each component separately:

```vue
<script setup lang="ts">
import { ECharts, OptionXAxis, SeriesBar } from '@yassidev/vue-echarts/components'
import { YAxis } from '@yassidev/vue-echarts/components/options'
</script>

<template>
    <ECharts>
        <OptionXAxis />
        <YAxis />
        <SeriesBar />
    </ECharts>
</template>
```

That's it! 

## Options

You may pass any option you would set in your ECharts configuration as props on each component. Those props are reactive and will trigger a `lazy` re-rendering of the chart.

```vue
<script setup lang="ts">
const data = ref([3, 4, 2, 2])
</script>

<template>
    <ECharts>
        <OptionXAxis :show="false" />
        <OptionYAxis name="My Y Axis" />
        <SeriesBar :data="data" />
    </ECharts>
</template>
```

You can also pass nested props using a colon notation.

```vue
<script setup lang="ts">
const data = ref([3, 4, 2, 2])
</script>

<template>
    <ECharts>
        <OptionXAxis axis-label:align:="center" />
        <!-- OR -->
         <OptionXAxis :axis-label="{ align: 'center' }" />
    </ECharts>
</template>
```

## Custom Series

Custom series are often complex as they need a `renderItem` method to return all custom elements to be rendered. Using components makes it a little easier:

```vue
<script setup lang="ts">
const data = ref([3, 4, 2, 2])
const color = ref('red')
</script>

<template>
    <ECharts  v-slot="{ width }">
        <SeriesCustom :data="data" coordinate-system="none" v-slot="{ index, item, api, params, length}">
            <ShapeGroup :x="index * width/length">
                <ShapeRect style:fill="blue" :shape="{ width: width/length, height: width/length }" />
                <ShapeText>
                    Simple text
                </ShapeText>
                <ShapeText :style:rich:title:fill="color">
                    <span name="title">more complex</span>
                    <span>text</span>
                </ShapeText>
            </ShapeGroup>
        </SeriesCustom>
    </ECharts>
</template>
```
