import type { EVENTS } from '@/constants'
import type { ViewRootGroup } from 'echarts/types/src/util/types'

export type OptionEvents = {
    [K in EVENTS]: (el: ViewRootGroup) => void
}

export type Emits = {
    [K in keyof OptionEvents]: (payload: OptionEvents[K]) => void
}
