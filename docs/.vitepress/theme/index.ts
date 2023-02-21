import DefaultTheme from 'vitepress/theme'
import plugin from './../../../dist/vue-echarts.mjs'

export default {
    ...DefaultTheme,
    enhanceApp({ app }) {
        app.use(plugin)
    }
}
