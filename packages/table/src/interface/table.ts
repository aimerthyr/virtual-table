import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, VNode } from 'vue'
import type { Table } from '@tanstack/vue-table'
import type {
  VTableChangeState,
  VTableColumn,
  VTableExpandedState,
  VTableLoadMoreConfig,
  VTablePaginationConfig,
  VTableRowKey,
  VTableRowSelectionConfig,
  VTableTreeConfig,
} from './base'
import type { VTableCheckboxProps, VTablePaginationProps } from './components'
import type { VTableThemeConfig } from './theme'

/** slots 类型定义 */
export interface VTableSlots<TData = any> {
  /** 自定义头部渲染 */
  customHeader?: (data: { columns: VTableColumn[]; table: Table<TData> }) => VNode
  /** 自定义单元格 */
  bodyCell?: (data: {
    columnKey: string
    column: VTableColumn
    row: TData
    rowIndex: number
  }) => VNode
  /** 自定义列头 */
  headerCell?: (data: { columnKey: string; column: VTableColumn }) => VNode
  /** 自定义筛选图标 */
  customFilterIcon?: (data: { columnKey: string; filtered: boolean; column: VTableColumn }) => VNode
  /** 自定义筛选下拉 */
  customFilterDropdown?: (data: {
    confirm: () => void
    reset: () => void
    setFilterValue: (value: any) => void
    column: VTableColumn
    filterModelValue: any
  }) => VNode
  /** 自定义展开行 */
  expandedRowRender?: (data: { row: TData }) => VNode
  /** 自定义 Popover */
  customPopover?: (props: {
    open: boolean
    onOpenChange: (value: boolean) => void
    trigger: () => VNode
    content: () => VNode
  }) => VNode
  /** 自定义分页器 */
  customPagination?: (props: VTablePaginationProps) => VNode
  /** 自定义 checkbox */
  customCheckbox?: (props: VTableCheckboxProps) => VNode
  /** 自定义空状态 */
  customEmpty?: () => VNode
  /** 自定义 loading 图标 */
  customLoadingIcon?: () => VNode
  /** 自定义加载没有更多区域 */
  customLoadNoMore?: () => VNode
  /** 自定义表尾 */
  customFooter?: () => VNode
  [key: string]: ((...args: any[]) => VNode) | undefined
}

/** props 类型定义 */
export interface VTableProps<TData = any> {
  /** 表格数据 */
  data: TData[]
  /** 表格列 */
  columns: VTableColumn[]
  /** 表格行高 （⭐️建议设置，优化滚动性能，防止出现不可控的滚动异常行为） */
  rowHeight?: number
  /** 行唯一标识字段 */
  rowKey?: VTableRowKey<TData>
  /** 是否正在加载中（⭐️如果需要滚动加载的话，建议设置，用于防止滚动触底多次） */
  loading?: boolean
  /** 是否固定表头（表头不随着滚动） */
  fixedHeader?: boolean
  /** 是否允许取消排序 */
  enableSortingRemoval?: boolean
  /** 是否显示边框 */
  bordered?: boolean
  /** 选择行功能配置 */
  rowSelectionConfig?: VTableRowSelectionConfig<TData>
  /** 加载更多配置 */
  loadMoreConfig?: VTableLoadMoreConfig
  /** 分页器配置 */
  paginationConfig?: VTablePaginationConfig
  /** 树形结构配置 */
  treeConfig?: VTableTreeConfig
  /** 是否启用展开行功能 */
  enableExpandRow?: boolean
  /** 是否启用 行 hover 高亮 */
  enableRowHover?: boolean
  /** 自适应列宽（当列数很多时，会出现横向滚动条，那么就需要设置自适应列的最小列宽） */
  adaptiveColumnWidth?: number
  /** 默认展开所有行（仅初始化生效） */
  defaultExpandAllRows?: boolean
  /** 列宽调整模式 */
  columnResizeMode?: 'onChange' | 'onEnd'
  /** 是否固定表尾（表尾不随着滚动） */
  fixedFooter?: boolean
  /** 自定义主题配置（可覆盖默认配置） */
  themeConfig?: VTableThemeConfig
  /** 自定义数据行属性 */
  customRowAttributes?: (row: TData, rowIndex: number) => HTMLAttributes
  /** 自定义表头单元格属性 */
  customHeaderCellAttributes?: (column: VTableColumn, colIndex: number) => ThHTMLAttributes
  /**
   * 自定义表体单元格属性（包括合并单元格）
   * 当返回的属性中 colspan 或 rowspan 为 0 时，该单元格不会被渲染
   */
  customCellAttributes?: (
    row: TData,
    column: VTableColumn,
    rowIndex: number,
    colIndex: number,
  ) => TdHTMLAttributes | null

  // #region 事件定义区域
  /** 表格状态变化（筛选，排序，分页） */
  onTableChange?: (data: VTableChangeState) => void
  /** 滚动到表格底部 */
  onScrollToBottom?: () => void
  /** 展开行变化回调 */
  onExpandedRowsChange?: (expandState: VTableExpandedState) => void
  // #endregion
}

/** VTable 实例类型定义 */
export interface VTableInstance {
  /** 滚动到指定行 */
  scrollToIndex: (index: number) => void
}
