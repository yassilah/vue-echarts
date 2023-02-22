import { fileURLToPath } from 'node:url'
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema'

const path = fileURLToPath(new URL(`./types/index.d.ts`, import.meta.url))
const program = getProgramFromFiles([path], {
    paths: {
        '@/*': ['./*']
    },
    baseUrl: fileURLToPath(new URL(`./`, import.meta.url))
})

const cache: Map<string, string[]> = new Map()

function getList(key: string) {
    if (!cache.has(key)) {
        const { enum: list } = generateSchema(program, key)
        cache.set(key, list as string[])
    }

    return cache.get(key)
}

export default {
    option: getList('OptionKey'),
    series: getList('SeriesKey'),
    shape: getList('ShapeKey')
}
