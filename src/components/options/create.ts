import { EVENTS } from '@/constants'
import { computed, defineComponent, useAttrs } from 'vue'
import { normalizeAttrs } from '@/utils'
import { toReactive } from '@vueuse/core'
import { useChartOption } from '@/composables/useChartOption'
import type { Option, OptionKey } from '@/types'

export default function <Name extends OptionKey>(name: Name) {
    return defineComponent({
        props: {} as unknown as Readonly<Option[Name]>,
        emits: Object.values(EVENTS),
        setup(_, { emit }) {
            const attrs = useAttrs()
            const props = computed(() => normalizeAttrs(attrs))

            useChartOption(name, toReactive(props) as Option[Name], emit)

            return () => null
        }
    })
}
