import type { ECharts } from 'echarts'
import type { ViewRootGroup } from 'echarts/types/src/util/types'

/**
 * Emit the rendered event.
 */
export function emitRendered(
    instance: ECharts,
    id: number | string,
    emit: (event: string, ...args: any[]) => void
) {
    instance.on(`rendered:${id}`, (el: ViewRootGroup) => {
        emit('rendered', {
            el,
            bounds: getElementBounds(el)
        })
    })
}

/**
 * Convert a rect to a DOMRect.
 */
export function getElementBounds(el: ViewRootGroup) {
    const rect = el.getBoundingRect()
    return new DOMRect(rect.x, rect.y, rect.width, rect.height)
}

/**
 * Recursively remove undefined properties from an object.
 */
export function removeUndefinedProps<T extends Record<string, any>>(obj: T) {
    for (const key in obj) {
        if (obj[key] === undefined) {
            delete obj[key]
        } else if (typeof obj[key] === 'object') {
            removeUndefinedProps(obj[key])
        }
    }

    return obj
}

/**
 * Convert a string to PascalCase.
 */
export function pascalCase(str: string) {
    return str
        .split('-')
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join('')
}

export function camelCase(str: string) {
    return str
        .split('-')
        .map((word, i) =>
            i === 0 ? word : word[0].toUpperCase() + word.slice(1)
        )
        .join('')
}

/**
 * Normalize the attributes.
 */
export function normalizeAttrs<T extends Record<string, any>>(attrs: T) {
    return Object.entries(attrs).reduce((acc, [key, value]) => {
        acc[camelCase(key) as keyof T] = value
        return acc
    }, {} as T)
}
