import { INSTANCE } from '@/constants'
import {
    type PropType,
    defineComponent,
    h,
    provide,
    reactive,
    ref,
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
        },
        ssr: {
            type: Boolean
        }
    } as unknown as {
        options: PropType<EChartsOption>
        ssr: PropType<boolean>
    },
    inheritAttrs: false,
    setup(props, { attrs }) {
        const container = shallowRef<HTMLElement>()
        const size = reactive(useElementBounding(container))
        const instance = useChart(container, props.options, props.ssr)
        const dataUrl = ref<string>()

        provide(INSTANCE, instance)

        return () => {
            if (unref(dataUrl)) {
                return h('img', {
                    src: unref(dataUrl),
                    style: { objectFit: 'contain' }
                })
            }

            const slots = unref(instance)
                ? useSlots().default?.({
                      instance,
                      container,
                      ...size
                  })
                : []

            if (props.ssr) {
                unref(instance)?.on('rendered', () => {
                    dataUrl.value = unref(instance)?.getSvgDataURL()
                    unref(instance).off('rendered')
                })
            }

            return h('div', { ref: container, ...attrs }, slots)
        }
    }
})
