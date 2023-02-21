<script lang="ts" setup>
import { ref }  from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const showTitle = ref(true)
const top = ref(0)
const { greaterOrEqual } = useBreakpoints(breakpointsTailwind)
const lg = greaterOrEqual('lg')

const uuid = () => crypto.randomUUID()
let y 
function updateSize({ el }, index: number, top: number, minHeight: number, padding: number) {

    const height = Math.max(el.getBoundingRect().height, minHeight)
    const paddedHeight = height + 2 * padding
    const isFixed = el.children().every(child => child.getBoundingRect().height ===paddedHeight)
    if (isFixed) return 

if (index === 0) {

    y =  top + paddedHeight

}

    el.y = y

    y += paddedHeight

    el.eachChild(child => {

child.style.height = paddedHeight

    })

    

}
</script>

<div style="width: 100%">
<button @click="showTitle = !showTitle">toggle</button>
<Echarts style="height: 600px" v-slot="{ height, width }">
<echarts-option option="title" :value="{ text: 'Aliquip cillum duis sunt in deserunt.' + width, textStyle: {  overflow:'break', width: width, fontSize: lg ? 50 : 25 } }" v-if="showTitle" @rendered="top = $event.bounds.bottom " @removed="top = 0"/>
<echarts-option option="xAxis" :value="{ type: 'category', show: false }" />
<echarts-option option="yAxis" :value="{ type: 'value', show: false }" />
<echarts-option option="grid" :value="{ top: top + 20, left: 20, bottom: 20, right: 20 }"/>
<echarts-custom-series :data="new Array(10).fill(null).map((_, index) => ({ name: new Array(Math.floor(Math.random() * 5)).fill(null).map(() => uuid()).join(' '), value: Math.floor(Math.random() * 50) }))">
<template #default="{ index, item }">
<echarts-shape :options="{ type: 'group' }" @rendered="updateSize($event, index, top, 50, 10)">
<echarts-shape :options="{ type: 'text', style: { backgroundColor: index%2?'gray': 'lightgray', text: item.name, width: width/2, overflow: 'break', verticalAlign: 'middle' } }"  />
<echarts-shape :options="{ type: 'text', x: width * .75, style: { text: item.value, backgroundColor: index%2?'gray': 'lightgray', width: width/2, overflow: 'break', verticalAlign: 'middle', align: 'center'} }" />
</echarts-shape>
</template>
</echarts-custom-series>
</Echarts>

</div>
