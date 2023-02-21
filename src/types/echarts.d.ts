import * as echarts from 'echarts'

declare module 'echarts' {
    interface ECharts {
        _componentsViews: echarts.ComponentView[]
        _chartsViews: echarts.ChartView[]
        getOption(): echarts.EChartsOption
    }
}
