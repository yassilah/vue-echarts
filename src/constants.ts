import type { ECharts } from 'echarts'
import type { InjectionKey } from 'vue'
import type { MaybeRef } from '@vueuse/core'

const name = 'vue-echarts'

function createInjectionKey<T>(key: string): InjectionKey<MaybeRef<T>> {
    return Symbol(`${name}.${key}`)
}

export const INSTANCE = createInjectionKey<ECharts>('instance')

export enum EVENTS {
    RENDERED = 'rendered',
    UNSET = 'removed',
    FINISHED = 'finished'
}
