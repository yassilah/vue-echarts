import create from './create'
import type { OptionKey } from '@/types'

// This will be replaced by the name of the option in the build process.
export default create('$$name' as OptionKey)
