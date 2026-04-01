import '@tanstack/vue-table'
import type { RowData } from '@tanstack/vue-table'
import type {
  EditingStateInstance,
  EditingStateOptions,
  EditingStateTableState,
} from './features/editingState'
import { VTableColumn } from './interface'

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ColumnMeta extends VTableColumn {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TableState extends EditingStateTableState {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars
  interface TableOptionsResolved<TData extends RowData> extends EditingStateOptions {}

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, unused-imports/no-unused-vars
  interface Table<TData extends RowData> extends EditingStateInstance {}
}
