import type { CSSProperties } from 'vue'
import type { VTableProps } from '../interface'
import { defineDefaultProps } from '../utils/type'

/** checkbox 选择列 */
export const CHECKBOX_COLUMN_KEY = 'CHECKBOX_COLUMN_KEY'
/** 展开列 */
export const EXPAND_COLUMN_KEY = 'EXPAND_COLUMN_KEY'
/** 是否是展开行 */
export const EXPAND_ROW_KEY = '_isExpandRow'
/** data 中 展开子行的数据属性 */
export const EXPAND_ROW_DATA_INDEX = '_expandChildren'
/** 表格默认样式 */
export const TABLE_DEFAULT_STYLE: CSSProperties = {
  padding: '12px',
  minWidth: '0px',
}
/** 表格默认 props */
export const vTableDefaultProps = defineDefaultProps<VTableProps<any>>({
  columns: () => [],
  data: () => [],
  rowHeight: undefined,
  rowKey: undefined,
  loading: false,
  fixedHeader: true,
  enableSortingRemoval: true,
  enableExpandRow: false,
  enableRowHover: true,
  adaptiveColumnWidth: 120,
  defaultExpandAllRows: false,
  columnResizeMode: 'onChange',
  borderConfig: () => ({
    enabled: false,
    borderStyle: 'solid',
    borderColor: '#f0f0f0',
  }),
  rowSelectionConfig: () => ({
    enabled: false,
    getRowCheckDisabled: () => false,
    onChange: () => {},
  }),
  loadMoreConfig: () => ({
    showNoMore: false,
    noMoreText: '没有更多了',
  }),
  paginationConfig: () => ({
    enabled: false,
    placement: 'right',
    total: 0,
    mode: 'server',
  }),
  treeConfig: () => ({
    enabled: false,
    childrenKey: 'children',
    indentSize: 16,
  }),
  customComponentsConfig: () => ({}),
  customRow: undefined,
  customHeaderCell: undefined,
  customCell: undefined,
  onTableChange: () => {},
  onScrollToBottom: () => {},
  onExpandedRowsChange: () => {},
})
