import { describe, expect, it } from 'vitest'
import { normalizeAttrs } from '.'

describe('utils', () => {
    it('should normalize attrs', () => {
        const attrs = normalizeAttrs({
            style: {
                fill: 'white'
            },
            'style.font-size': 12,
            'style.align': 'center'
        })

        expect(attrs).toMatchObject({
            style: {
                fill: 'white',
                fontSize: 12,
                align: 'center'
            }
        })
    })
})
