import { fileURLToPath } from 'node:url'
import { generateSchema, getProgramFromFiles } from 'typescript-json-schema'

const path = fileURLToPath(new URL(`./types/index.d.ts`, import.meta.url))
const program = getProgramFromFiles([path], {
    paths: {
        '@/*': ['./*']
    },
    baseUrl: fileURLToPath(new URL(`./`, import.meta.url))
})

function getList(key: string) {
    const { enum: list } = generateSchema(program, key)
    return list as string[]
}

export default { options: getList('OptionKey'), series: getList('SeriesKey') }
