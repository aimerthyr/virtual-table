import type { OnChangeFn, RowData, Table, TableFeature, Updater } from '@tanstack/vue-table'
import { functionalUpdate, makeStateUpdater } from '@tanstack/vue-table'

export interface RowEditingTableState {
  editingRowId: string | null
}

export interface RowEditingOptions {
  onEditingRowIdChange?: OnChangeFn<string | null>
}

export interface RowEditingInstance {
  /** 设置当前行 */
  setEditingRow: (updater: Updater<string | null>) => void
  /** 获取当前正在编辑的行 ID */
  getEditingRowId: () => string | null
  /** 判断指定行是否处于编辑态 */
  isRowEditing: (rowId: string) => boolean
}

export const RowEditingFeature: TableFeature<any> = {
  getInitialState: (state): RowEditingTableState => ({
    editingRowId: null,
    ...state,
  }),
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): RowEditingOptions => ({
    onEditingRowIdChange: makeStateUpdater('editingRowId', table),
  }),
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setEditingRow = (updater) => {
      const safeUpdater: Updater<string | null> = (old) => functionalUpdate(updater, old)
      table.options.onEditingRowIdChange?.(safeUpdater)
    }
    table.getEditingRowId = () => table.getState().editingRowId
    table.isRowEditing = (rowId: string) => table.getState().editingRowId === rowId
  },
}
