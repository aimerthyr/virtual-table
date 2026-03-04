import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/vue-table'
import type { EXPAND_ROW_DATA_INDEX, EXPAND_ROW_KEY } from '../constant'

export type VTableData<T = Record<string, any>> = T & {
  /** 当前行是否展开 */
  [EXPAND_ROW_KEY]?: boolean
  /** 子行数据列表（HACK: 为了实现自定义展开行的逻辑，这里只会有一项） */
  [EXPAND_ROW_DATA_INDEX]?: Array<VTableData<T>>
}

export type VTableSortingState = SortingState
export type VTablePaginationState = PaginationState
export type VTableColumnFiltersState = ColumnFiltersState
export type VTableExpandedState = ExpandedState
export type VTableSelectionState = RowSelectionState
export type VTableColumnPinningState = ColumnPinningState

/** 列配置 */
export interface VTableColumn<TData = any> {
  /** 列的 key （同时也对应于每一列数据的 key） */
  columnKey: string
  /** 列标题 */
  columnHeader?: ColumnDef<TData>['header']
  /** 列对齐方式 */
  columnAlign?: 'left' | 'center' | 'right'
  /** 列的宽度（支持数字或百分比字符串，如 200 或 '20%'） */
  columnWidth?: number | string
  /** 是否开启排序 */
  columnEnableSort?: boolean
  /** 是否开启筛选 */
  columnEnableFilter?: boolean
  /** 单元格内容 */
  columnCell?: ColumnDef<TData>['cell']
  /** 当前列宽是否可以调整 */
  columnEnableResize?: boolean
  /** 列宽最大值 */
  columnMaxWidth?: number
  /** 列宽最小值 (默认 50px) */
  columnMinWidth?: number
  /** 可自行拓展字段 */
  [key: string]: any
}

/** 表格状态（分页，排序，筛选） */
export type VTableChangeState = {
  pagination: VTablePaginationState
  sortList: VTableSortingState
  filterList: VTableColumnFiltersState
}

export type VTableRowKey<TData> = string | number | ((row: TData) => string | number)

export type VTableRowSelectionConfig<TData> = {
  /** 是否开启 checkbox 列 */
  enabled?: boolean
  /** 判断该行是否禁用选择 */
  getRowCheckDisabled?: (row: TData) => boolean
  /** 选择行变化回调 */
  onChange?: (selectedRows: TData[]) => void
}

export type VTableLoadMoreConfig = {
  /** 是否显示"没有更多了"提示 */
  showNoMore?: boolean
  /** 自定义"没有更多了"文本 */
  noMoreText?: string
}

export type VTablePaginationConfig = {
  /** 总数（必须要传） */
  total: number
  /** 是否开启分页 */
  enabled?: boolean
  /** 分页器位置 */
  placement?: 'left' | 'center' | 'right'
  /** 服务端分页还是前端分页 */
  mode?: 'client' | 'server'
  /** 分页器额外属性（如果你自己定义了分页器组件，则用于回传给你自己定义的组件） */
  paginationExtraProps?: Record<string, any>
}

export type VTableTreeConfig = {
  /** 是否启用树形结构 */
  enabled?: boolean
  /** 子节点字段名，默认为 'children' */
  childrenKey?: string
  /** 缩进距离 */
  indentSize?: number
}

export type VTableBorderConfig = {
  /** 是否显示边框 */
  enabled?: boolean
  /** 边框样式 */
  borderStyle?: 'solid' | 'dashed'
  /** 边框颜色 */
  borderColor?: string
}
