import type { VTableProps, VTableThemeConfig } from '../interface'
import { defineDefaultProps } from '../utils/type'

/** checkbox 选择列 */
export const CHECKBOX_COLUMN_KEY = 'CHECKBOX_COLUMN_KEY'
/** 展开列 */
export const EXPAND_COLUMN_KEY = 'EXPAND_COLUMN_KEY'
/** 是否是展开行 */
export const EXPAND_ROW_KEY = '_isExpandRow'
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
    paginationExtraProps: {
      isShowTotal: false,
      isShowSizeChanger: true,
      pageSizeText: '页',
      totalText: '总计',
    },
  }),
  treeConfig: () => ({
    enabled: false,
    childrenKey: 'children',
    indentSize: 16,
  }),
  summaryConfig: () => ({
    enabled: false,
    fixed: false,
  }),
  contextMenuConfig: () => ({
    enableCellMenu: false,
    enableHeaderMenu: false,
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
  maxTableWidth: undefined,
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
  contextMenuActive: {
    backgroundColor: '#e6f7ff',
    borderColor: '#1890ff',
  },
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
