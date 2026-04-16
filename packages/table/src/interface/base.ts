import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/vue-table'
import type { EXPAND_ROW_KEY } from '../constant'

export type VTableData<T = Record<string, any>> = T & {
  /** 当前行是否展开 */
  [EXPAND_ROW_KEY]?: boolean
}

/** 排序状态 */
export type VTableSortingState = SortingState
/** 分页状态 */
export type VTablePaginationState = PaginationState
/** 筛选状态 */
export type VTableColumnFiltersState = ColumnFiltersState
/** 展开状态 */
export type VTableExpandedState = ExpandedState
/** 选择状态 */
export type VTableSelectionState = RowSelectionState
/** 固定列状态 */
export type VTableColumnPinningState = ColumnPinningState
/** 列宽状态 */
export type VTableColumnSizingState = ColumnSizingState

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
  /** 子列（用于表头分组） */
  columnChildren?: VTableColumn<TData>[]
  /** 汇总计算方式 (sum 汇总 agv 平均值 count 统计 max 最大值 min 最小值) */
  columnSummary?: VTableSummaryType<TData>
}

/** 表格状态（分页，排序，筛选） */
export interface VTableChangeState {
  pagination: VTablePaginationState
  sortList: VTableSortingState
  filterList: VTableColumnFiltersState
}

export type VTableRowKey<TData> = string | number | ((row: TData) => string | number)

export interface VTableRowSelectionConfig<TData> {
  /** 是否开启 checkbox 列 */
  enabled?: boolean
  /** 判断该行是否禁用选择 */
  getRowCheckDisabled?: (row: TData) => boolean
  /** 选择行变化回调 */
  onChange?: (selectedRows: TData[]) => void
}

export interface VTableLoadMoreConfig {
  /** 是否显示"没有更多了"提示 */
  showNoMore?: boolean
  /** 自定义"没有更多了"文本 */
  noMoreText?: string
}

export interface VTablePaginationExtraProps {
  /** 是否显示总计 */
  isShowTotal?: boolean
  /** 是否显示每页条数选择器 */
  isShowSizeChanger?: boolean
  /** 总计文本 */
  totalText?: string
  /** 每页条数选择器文本 */
  pageSizeText?: string
}

export interface VTablePaginationConfig {
  /** 总数（必须要传, 客户端分页可以不传，自动以传入的 data 长度作为总数） */
  total: number
  /** 是否开启分页 */
  enabled?: boolean
  /** 分页器位置 */
  placement?: 'left' | 'center' | 'right'
  /** 服务端分页还是前端分页 */
  mode?: 'client' | 'server'
  /** 分页器额外属性（如果你自己定义了分页器组件，则用于回传给你自己定义的组件） */
  paginationExtraProps?: VTablePaginationExtraProps
}

export interface VTableTreeConfig {
  /** 是否启用树形结构 */
  enabled?: boolean
  /** 子节点字段名，默认为 'children' */
  childrenKey?: string
  /** 缩进距离 */
  indentSize?: number
}

export interface VTableBorderConfig {
  /** 是否显示边框 */
  enabled?: boolean
  /** 边框样式 */
  borderStyle?: 'solid' | 'dashed'
  /** 边框颜色 */
  borderColor?: string
}

export interface VTableBodyCellProps<TData = any> {
  columnKey: string
  column: VTableColumn
  row: TData
  rowIndex: number
  /** 编辑模式
   * row  => 整行编辑
   * cell => 单元格编辑
   * null => 未处于编辑态
   *  */
  isEditingMode: 'row' | 'cell' | null
}

/** 汇总类型 */
export type VTableSummaryType<TData> =
  | 'sum'
  | 'avg'
  | 'count'
  | 'max'
  | 'min'
  | VTableSummaryFn<TData>

export type VTableSummaryFn<TData = any> = (data: TData[], column: VTableColumn) => any

/** 汇总配置 */
export interface VTableSummaryConfig<TData = any> {
  /** 是否显示汇总行 */
  enabled?: boolean
  /** 汇总行固定（不随表格滚动） */
  fixed?: boolean
  /** 自定义汇总计算函数（优先级高于列配置） */
  customSummary?: (column: VTableColumn, data: TData[]) => any
}
