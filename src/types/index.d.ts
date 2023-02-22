import type { Ref } from 'vue'

export * from './events'
export * from './option'
export * from './series'
export * from './shape'

export type UnwrapArray<T> = T extends Array<infer U> ? UnwrapArray<U> : T

export type ReactiveParam<T> = T | Ref<T> | (() => T)
