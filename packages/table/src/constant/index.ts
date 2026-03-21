import type { VTableProps, VTableThemeConfig } from '../interface'
import { defineDefaultProps } from '../utils/type'

/** checkbox 选择列 */
export const CHECKBOX_COLUMN_KEY = 'CHECKBOX_COLUMN_KEY'
/** 展开列 */
export const EXPAND_COLUMN_KEY = 'EXPAND_COLUMN_KEY'
/** 是否是展开行 */
export const EXPAND_ROW_KEY = '_isExpandRow'
/** data 中 展开子行的数据属性 */
export const EXPAND_ROW_DATA_INDEX = '_expandChildren'
/** 表格默认 props */
export const vTableDefaultProps = defineDefaultProps<VTableProps<any>>({
  columns: () => [],
  data: () => [],
  rowHeight: undefined,
  rowKey: undefined,
  loading: false,
  fixedHeader: true,
  enableSortingRemoval: true,
  bordered: false,
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
  enableExpandRow: false,
  enableRowHover: true,
  adaptiveColumnWidth: 120,
  defaultExpandAllRows: false,
  columnResizeMode: 'onChange',
  fixedFooter: false,
  themeConfig: () => ({}),
  defaultCheckboxColumnWidth: 40,
  defaultExpandColumnWidth: 42,
  layoutMode: 'fixed',
  customRowAttributes: () => ({}),
  customHeaderCellAttributes: () => ({}),
  customCellAttributes: () => ({}),
  onTableChange: () => {},
  onScrollToBottom: () => {},
  onExpandedRowsChange: () => {},
  onColumnSizingChange: () => {},
  onExpand: () => {},
})
/** 默认主题配置 */
export const defaultThemeConfig: VTableThemeConfig = {
  primaryColor: '#3865f5',
  header: {
    color: 'rgba(0, 0, 0, 0.88)',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    splitColor: '#f0f0f0',
    padding: 12,
    headerIconColor: 'rgba(0, 0, 0, 0.30)',
  },
  body: {
    color: 'rgba(0, 0, 0, 0.88)',
    backgroundColor: '#ffffff',
    padding: 12,
  },
  rowHoverColor: '#fafafa',
  border: {
    borderStyle: 'solid',
    borderColor: '#f0f0f0',
  },
  zIndex: {
    pinnedColumn: 10,
    fixedHeader: 12,
    fixedFooter: 12,
  },
}
