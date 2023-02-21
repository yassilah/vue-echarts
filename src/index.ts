import components from '#components'
import type { Plugin } from 'vue'

export default <Plugin>{
    install(app) {
        for (const component in components) {
            app.component(component, components[component])
        }
    }
}
