import type { CustomSeriesRenderItemReturn } from 'echarts'

type Shapes = NonNullable<CustomSeriesRenderItemReturn>

export type Shape = {
    [K in Shapes as K['type']]: K
}

export type ShapeKey = keyof Shape
