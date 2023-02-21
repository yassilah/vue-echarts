import { EVENTS } from '@/constants'
import { Series, SeriesKey } from '@/types/series'
import { computed, defineComponent, useAttrs } from 'vue'
import { normalizeAttrs } from '@/utils'
import { toReactive } from '@vueuse/core'
import { useChartOption } from '@/composables/useChartOption'

export default function <Type extends SeriesKey>(type: Type) {
    return defineComponent({
        props: {} as unknown as Readonly<Series[Type]>,
        emits: Object.values(EVENTS),
        setup(_, { emit }) {
            const attrs = useAttrs() as unknown as Series[Type]
            const props = computed(() => normalizeAttrs({ ...attrs, type }))

            console.log(props.value)
            useChartOption('series', toReactive(props), emit)

            return () => null
        }
    })
}
