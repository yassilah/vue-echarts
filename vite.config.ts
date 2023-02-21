import { type Plugin, defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { pascalCase } from './src/utils'
import dts from 'vite-plugin-dts'
import generators from './src/generator'

export default defineConfig({
    plugins: [
        addChunkNamePlugin(),
        exportAllComponentsPlugin(generators),
        dts({
            insertTypesEntry: true,
            noEmitOnError: true,
            beforeWriteFile(filePath) {
                return generateComponentTypes(filePath, generators)
            }
        })
    ],
    resolve: {
        alias: {
            '@': getFilePath('./src')
        }
    },
    build: {
        lib: {
            entry: getAllEntries(generators),
            formats: ['es'],
            fileName: '[name]'
        },
        rollupOptions: {
            external: ['vue', 'echarts']
        }
    }
})

/**
 * Get the file path from the URL.
 */
function getFilePath(path: string) {
    return fileURLToPath(new URL(path, import.meta.url))
}

/**
 * Get the entries for the components.
 */
function getAllEntries(generators: Record<string, string[]>) {
    return {
        'components/echarts': getFilePath('src/components/echarts'),
        'composables/index': getFilePath('src/composables/index'),
        index: getFilePath('src/index'),
        ...Object.entries(generators).reduce((acc, [type, list]) => {
            return { ...acc, ...generateEntries(type, list) }
        }, {})
    }
}
/**
 * Get the entries for the options components.
 */
function generateEntries(type: string, list: string[]) {
    const path = getFilePath(`src/components/${type}/index.ts`)

    return list.reduce((acc, name) => {
        const outPath = `components/${type}/${name}`
        const entry = `${path}?name=${name}`
        acc[outPath] = entry
        return acc
    }, {}) as Record<string, string>
}

/**
 * Add the chunk name to the code.
 */
function addChunkNamePlugin() {
    return {
        name: 'vue-echarts:add-chunk-name',
        renderChunk: (code, chunk) => ({
            code: code.replaceAll('$$name', chunk.name.split('/').pop())
        })
    }
}

/**
 * Export all components.
 */
function exportAllComponentsPlugin(generators: Record<string, string[]>) {
    const outputPath = './components/index.mjs'

    return {
        name: 'vue-echarts:export-components',
        options(options) {
            options.external ??= []
            if (Array.isArray(options.external)) {
                options.external.push(outputPath)
            }
        },
        transform: code => ({
            code: code.replace('#components', outputPath)
        }),
        buildEnd() {
            for (const [type, list] of Object.entries(generators)) {
                emitFilesFor(type, list, this)
            }
            emitFile(
                this,
                'components/index',
                [
                    `import ECharts from './echarts'`,
                    `export { default as ECharts } from './echarts'`,
                    ...Object.entries(generators).flatMap(([type, list]) => [
                        makeImport(list, `./${type}/`, `${type}-`),
                        makeExport(list, `./${type}/`, `${type}-`)
                    ]),
                    makeDefaultExport([
                        'ECharts',
                        ...Object.entries(generators)
                            .map(([type, names]) =>
                                names.map(name => pascalCase(`${type}-${name}`))
                            )
                            .flat(1)
                    ])
                ].join('\n')
            )
        }
    } as Plugin
}

function emitFilesFor(path: string, list: string[], ctx: any) {
    emitFile(ctx, `components/${path}`, makeExport(list))
    emitFile(ctx, `components/${path}/index`, makeExport(list))
}

/**
 * Emit a file and its declarations.
 */
function emitFile(ctx: any, path: string, content: string) {
    ctx.emitFile({
        type: 'asset',
        fileName: `${path}.mjs`,
        source: content
    })

    ctx.emitFile({
        type: 'asset',
        fileName: `${path}.d.ts`,
        source: content.replace(/\.mjs/g, '')
    })
}

/**
 * Generate an import or export statement.
 */
function makeImportOrExport(
    list: string[],
    type: 'import' | 'export',
    base = './',
    prepend = ''
) {
    return list
        .map(name => {
            const as = pascalCase(`${prepend}${name}`)
            return `${type} { default as ${as} } from '${base}${name}.mjs'`
        })
        .join('\n')
}

/**
 * Generate an import statement.
 */
function makeImport(list: string[], base = './', prepend = '') {
    return makeImportOrExport(list, 'import', base, prepend)
}

/**
 * Generate an export statement.
 */
function makeExport(list: string[], base = './', prepend = '') {
    return makeImportOrExport(list, 'export', base, prepend)
}

/**
 * Generate a default export statement.
 */
function makeDefaultExport(list: string[]) {
    return `export default { ${list.map(pascalCase).join(',\n')} }`
}

/**
 * Generate the types for the given path.
 */
function generateComponentTypes(
    filePath: string,
    generators: Record<string, string[]>
) {
    for (const [path] of Object.entries(generators)) {
        if (filePath.includes(`components/${path}`)) {
            const name = filePath.split('/').pop()?.replace('.d.ts', '')
            if (name === 'create') return

            return {
                content: [
                    `import type create from './create'`,
                    `declare const ${name}: ReturnType<typeof create<'${name}'>>`,
                    `export default ${name}`
                ].join('\n')
            }
        }
    }
}
