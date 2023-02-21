import type { MaybeRef } from '@vueuse/core'

export * from './events'
export * from './options'
export * from './series'

export type UnwrapArray<T> = T extends Array<infer U> ? UnwrapArray<U> : T

export type ReactiveParam<T> = MaybeRef<T> | (() => T)
