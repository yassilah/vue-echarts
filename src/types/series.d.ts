import type { SeriesOption } from 'echarts'

export type Series = {
    [K in SeriesOption as K['type']]: K
}

export type SeriesKey = keyof Series
