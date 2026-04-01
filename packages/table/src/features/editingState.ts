import type { OnChangeFn, RowData, Table, TableFeature } from '@tanstack/vue-table'
import { makeStateUpdater } from '@tanstack/vue-table'

/** 编辑状态类型 */
export interface EditingState {
  /** 编辑模式：row = 整行编辑，cell = 单元格编辑，null = 未编辑 */
  mode: 'row' | 'cell' | null
  /** 正在编辑的行 ID */
  rowId: string | null
  /** 正在编辑的列 key（仅在 cell 模式下有效） */
  columnKey: string | null
}

export interface EditingStateTableState {
  editingState: EditingState
}

export interface EditingStateOptions {
  onEditingStateChange?: OnChangeFn<EditingState>
}

export interface EditingStateInstance {
  /** 设置编辑状态（不传 columnKey 为行编辑，传 columnKey 为单元格编辑，传 null 清除编辑） */
  setEditingState: (rowId: string | null, columnKey?: string | null) => void
  /** 获取当前编辑状态 */
  getEditingState: () => EditingState
  /** 判断指定位置是否处于编辑态（不传 columnKey 判断行编辑，传 columnKey 判断单元格编辑） */
  isEditing: (rowId: string, columnKey?: string) => boolean
}

export const EditingStateFeature: TableFeature<any> = {
  getInitialState: (state): EditingStateTableState => ({
    editingState: {
      mode: null,
      rowId: null,
      columnKey: null,
    },
    ...state,
  }),
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): EditingStateOptions => ({
    onEditingStateChange: makeStateUpdater('editingState', table),
  }),
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    /** 设置编辑状态 */
    table.setEditingState = (rowId: string | null, columnKey?: string | null) => {
      if (rowId === null) {
        table.options.onEditingStateChange?.(() => ({
          mode: null,
          rowId: null,
          columnKey: null,
        }))
        return
      }
      if (columnKey !== undefined && columnKey !== null) {
        table.options.onEditingStateChange?.(() => ({
          mode: 'cell',
          rowId,
          columnKey,
        }))
        return
      }
      table.options.onEditingStateChange?.(() => ({
        mode: 'row',
        rowId,
        columnKey: null,
      }))
    }

    /** 获取编辑状态 */
    table.getEditingState = () => table.getState().editingState

    /** 判断是否处于编辑态 */
    table.isEditing = (rowId: string, columnKey?: string) => {
      const state = table.getState().editingState
      if (columnKey !== undefined) {
        return state.mode === 'cell' && state.rowId === rowId && state.columnKey === columnKey
      }
      return state.mode === 'row' && state.rowId === rowId
    }
  },
}
