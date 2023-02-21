import { alias } from './../../vite.config'
import { defineConfig } from 'vitepress'

export default defineConfig({
    vite: {
        resolve: {
            alias
        }
    }
})
