import { EVENTS } from '@/constants'
import { computed, unref, watchEffect } from 'vue'
import { getElementBounds, removeUndefinedProps } from '@/utils'
import { tryOnBeforeUnmount, tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import { useInstance } from './useInstance'
import type { EChartsOption } from 'echarts'
import type { Option, OptionKey } from '@/types'
import type { ViewRootGroup } from 'echarts/types/src/util/types'

export function useChartOption<K extends OptionKey, V extends Option[K]>(
    name: K,
    option: V,
    emit: (event: string, ...args: any[]) => void
) {
    /**
     * Current Echarts instance.
     */
    const instance = useInstance()

    /**
     * Random uuid to identify the option.
     */
    const id = crypto.randomUUID()

    /**
     * Get the current props values without undefined properties.
     */
    const value = computed(() => {
        return removeUndefinedProps(option)
    })

    /**
     * Unset an option.
     */
    function unsetOption(option: EChartsOption, value: EChartsOption[K]) {
        if (Array.isArray(value)) {
            const index = value.findIndex(item => item.id === id)
            if (index === -1) return
            value.splice(index, 1)
        } else if (typeof value === 'object') {
            if ('id' in value && value.id !== id) return
            delete option[name]
        }

        return option
    }

    /**
     * Set the options.
     */
    function set() {
        const option = {
            [name]: {
                ...unref(value),
                id
            }
        }
        instance.setOption(option, {
            notMerge: false,
            lazyUpdate: true,
            silent: true
        })
    }

    /**
     * Unset the options.
     */
    function unset() {
        const chartOptions = instance.getOption()
        const value = chartOptions[name]

        if (!value) return

        instance.setOption(unsetOption(chartOptions, value), {
            notMerge: true,
            lazyUpdate: true,
            silent: true
        })

        emit(`${EVENTS.UNSET}`)
    }

    /**
     * Add the set event.
     */
    function addEvents() {
        for (const event of Object.values(EVENTS)) {
            instance.on(`${event}:${id}`, (el: ViewRootGroup) => {
                emit(`${event}`, {
                    el,
                    bounds: getElementBounds(el)
                })
            })
        }
    }

    /**
     * Remove the set event.
     */
    function removeEvents() {
        for (const event of Object.values(EVENTS)) {
            instance.off(`${event}:${id}`)
        }
    }

    watchEffect(set)
    tryOnBeforeUnmount(unset)

    tryOnMounted(addEvents)
    tryOnUnmounted(removeEvents)
}
