import create from './create'
import type { ShapeKey } from '@/types/shape'

// This will be replaced by the name of the series in the build process.
export default create('$$name' as ShapeKey)
