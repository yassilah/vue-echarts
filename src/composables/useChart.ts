import { type ECharts, type EChartsOption, init } from 'echarts'
import {
    type MaybeElementRef,
    tryOnUnmounted,
    useResizeObserver
} from '@vueuse/core'
import { reactiveParam } from '@/utils'
import { shallowRef, unref, watchEffect } from 'vue'
import type { ReactiveParam } from '@/types'

/**
 * Use ECharts instance.
 */
export function useChart(
    containerRef: MaybeElementRef<HTMLElement>,
    optionsRef: ReactiveParam<EChartsOption>,
    ssr: boolean
) {
    const instance = shallowRef<ECharts>()

    const options = reactiveParam(optionsRef)

    /**
     * Initialize ECharts instance.
     */
    function initialize() {
        dispose()

        if (ssr) {
            instance.value = init(undefined, undefined, {
                ssr: true,
                renderer: 'svg',
                height: 1000,
                width: 1000
            })
        } else {
            const el = unref(containerRef)
            if (!el) return
            instance.value = init(el)
            initializeEvents(instance.value)
        }
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
        const opts = { ...(unref(options) || {}) }

        if (ssr) {
            opts.animation = false
        }

        unref(instance)?.setOption(opts)
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
