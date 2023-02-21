import { EVENTS } from '@/constants'
import { Series, SeriesKey } from '@/types/series'
import { type Slots, VNode, computed, defineComponent } from 'vue'
import { normalizeAttrs } from '@/utils'
import { useChartOption } from '@/composables/useChartOption'
import type {
    CustomSeriesRenderItem,
    CustomSeriesRenderItemAPI,
    CustomSeriesRenderItemParams
} from 'echarts'

export default function <Type extends SeriesKey>(type: Type) {
    return defineComponent({
        props: {} as unknown as Readonly<Series[Type]>,
        emits: Object.values(EVENTS),
        setup(_, { emit, slots, attrs }) {
            const options = computed(() => {
                const options = { ...attrs, type } as Series[Type]

                if (options.type === 'custom' && !options.renderItem) {
                    options.renderItem = renderItemFromSlots(
                        slots,
                        options.data
                    )
                }

                return normalizeAttrs(options) as Series[Type]
            })

            useChartOption('series', options, emit)

            return () => null
        }
    })
}

/**
 * Create a custom series render item from the slots.
 */
function renderItemFromSlots(slots: Slots, data?: Series['custom']['data']) {
    const renderItem: CustomSeriesRenderItem = (params, api) => {
        const slotContent = getSlotsRenderItemContent(slots, params, api, data)

        if (slotContent) {
            return slotContent
        }

        return {
            type: 'group',
            children: []
        }
    }

    return renderItem
}

/**
 * Get the rendered content of the slots.
 */
function getSlotsRenderItemContent(
    slots: Slots,
    params: CustomSeriesRenderItemParams,
    api: CustomSeriesRenderItemAPI,
    data?: Series['custom']['data']
) {
    const rendered = slots.default?.({
        params,
        api,
        index: params.dataIndex,
        length: params.dataInsideLength,
        item: data?.[params.dataIndex]
    })

    const slot = rendered?.at(0)

    if (slot) {
        return slotToJson(slot)
    }
}

/**
 * Convert a slot to JSON.
 */
function slotToJson(slot: VNode) {
    const props = normalizeAttrs(slot.props ?? {})

    if (slot.type === 'text' && !props.style?.text) {
        props.style ??= {}
        props.style.text = String(slot.children).trim()
    }

    return {
        type: slot.type,
        ...props,
        children: Array.isArray(slot.children)
            ? slot.children.map(slotToJson)
            : []
    }
}
