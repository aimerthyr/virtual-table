---
title: Reference
---

# VTable API Documentation

Display the API documentation for the VTable component.

### Models

> Supports bidirectional binding, used to control the internal state of the table

<!-- prettier-ignore -->
| Model Name | Description | Type | Default Value |
| --- | --- | --- | --- |
| `defaultFilter` | Filter state | `VTableColumnFiltersState` | `[]` |
| `defaultSort` | Sort state | `VTableSortingState` | `[]` |
| `defaultPagination` | Pagination state | `VTablePaginationState` | `{ pageIndex: 1, pageSize: 20 }` |
| `defaultExpanded` | Expanded state | `VTableExpandedState` | `{}` |
| `defaultSelection` | Selection state | `VTableSelectionState` | `{}` |
| `defaultColumnPinning` | Column pinning state | `VTableColumnPinningState` | `{}` |
| `defaultColumnSizing` | Column sizing state | `VTableColumnSizingState` | `{}` |

### Props

<!-- prettier-ignore -->
| Property Name | Description | Type | Default Value |
| --- | --- | --- | --- |
| `data` | Table data source | `TData[]` | `[]` |
| `columns` | Table column configuration | `VTableColumn[]` | `[]` |
| `rowHeight` | Table row height (recommended to set, optimize scrolling performance) | `number` | - |
| `rowKey` | Row unique identifier field or function | `string` &#124; `number` &#124; `(row: TData) => string or number` | - |
| `loading` | Whether the table is in loading state | `boolean` | `false` |
| `fixedHeader` | Whether to fix the table header | `boolean` | `true` |
| `enableSortingRemoval` | Whether to allow sorting removal | `boolean` | `true` |
| `bordered` | Whether to display borders | `boolean` | `false` |
| `rowSelectionConfig` | Row selection configuration | `VTableRowSelectionConfig<TData>` | See description |
| `loadMoreConfig` | Load more configuration | `VTableLoadMoreConfig` | See description |
| `paginationConfig` | Pagination configuration | `VTablePaginationConfig` | See description |
| `treeConfig` | Tree structure configuration | `VTableTreeConfig` | See description |
| `enableExpandRow` | Whether to enable expandable rows | `boolean` | `false` |
| `enableRowHover` | Whether to enable row hover highlighting | `boolean` | `true` |
| `adaptiveColumnWidth` | Minimum column width for adaptive column width | `number` | `120` |
| `defaultExpandAllRows` | Whether to expand all rows by default (only initialized) | `boolean` | `false` |
| `columnResizeMode` | Column width adjustment mode | `'onChange'` &#124; `'onEnd'` | `'onChange'` |
| `fixedFooter` | Whether to fix the table footer | `boolean` | `false` |
| `themeConfig` | Custom theme configuration (can override default theme) | `VTableThemeConfig` | `{}` |
| `defaultCheckboxColumnWidth` | Default checkbox column width | `number` | `40` |
| `defaultExpandColumnWidth` | Default expanded column width | `number` | `42` |
| `customRowAttributes` | Custom data row attributes | `(row, rowIndex) => HTMLAttributes` | `() => ({})` |
| `customHeaderCellAttributes` | Custom table header cell attributes | `(column, colIndex) => ThHTMLAttributes` | `() => ({})` |
| `customCellAttributes` | Custom table body cell attributes (supports merging cells) | `(row, column, rowIndex, colIndex) => TdHTMLAttributes` or `null` | `() => ({})` |
| `layoutMode` | Table layout mode (fixed width / content fit) | `'fixed'` &#124; `'contentFit'` | `'fixed'` |
| `summaryConfig` | Summary configuration | `VTableSummaryConfig` | See description |

---

### Events

<!-- prettier-ignore -->
| Event Name | Description | Callback Parameters |
| --- | --- | --- |
| `onTableChange` | Triggered when the table state changes (pagination, sorting, filtering) | `(state: VTableChangeState) => void` |
| `onScrollToBottom` | Triggered when scrolling to the bottom | `() => void` |
| `onExpandedRowsChange` | Triggered when the expanded rows change | `(state: VTableExpandedState) => void` |
| `onColumnSizingChange` | Triggered when the column width changes | `(state: VTableColumnSizingState) => void` |
| `onExpand` | Triggered when the expand icon is clicked | `(expanded: boolean, row: TData) => void` |

---

### Slots

<!-- prettier-ignore -->
| Slot Name | Description | Parameters |
| --- | --- | --- |
| `customHeader` | Custom the entire table header | `{ columns, table }` |
| `bodyCell` | Custom cell content | `{ columnKey, column, row, rowIndex, isEditingMode }` |
| `headerCell` | Custom table header cell | `{ columnKey, column }` |
| `customFilterIcon` | Custom filter icon | `{ columnKey, filtered, column }` |
| `customFilterDropdown` | Custom filter dropdown | `{ confirm, reset, setFilterValue, column, filterModelValue }` |
| `expandedRowRender` | Custom expanded row content | `{ row }` |
| `customPopover` | Custom Popover | `{ open, onOpenChange, trigger, content }` |
| `customPagination` | Custom pagination component | `{ pageSize, pageIndex, total, onPageChange }` |
| `customCheckbox` | Custom checkbox | `{ checked, disabled, indeterminate, onCheckedChange }` |
| `customEmpty` | Custom empty state | - |
| `customLoadingIcon` | Custom loading icon | - |
| `customLoadNoMore` | Custom load more hint | - |
| `customFooter` | Custom table footer | - |
| `customExpandIcon` | Custom expand icon | `{ expand, onExpandChange }` |
| `customSorterIcon` | Custom sort icon | `{ sort }` |
| `summaryCell` | Custom summary cell | `{ columnKey, column, summaryValue }` |

---

### Methods

> Call the component instance method through ref

<!-- prettier-ignore -->
| Method Name | Description | Parameters | Return Value |
| --- | --- | --- | --- |
| `scrollToIndex` | Scroll to the specified row index | `(index: number, behavior?: ScrollBehavior)` | `void` |
| `tanstackTable` | Get TanStack Table instance | - | `Table` |
| `setEditingState` | Set the editing state (1. columnKey is empty, it is row editing 2. columnKey is not empty, it is cell editing 3. rowId is null, clear editing state) | `(rowId: string \| number \| null, columnKey?: string \| null) => void` | `void` |
