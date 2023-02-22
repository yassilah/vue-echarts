import { EVENTS } from '@/constants'
import { defineComponent } from 'vue'
import { normalizeAttrs } from '@/utils'
import { useChartOption } from '@/composables/useChartOption'
import type { Option, OptionKey } from '@/types'

export default function <Name extends OptionKey>(name: Name) {
    return defineComponent({
        props: {} as unknown as Readonly<Option[Name]>,
        emits: Object.values(EVENTS),
        setup(_, { emit, attrs }) {
            function getOptions() {
                return normalizeAttrs(attrs)
            }

            useChartOption(name, getOptions, emit)

            return () => null
        }
    })
}
