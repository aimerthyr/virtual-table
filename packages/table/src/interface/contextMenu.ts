import type { VTableColumn } from './base'

/** 右键菜单类型 */
export type VTableContextMenuType = 'header' | 'cell'

/** 右键菜单上下文信息 */
export interface VTableContextMenuContext<TData = any> {
  /** 菜单类型 */
  type: VTableContextMenuType
  /** 当前列配置 */
  column: VTableColumn
  /** 当前列索引 */
  columnIndex: number
  /** 当前行数据（仅 cell 类型有效） */
  row?: TData
  /** 当前行索引（仅 cell 类型有效） */
  rowIndex?: number
}

/** 右键菜单配置 */
export interface VTableContextMenuConfig {
  /** 是否启用表头右键菜单 */
  enableHeaderMenu?: boolean
  /** 是否启用单元格右键菜单 */
  enableCellMenu?: boolean
}
