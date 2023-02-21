import { INSTANCE } from '@/constants'
import { getCurrentInstance, inject, unref } from 'vue'

/**
 * Use the current ECharts instance.
 */
export function useInstance() {
    const instance = unref(inject(INSTANCE))

    if (!unref(instance)) {
        const { type } = getCurrentInstance()
        throw new Error(
            `ECharts instance is not provided. Component "${type.name}" can only be used inside the <ECharts> component.`
        )
    }

    return instance
}
