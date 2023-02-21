import type { EChartsOption } from 'echarts'
import type { UnwrapArray } from '.'

export type Option = {
    [K in keyof EChartsOption as UnwrapArray<EChartsOption[K]> extends infer U
        ? U extends Record<string, any>
            ? string extends K
                ? never
                : K
            : never
        : never]: UnwrapArray<EChartsOption[K]> extends infer U
        ? U extends Record<string, any>
            ? U
            : never
        : never
}

export type OptionKey = keyof Option
