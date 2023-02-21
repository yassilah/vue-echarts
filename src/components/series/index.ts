import create from './create'
import type { SeriesKey } from '@/types'

// This will be replaced by the name of the series in the build process.
export default create('$$name' as SeriesKey)
