import '@tanstack/vue-table'
import type { RowData } from '@tanstack/vue-table'
import type {
  RowEditingInstance,
  RowEditingOptions,
  RowEditingTableState,
} from './features/rowEditing'
import { VTableColumn } from './interface'

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ColumnMeta extends VTableColumn {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TableState extends RowEditingTableState {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars
  interface TableOptionsResolved<TData extends RowData> extends RowEditingOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars
  interface Table<TData extends RowData> extends RowEditingInstance {}
}
