---
title: 参考
---

# VTable API 文档

展示 VTable 组件的 API 文档。

### 状态

> 支持双向绑定,用于控制表格内部状态

<!-- prettier-ignore -->
| 状态名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `defaultFilter` | 筛选状态 | `VTableColumnFiltersState` | `[]` |
| `defaultSort` | 排序状态 | `VTableSortingState` | `[]` |
| `defaultPagination` | 分页状态 | `VTablePaginationState` | `{}` |
| `defaultExpanded` | 展开状态 | `VTableExpandedState` | `[]` |
| `defaultSelection` | 选择状态 | `VTableSelectionState` | `[]` |
| `defaultColumnPinning` | 列固定状态 | `VTableColumnPinningState` | `{}` |
| `defaultColumnSizing` | 列宽状态 | `VTableColumnSizingState` | `{}` |

### 属性

<!-- prettier-ignore -->
| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `data` | 表格数据源 | `TData[]` | `[]` |
| `columns` | 表格列配置 | `VTableColumn[]` | `[]` |
| `rowHeight` | 表格行高（建议设置，优化滚动性能） | `number` | - |
| `rowKey` | 行唯一标识字段或函数 | `string` &#124; `number` &#124; `(row: TData) => string 或 number` | - |
| `loading` | 是否处于加载状态 | `boolean` | `false` |
| `fixedHeader` | 是否固定表头 | `boolean` | `true` |
| `enableSortingRemoval` | 是否允许取消排序 | `boolean` | `true` |
| `bordered` | 是否显示边框 | `boolean` | `false` |
| `rowSelectionConfig` | 选择行功能配置 | `VTableRowSelectionConfig<TData>` | 见说明 |
| `loadMoreConfig` | 加载更多配置 | `VTableLoadMoreConfig` | 见说明 |
| `paginationConfig` | 分页器配置 | `VTablePaginationConfig` | 见说明 |
| `treeConfig` | 树形结构配置 | `VTableTreeConfig` | 见说明 |
| `enableExpandRow` | 是否启用展开行功能 | `boolean` | `false` |
| `enableRowHover` | 是否启用行 hover 高亮 | `boolean` | `true` |
| `adaptiveColumnWidth` | 自适应列宽的最小列宽 | `number` | `120` |
| `defaultExpandAllRows` | 默认展开所有行（仅初始化生效） | `boolean` | `false` |
| `columnResizeMode` | 列宽调整模式 | `'onChange'` &#124; `'onEnd'` | `'onChange'` |
| `fixedFooter` | 是否固定表尾 | `boolean` | `false` |
| `themeConfig` | 自定义主题配置（可覆盖默认主题） | `VTableThemeConfig` | `{}` |
| `defaultCheckboxColumnWidth` | 默认 checkbox 列宽 | `number` | `40` |
| `defaultExpandColumnWidth` | 默认展开列宽 | `number` | `42` |
| `customRowAttributes` | 自定义数据行属性 | `(row, rowIndex) => HTMLAttributes` | `() => ({})` |
| `customHeaderCellAttributes` | 自定义表头单元格属性 | `(column, colIndex) => ThHTMLAttributes` | `() => ({})` |
| `customCellAttributes` | 自定义表体单元格属性（支持合并单元格） | `(row, column, rowIndex, colIndex) => TdHTMLAttributes` 或 `null` | `() => ({})` |
| `layoutMode` | 表格布局模式 (固定宽度 / 内容自适应) | `'fixed'` &#124; `'contentFit'` | `'fixed'` |

---

### 事件

<!-- prettier-ignore -->
| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| `onTableChange` | 表格状态变化时触发（分页、排序、筛选） | `(state: VTableChangeState) => void` |
| `onScrollToBottom` | 滚动到底部时触发 | `() => void` |
| `onExpandedRowsChange` | 展开行变化时触发 | `(state: VTableExpandedState) => void` |
| `onColumnSizingChange` | 列宽调整时触发 | `(state: VTableColumnSizingState) => void` |
| `onExpand` | 点击展开图标触发 | `(expanded: boolean, row: TData) => void` |

---

### 插槽

<!-- prettier-ignore -->
| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| `customHeader` | 自定义整个表头 | `{ columns, table }` |
| `bodyCell` | 自定义单元格内容 | `{ columnKey, column, row, rowIndex }` |
| `headerCell` | 自定义表头单元格 | `{ columnKey, column }` |
| `customFilterIcon` | 自定义筛选图标 | `{ columnKey, filtered, column }` |
| `customFilterDropdown` | 自定义筛选下拉框 | `{ confirm, reset, setFilterValue, column, filterModelValue }` |
| `expandedRowRender` | 自定义展开行内容 | `{ row }` |
| `customPopover` | 自定义 Popover | `{ open, onOpenChange, trigger, content }` |
| `customPagination` | 自定义分页组件 | `{ pageSize, pageIndex, total, onPageChange }` |
| `customCheckbox` | 自定义复选框 | `{ checked, disabled, indeterminate, onCheckedChange }` |
| `customEmpty` | 自定义空状态 | - |
| `customLoadingIcon` | 自定义加载图标 | - |
| `customLoadNoMore` | 自定义加载完成提示 | - |
| `customFooter` | 自定义表尾 | - |
| `customExpandIcon` | 自定义展开图标 | `{ expand, onExpandChange }` |
| `customSorterIcon` | 自定义排序图标 | `{ sort }` |

---

### 方法

> 通过 ref 调用组件实例方法

<!-- prettier-ignore -->
| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| `scrollToIndex` | 滚动到指定行索引 | `(index: number, behavior?: ScrollBehavior)` | `void` |
| `tanstackTable` | 获取 TanStack Table 实例 | - | `Table` |
| `setEditingRow` | 设置当前编辑行 | `(rowId: string | number | null)` | `void` |
