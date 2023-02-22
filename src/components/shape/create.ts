import { EVENTS } from '@/constants'
import { Shape, ShapeKey } from '@/types/shape'
import { Slots, VNode, defineComponent, getCurrentInstance } from 'vue'
import { normalizeAttrs } from '@/utils'

export default function <Type extends ShapeKey>(type: Type) {
    return defineComponent({
        props: {} as unknown as Readonly<
            Omit<Shape[Type], 'type' | 'children'>
        >,
        emits: Object.values(EVENTS),
        name: type,
        inheritAttrs: false,
        setup() {
            const node = getCurrentInstance().vnode as VNode & {
                type: { name: Type }
            }
            return () => JSON.stringify(childToJSON(node))
        }
    })
}

/**
 * Turn a shape into JSON.
 */
function childToJSON<K extends ShapeKey>(child: VNode & { type: { name: K } }) {
    const base = normalizeAttrs({
        type: child.type.name,
        ...child.props
    }) as Shape[K]

    if (base.type === 'group') {
        base.children = getChildrenContent(child)
    } else if (base.type === 'text' && !base.style?.text) {
        base.style ??= {}
        base.style.text = getTextContent(child)
    }

    return base
}

/**
 * Get the group children JSON.
 */
function getChildrenContent(node: VNode) {
    const children = node.children as Slots
    const content = children?.default?.()

    if (Array.isArray(content)) {
        return content.map(childToJSON)
    }

    return []
}

/**
 * Get the text content.
 */
function getTextContent(node: VNode) {
    const children = node.children as Slots
    const content = children?.default?.()

    if (Array.isArray(content)) {
        return content
            .map(({ children, props }) => {
                const value = String(children).trim()
                return props?.name ? `{${String(props.name)}|${value}}` : value
            })
            .join('\n')
    }

    return ''
}
