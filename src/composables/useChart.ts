import { type ECharts, type EChartsOption, init } from 'echarts'
import {
    type MaybeElementRef,
    isFunction,
    tryOnUnmounted,
    useResizeObserver
} from '@vueuse/core'
import { computed, shallowRef, unref, watchEffect } from 'vue'
import type { ReactiveParam } from '@/types'

/**
 * Use ECharts instance.
 */
export function useChart(
    containerRef: MaybeElementRef<HTMLElement>,
    optionsRef: ReactiveParam<EChartsOption>
) {
    const instance = shallowRef<ECharts>()

    const options = computed(() => {
        return unref(isFunction(optionsRef) ? optionsRef() : optionsRef)
    })

    /**
     * Initialize ECharts instance.
     */
    function initialize() {
        const el = unref(containerRef)
        if (!el) return
        dispose()
        instance.value = init(el)
        initializeEvents(instance.value)
    }

    /**
     * Initialize renderered/destroyed events.
     */
    function initializeEvents(chart: ECharts) {
        chart.on('rendered', triggerEvent(chart, 'rendered'))
        chart.on('finished', triggerEvent(chart, 'finished'))
    }

    /**
     * Trigger an event.
     */
    function triggerEvent(chart: ECharts, event: string) {
        return () => {
            const map = [...chart._componentsViews, ...chart._chartsViews].map(
                view => [view.__model.option.id, view.group] as const
            )

            for (const [id, el] of map) {
                chart.trigger(`${event}:${id}`, el)
            }

            chart.getZr().storage.traverse(el => {
                chart.trigger(`${event}:${el.name}`, el)
            })
        }
    }

    /**
     * Dispose ECharts instance.
     */
    function dispose() {
        unref(instance)?.dispose()
    }

    /**
     * Set ECharts options.
     */
    function setOption() {
        unref(instance)?.setOption(unref(options) || {})
    }

    /**
     * Resize ECharts instance.
     */
    function resize() {
        unref(instance)?.resize()
    }

    watchEffect(initialize)
    watchEffect(setOption)
    tryOnUnmounted(dispose)
    useResizeObserver(containerRef, resize)

    return instance
}
