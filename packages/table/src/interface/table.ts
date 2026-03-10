import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, VNode } from 'vue'
import type { Table } from '@tanstack/vue-table'
import type {
  VTableBodyCellProps,
  VTableChangeState,
  VTableColumn,
  VTableColumnFiltersState,
  VTableColumnPinningState,
  VTableColumnSizingState,
  VTableExpandedState,
  VTableLoadMoreConfig,
  VTablePaginationConfig,
  VTablePaginationState,
  VTableRowKey,
  VTableRowSelectionConfig,
  VTableSelectionState,
  VTableSortingState,
  VTableTreeConfig,
} from './base'
import type {
  VTableCheckboxProps,
  VTableExpandIconProps,
  VTablePaginationProps,
  VTablePopoverProps,
  VTableSorterIconProps,
} from './components'
import type { VTableThemeConfig } from './theme'

/** slots 类型定义 */
export interface VTableSlots<TData = any> {
  /** 自定义头部渲染 */
  customHeader?: (props: { columns: VTableColumn[]; table: Table<TData> }) => VNode
  /** 自定义单元格 */
  bodyCell?: (props: VTableBodyCellProps<TData>) => VNode
  /** 自定义列头 */
  headerCell?: (props: { columnKey: string; column: VTableColumn }) => VNode
  /** 自定义筛选图标 */
  customFilterIcon?: (props: {
    columnKey: string
    filtered: boolean
    column: VTableColumn
  }) => VNode
  /** 自定义筛选下拉 */
  customFilterDropdown?: (props: {
    confirm: () => void
    reset: () => void
    setFilterValue: (value: any) => void
    column: VTableColumn
    filterModelValue: any
  }) => VNode
  /** 自定义展开行 */
  expandedRowRender?: (props: { row: TData }) => VNode
  /** 自定义 Popover */
  customPopover?: (props: VTablePopoverProps) => VNode
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
  /** 自定义展开图标 */
  customExpandIcon?: (props: VTableExpandIconProps) => VNode
  /** 自定义组件图标 */
  customSorterIcon?: (props: VTableSorterIconProps) => VNode
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
  /** 是否启用行 hover 高亮 */
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
  /** 默认 checkbox 列宽 */
  defaultCheckboxColumnWidth?: number
  /** 默认展开列的列宽 */
  defaultExpandColumnWidth?: number
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

  // #region v-model 类型定义
  /** 默认筛选状态 */
  defaultFilter?: VTableColumnFiltersState
  /** 默认排序状态 */
  defaultSort?: VTableSortingState
  /** 默认分页状态 */
  defaultPagination?: VTablePaginationState
  /** 默认展开状态 */
  defaultExpanded?: VTableExpandedState
  /** 默认选择状态 */
  defaultSelection?: VTableSelectionState
  /** 默认列固定状态 */
  defaultColumnPinning?: VTableColumnPinningState
  /** 默认列宽调整状态 */
  defaultColumnSizing?: VTableColumnSizingState
  'onUpdate:defaultFilter'?: (filter: VTableColumnFiltersState) => void
  'onUpdate:defaultSort'?: (sort: VTableSortingState) => void
  'onUpdate:defaultPagination'?: (pagination: VTablePaginationState) => void
  'onUpdate:defaultExpanded'?: (expanded: VTableExpandedState) => void
  'onUpdate:defaultSelection'?: (selection: VTableSelectionState) => void
  'onUpdate:defaultColumnPinning'?: (columnPinning: VTableColumnPinningState) => void
  'onUpdate:defaultColumnSizing'?: (columnSizing: VTableColumnSizingState) => void
  // #endregion

  // #region 事件定义区域
  /** 表格状态变化（筛选，排序，分页） */
  onTableChange?: (data: VTableChangeState) => void
  /** 滚动到表格底部 */
  onScrollToBottom?: () => void
  /** 展开行变化回调 */
  onExpandedRowsChange?: (expandState: VTableExpandedState) => void
  /** 列宽调整回调 */
  onColumnSizingChange?: (columnSizing: VTableColumnSizingState) => void
  // #endregion
}

/** VTable 实例类型定义 */
export interface VTableInstance<TData = any> {
  /** tanstack 表格实例 */
  tanstackTable: Table<TData>
  /** 滚动到指定下标(从 0 开始，默认是平滑滚动) */
  scrollToIndex: (index: number, behavior?: 'auto' | 'smooth') => void
}
