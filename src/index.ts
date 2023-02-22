import '@vue/runtime-core'
import components from '#components'
import type { Plugin } from 'vue'

export default <Plugin>{
    install(app) {
        for (const component in components) {
            app.component(component, components[component])
        }
    }
}

// @ts-expect-error fine
type ComponentsList = typeof import('./components')

type VueEchartsComponents = {
    [K in keyof ComponentsList]: ComponentsList[K]
}

declare module '@vue/runtime-core' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface GlobalComponents extends VueEchartsComponents {}
}
