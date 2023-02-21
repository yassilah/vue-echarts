import { INSTANCE } from '@/constants'
import {
    type PropType,
    defineComponent,
    h,
    provide,
    reactive,
    shallowRef,
    unref,
    useSlots
} from 'vue'
import { useChart } from '@/composables/useChart'
import { useElementBounding } from '@vueuse/core'
import type { EChartsOption } from 'echarts'

export default defineComponent({
    props: {
        options: {
            type: Object
        }
    } as unknown as { options: PropType<EChartsOption> },
    setup(props) {
        const container = shallowRef<HTMLElement>()
        const size = reactive(useElementBounding(container))
        const instance = useChart(container, () => props.options)

        provide(INSTANCE, instance)

        return () => {
            const slots = unref(instance)
                ? useSlots().default?.({
                      instance,
                      container,
                      ...size,
                      options: props.options
                  })
                : []

            return h('div', { ref: container }, slots)
        }
    }
})
