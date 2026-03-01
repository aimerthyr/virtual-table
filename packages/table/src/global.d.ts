import '@tanstack/vue-table'
import { VTableColumn } from './interface'

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ColumnMeta extends VTableColumn {}
}
