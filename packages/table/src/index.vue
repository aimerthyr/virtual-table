<template>
  <div
    v-loading="{
      spinning: props.loading,
      indicator: $slots?.customLoadingIcon?.(),
      bottom: paginationRef?.offsetHeight,
    }"
    class="v-table-wrapper"
    :style="cssVariables"
  >
    <div
      ref="tableContainerRef"
      class="v-table-container min-h-0 flex-1 overflow-x-auto"
      :class="{
        'overflow-y-auto': props.fixedHeader,
      }"
      :style="{
        maxWidth:
          props.maxTableWidth === 'max-content'
            ? 'none'
            : typeof props.maxTableWidth === 'number'
              ? `${props.maxTableWidth}px`
              : props.maxTableWidth,
      }"
    >
      <table class="v-table" :class="{ 'v-table-bordered': props.bordered }" :style="tableStyle">
        <colgroup>
          <col
            v-for="column in renderedColGroupColumns"
            :key="column.id"
            :style="{ width: column.width }"
          />
        </colgroup>
        <TableHeader
          ref="tableHeaderRef"
          :table="table"
          :theme-config="themeConfig"
          :virtual-center-columns="virtualCenterColumns"
          :virtual-padding-left="virtualPaddingLeft"
          :virtual-padding-right="virtualPaddingRight"
          :column-style-map="columnStyleMap"
          :shadow-pinned-column-map="shadowPinnedColumnMap"
          :is-context-menu-active-header="isContextMenuActiveHeader"
          :handle-header-context-menu="handleHeaderContextMenu"
        >
          <template v-if="$slots.customHeader" #customHeader="slotProps">
            <slot name="customHeader" v-bind="slotProps" />
          </template>
          <template v-if="$slots.headerCell" #headerCell="slotProps">
            <slot name="headerCell" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customFilterDropdown" #customFilterDropdown="slotProps">
            <slot name="customFilterDropdown" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customFilterIcon" #customFilterIcon="slotProps">
            <slot name="customFilterIcon" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customPopover" #customPopover="slotProps">
            <slot name="customPopover" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customSorterIcon" #customSorterIcon="slotProps">
            <slot name="customSorterIcon" v-bind="slotProps" />
          </template>
        </TableHeader>

        <TableBody
          :table="table"
          :rows="rows"
          :virtual-rows="virtualRows"
          :padding-top="paddingTop"
          :padding-bottom="paddingBottom"
          :has-fixed-columns="hasFixedColumns"
          :table-container-width="tableContainerWidth"
          :column-style-map="columnStyleMap"
          :shadow-pinned-column-map="shadowPinnedColumnMap"
          :theme-config="themeConfig"
          :virtual-center-columns="virtualCenterColumns"
          :virtual-padding-left="virtualPaddingLeft"
          :virtual-padding-right="virtualPaddingRight"
          :rendered-column-count="renderedColumnCount"
          :measure-element="measureElement"
          :can-render-cell="canRenderCell"
          :get-cell-column-index="(cell) => cell.column.getIndex()"
          :is-context-menu-active-cell="isContextMenuActiveCell"
          :handle-cell-context-menu="handleCellContextMenu"
        >
          <template v-if="$slots.bodyCell" #bodyCell="slotProps">
            <slot name="bodyCell" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customExpandIcon" #customExpandIcon="slotProps">
            <slot name="customExpandIcon" v-bind="slotProps" />
          </template>
          <template v-if="$slots.expandedRowRender" #expandedRowRender="slotProps">
            <slot name="expandedRowRender" v-bind="slotProps" />
          </template>
          <template v-if="$slots.summaryCell" #summaryCell="slotProps">
            <slot name="summaryCell" v-bind="slotProps" />
          </template>
          <template v-if="$slots.customLoadNoMore">
            <slot name="customLoadNoMore" />
          </template>
        </TableBody>
        <tfoot
          :class="{ sticky: props.fixedFooter }"
          :style="{ bottom: 0, zIndex: themeConfig.zIndex?.fixedFooter }"
        >
          <tr>
            <td class="!p-0" :colspan="renderedColumnCount">
              <div class="overflow-hidden">
                <slot name="customFooter" />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
      <!-- 空状态 -->
      <div
        v-if="!virtualRows.length"
        :style="{
          height: `calc(100% - ${tableHeaderRef?.tableHeaderElement?.offsetHeight ?? 0}px)`,
        }"
        class="flex items-center justify-center"
      >
        <slot name="customEmpty"> 当前内容为空 </slot>
      </div>
    </div>

    <!-- 右键菜单 -->
    <ContextMenu
      v-if="props.contextMenuConfig?.enableHeaderMenu || props.contextMenuConfig?.enableCellMenu"
      :visible="contextMenuState.visible"
      :x="contextMenuState.x"
      :y="contextMenuState.y"
      :context="contextMenuState.context"
      @close="closeContextMenu"
    >
      <template #default="{ context, close }">
        <slot name="customContextMenu" :context="context" :close="close" />
      </template>
    </ContextMenu>

    <div
      v-if="props.paginationConfig.enabled"
      ref="paginationRef"
      :class="[
        props.paginationConfig.placement === 'left'
          ? 'justify-start'
          : props.paginationConfig.placement === 'center'
            ? 'justify-center'
            : 'justify-end',
      ]"
      class="flex items-center py-[16px]"
    >
      <component :is="PaginationComponent" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData extends VTableData">
import { h, type CSSProperties } from 'vue'
import {
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useVueTable,
  type Cell,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ExpandedState,
  type PaginationState,
  type Row,
  type RowSelectionState,
  type SortingState,
  type Table,
} from '@tanstack/vue-table'
import { useVirtualizer } from '@tanstack/vue-virtual'
import ContextMenu from './components/ContextMenu.vue'
import TableBody from './components/TableBody.vue'
import TableHeader from './components/TableHeader.vue'
import {
  CHECKBOX_COLUMN_KEY,
  EXPAND_COLUMN_KEY,
  EXPAND_ROW_KEY,
  VIRTUAL_LEFT_PADDING_COLUMN_KEY,
  VIRTUAL_RIGHT_PADDING_COLUMN_KEY,
  vTableDefaultProps,
} from './constant'
import { useProvideVTableContext } from './context'
import { EditingStateFeature, type EditingState } from './features/editingState'
import { useTheme } from './hooks/useTheme'
import ExpandIcon from './icons/ExpandIcon.vue'
import type {
  VTableCheckboxProps,
  VTableColumn,
  VTableContextMenuContext,
  VTableData,
  VTableExpandIconProps,
  VTableInstance,
  VTablePaginationProps,
  VTableProps,
  VTableSlots,
} from './interface'
import VCheckbox from './libs/VCheckbox.vue'
import vLoading from './libs/VLoading'
import VPagination from './libs/VPagination.vue'
import { convertToColumnDefList, getAllRowKeys } from './utils'

defineOptions({ name: 'VTable' })

const props = withDefaults(defineProps<VTableProps<TData>>(), vTableDefaultProps)
const $slots = defineSlots<VTableSlots<TData>>()

// #region 自适应列宽计算
const allLeafColumns = computed(() => table.getAllLeafColumns())
const tableHeaderRef = useTemplateRef('tableHeaderRef')
const paginationRef = ref<HTMLDivElement>()
const tableContainerRef = ref<HTMLDivElement | null>(null)
const tableContainerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null
const initResizeObserver = () => {
  if (!tableContainerRef.value) return
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      tableContainerWidth.value = entry.contentRect.width
    }
  })
  resizeObserver.observe(tableContainerRef.value)
}
const columnWidthConfig = computed(() => {
  const allColumns = table.getAllLeafColumns()
  const containerWidth = tableContainerWidth.value || 0
  const MIN_WIDTH = props.adaptiveColumnWidth
  let fixedTotal = 0
  let flexCount = 0
  allColumns.forEach((col) => {
    if (columnSizing.value[col.id] !== undefined || col.columnDef.size !== undefined) {
      fixedTotal += col.getSize()
      return
    }
    flexCount += 1
  })
  // 计算 “剩余空间” 平分给每一个自适应列后，每列能分到多少像素 （剩余空间 = 容器总宽度 - 固定列总宽度）
  const avg = flexCount > 0 ? (containerWidth - fixedTotal) / flexCount : 0
  // 如果平分后的像素比最小自适应列宽还小，则认为空间不足
  const isCramped = flexCount > 0 && avg < MIN_WIDTH
  return {
    isCramped,
    minWidth: MIN_WIDTH,
    flexWidth: isCramped ? MIN_WIDTH : Math.max(avg, 0),
  }
})
const getColumnPixelWidth = (column: Column<TData>) => {
  if (columnSizing.value[column.id] !== undefined || column.columnDef.size !== undefined) {
    return column.getSize()
  }
  if (props.maxTableWidth === 'max-content') {
    return Math.max(column.getSize(), props.adaptiveColumnWidth)
  }
  return columnWidthConfig.value.flexWidth || columnWidthConfig.value.minWidth
}
const columnWidthMap = computed(() => {
  const allColumns = table.getAllLeafColumns()
  const map: Record<string, string> = {}
  allColumns.forEach((column) => {
    map[column.id] = `${getColumnPixelWidth(column)}px`
  })
  return map
})
// #endregion

// #region tanstack-table 核心逻辑
/** checkbox 列 */
const CHECKBOX_COLUMN = computed<ColumnDef<TData>>(() => ({
  id: CHECKBOX_COLUMN_KEY,
  accessorKey: CHECKBOX_COLUMN_KEY,
  size: props.defaultCheckboxColumnWidth,
  header: ({ table }: { table: Table<TData> }) => {
    const selectableRows = table.getRowModel().rows.filter((row) => row.getCanSelect())
    const selectedSelectableRows = selectableRows.filter((row) => row.getIsSelected())
    const checkboxProps: VTableCheckboxProps = {
      indeterminate:
        selectedSelectableRows.length > 0 && selectedSelectableRows.length < selectableRows.length,
      checked: table.getIsAllRowsSelected(),
      onCheckedChange: (e: Event) => {
        table.getToggleAllRowsSelectedHandler()?.(e)
      },
      disabled: false,
    }
    return $slots?.customCheckbox?.(checkboxProps) || h(VCheckbox, checkboxProps)
  },
  cell: ({ row }: { row: Row<TData> }) => {
    const checkboxProps: VTableCheckboxProps = {
      checked: row.getIsSelected(),
      indeterminate: false,
      disabled: !row.getCanSelect(),
      onCheckedChange: (e: Event) => {
        row.getToggleSelectedHandler()?.(e)
      },
    }
    return $slots?.customCheckbox?.(checkboxProps) || h(VCheckbox, checkboxProps)
  },
}))
/** expand 列 */
const EXPAND_COLUMN: ColumnDef<TData> = {
  id: EXPAND_COLUMN_KEY,
  accessorKey: EXPAND_COLUMN_KEY,
  size: props.defaultExpandColumnWidth,
  header: () => {
    return ''
  },
  cell: ({ row }: { row: Row<TData> }) => {
    const expandProps: VTableExpandIconProps = {
      expand: row.getIsExpanded(),
      onExpandChange: row.toggleExpanded,
    }
    return h(
      'div',
      {
        class: 'flex items-center justify-center w-full h-full',
      },
      $slots?.customExpandIcon?.(expandProps) || h(ExpandIcon, expandProps),
    )
  },
}
const columnFilters = defineModel<ColumnFiltersState>('defaultFilter', { default: () => [] })
const columnSorts = defineModel<SortingState>('defaultSort', { default: () => [] })
const pagination = defineModel<PaginationState>('defaultPagination', {
  default: () => ({ pageIndex: 1, pageSize: 20 }),
})
const expanded = defineModel<ExpandedState>('defaultExpanded', { default: () => ({}) })
const selection = defineModel<RowSelectionState>('defaultSelection', { default: () => ({}) })
const columnPinning = defineModel<ColumnPinningState>('defaultColumnPinning', {
  default: () => ({}),
})
const columnSizing = defineModel<ColumnSizingState>('defaultColumnSizing', {
  default: () => ({}),
})
const editingState = ref<EditingState>({
  mode: null,
  rowId: null,
  columnKey: null,
})
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value = { pageIndex: page, pageSize }
  triggerTableStateChange()
}
const triggerTableStateChange = () => {
  nextTick(() => {
    props.onTableChange?.({
      pagination: pagination.value,
      sortList: columnSorts.value,
      filterList: columnFilters.value,
    })
  })
}
const hasFixedColumns = computed(() => {
  return Boolean(columnPinning.value.left?.length || columnPinning.value.right?.length)
})
const computedColumns = computed(() => {
  // 传入容器宽度，用于将百分比转换为像素
  const columns = convertToColumnDefList<TData>(props.columns, tableContainerWidth.value)
  if (props.enableExpandRow) {
    columns.unshift(EXPAND_COLUMN)
  }
  if (props.rowSelectionConfig?.enabled) {
    columns.unshift(CHECKBOX_COLUMN.value)
  }
  return columns
})
const tableData = shallowRef<TData[]>([])
watch(
  () => props.data,
  (newData) => {
    tableData.value = [...newData]
  },
  { deep: true, immediate: true },
)
const expandRowCache = new WeakMap<TData, TData[]>()
const table = useVueTable<TData>({
  _features: [EditingStateFeature],
  state: {
    get editingState() {
      return editingState.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return columnSorts.value
    },
    get pagination() {
      return {
        pageIndex: Math.max(0, (pagination.value.pageIndex || 1) - 1),
        pageSize: pagination.value.pageSize || 20,
      }
    },
    get rowSelection() {
      return selection.value
    },
    get expanded() {
      return expanded.value
    },
    get columnPinning() {
      // tree 模式开启后，不再支持固定列
      if (props.treeConfig.enabled) {
        return {}
      }
      return columnPinning.value
    },
    get columnSizing() {
      return columnSizing.value
    },
  },
  get data() {
    return tableData.value
  },
  get columns() {
    return computedColumns.value
  },
  getRowId: props.rowKey
    ? (row) => {
        // 如果是可展开行，则让组件内部自己生成
        if (row[EXPAND_ROW_KEY]) {
          return undefined as any
        }
        const id =
          typeof props.rowKey === 'function' ? props.rowKey(row) : row[props.rowKey as keyof TData]
        return String(id)
      }
    : undefined,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getPaginationRowModel:
    props.paginationConfig?.mode === 'client' ? getPaginationRowModel() : undefined,
  enableRowSelection: (row) => !props.rowSelectionConfig?.getRowCheckDisabled?.(row.original),
  manualSorting: true, // 手动排序，结合后端
  manualFiltering: true, // 手动筛选，结合后端
  manualPagination: !(props.paginationConfig?.enabled && props.paginationConfig?.mode === 'client'),
  enableColumnPinning: true,
  enableColumnResizing: true,
  columnResizeMode: props.columnResizeMode,
  enableSortingRemoval: props.enableSortingRemoval,
  onSortingChange: (updaterOrValue) => {
    columnSorts.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(columnSorts.value) : updaterOrValue
    triggerTableStateChange()
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue
    triggerTableStateChange()
  },
  onPaginationChange: (updaterOrValue) => {
    // tanstack 内部的分页变量需要 -1
    const internalPageState = {
      pageIndex: Math.max(0, (pagination.value.pageIndex || 1) - 1),
      pageSize: pagination.value.pageSize || 20,
    }
    const pageState =
      typeof updaterOrValue === 'function' ? updaterOrValue(internalPageState) : updaterOrValue
    // 传出给外部需要 +1
    pagination.value = {
      pageIndex: pageState.pageIndex + 1,
      pageSize: pageState.pageSize,
    }
    triggerTableStateChange()
  },
  onExpandedChange: (updaterOrValue) => {
    expanded.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(expanded.value) : updaterOrValue
    nextTick(() => {
      props.onExpandedRowsChange?.(expanded.value)
    })
  },
  onRowSelectionChange: (updaterOrValue) => {
    selection.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(selection.value) : updaterOrValue
    nextTick(() => {
      props.rowSelectionConfig?.onChange?.(
        table.getSelectedRowModel().rows.map((row) => row.original),
      )
    })
  },
  onColumnSizingChange: (updaterOrValue) => {
    columnSizing.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(columnSizing.value) : updaterOrValue
    nextTick(() => {
      props.onColumnSizingChange?.(columnSizing.value)
    })
  },
  onEditingStateChange: (updaterOrValue) => {
    editingState.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(editingState.value) : updaterOrValue
  },
  getSubRows: (row) => {
    // 如果已经是展开行，则直接返回
    if ((row as any)[EXPAND_ROW_KEY]) {
      return
    }
    if (!props.enableExpandRow) {
      return (row as any)[props.treeConfig!.childrenKey!] as TData[] | undefined
    }
    if (expandRowCache.has(row)) {
      return expandRowCache.get(row)
    }
    const expandRow = [
      {
        ...row,
        [EXPAND_ROW_KEY]: true,
      },
    ]
    expandRowCache.set(row, expandRow)
    return expandRow
  },
  getRowCanExpand: (row: Row<TData>) => {
    // tree 模式：只要存在 children 数组（允许空数组），就显示展开按钮
    if (props.treeConfig.enabled) {
      const childrenKey = props.treeConfig.childrenKey ?? 'children'
      const children = (row.original as any)?.[childrenKey]
      return Array.isArray(children)
    }
    // 自定义展开行（默认均支持展开）
    if (props.enableExpandRow) {
      return true
    }
    return false
  },
})
/** 设置所有行展开 */
const setAllRowsExpand = () => {
  expanded.value = getAllRowKeys(props.data, props.rowKey!, props.treeConfig?.childrenKey).reduce(
    (pre: any, cur: string) => {
      pre[cur] = true
      return pre
    },
    {},
  )
}
const PaginationComponent = computed(() => {
  const paginationProps: VTablePaginationProps = {
    pageIndex: pagination.value.pageIndex || 1,
    pageSize: pagination.value.pageSize,
    total:
      props.paginationConfig?.mode === 'client' ? props.data.length : props.paginationConfig.total,
    onPageChange: handlePageChange,
  }
  return () =>
    $slots?.customPagination?.(paginationProps) ||
    h(VPagination, { ...paginationProps, ...props.paginationConfig?.paginationExtraProps })
})
// #endregion

// #region 行虚拟滚动相关逻辑
const rows = computed(() => table.getRowModel().rows)
const virtualRows = computed(() => rowVirtualizer.value.getVirtualItems())
const rowVirtualizerOptions = computed(() => {
  return {
    count: rows.value.length,
    estimateSize: () => props.rowHeight || 48,
    getScrollElement: () => tableContainerRef.value,
    overscan: 8,
  }
})
const rowVirtualizer = useVirtualizer(rowVirtualizerOptions)
/** 展开收起时需要重新测量高度 */
watch(
  () => rows.value.length,
  () => {
    rowVirtualizer.value.measure()
  },
  { immediate: true },
)
const measuredSet = new WeakSet()
const measureElement = (element?: any, isExpandRow?: boolean) => {
  if (!element) return
  if (measuredSet.has(element)) return
  measuredSet.add(element)
  if (isExpandRow || !props.rowHeight) {
    rowVirtualizer.value.measureElement(element)
  }
}
watch(
  () => virtualRows.value[virtualRows.value.length - 1]?.index,
  (lastIndex) => {
    if (
      lastIndex !== undefined &&
      lastIndex >= rows.value.length - 1 &&
      rows.value.length > 0 &&
      !props.loading
    ) {
      props.onScrollToBottom?.()
    }
  },
)
/** 模拟顶部占位 */
const paddingTop = computed(() => (virtualRows.value.length > 0 ? virtualRows.value[0]!.start : 0))
/** 模拟底部占位 */
const paddingBottom = computed(() => {
  if (virtualRows.value.length === 0) return 0
  const lastItem = virtualRows.value[virtualRows.value.length - 1]!
  return rowVirtualizer.value.getTotalSize() - (lastItem.start + lastItem.size)
})
// #endregion

// #region 列虚拟滚动相关逻辑
const leftLeafColumns = computed(() => table.getLeftVisibleLeafColumns())
const centerLeafColumns = computed(() => table.getCenterVisibleLeafColumns())
const rightLeafColumns = computed(() => table.getRightVisibleLeafColumns())
const columnVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableCellElement>(
  computed(() => ({
    count: centerLeafColumns.value.length,
    estimateSize: (index: number) => {
      const column = centerLeafColumns.value[index]
      return column ? getColumnPixelWidth(column) : 0
    },
    getScrollElement: () => tableContainerRef.value,
    horizontal: true,
    overscan: 3,
    useScrollendEvent: false,
    useAnimationFrameWithResizeObserver: true,
  })),
)
const virtualColumns = computed(() => columnVirtualizer.value.getVirtualItems())
const virtualPaddingLeft = computed(() => {
  return virtualColumns.value.length > 0 ? virtualColumns.value[0]!.start : 0
})
const virtualPaddingRight = computed(() => {
  if (virtualColumns.value.length === 0) return 0
  const lastItem = virtualColumns.value[virtualColumns.value.length - 1]!
  return columnVirtualizer.value.getTotalSize() - lastItem.end
})
const virtualCenterColumns = computed<Column<TData>[]>(() => {
  if (!tableContainerRef.value || virtualColumns.value.length === 0) {
    return centerLeafColumns.value
  }
  const columns: Column<TData>[] = []
  virtualColumns.value.forEach((virtualColumn) => {
    const column = centerLeafColumns.value[virtualColumn.index]
    if (column) {
      columns.push(column)
    }
  })
  return columns
})
const renderedColGroupColumns = computed(() => {
  const columns: Array<{ id: string; width: string }> = []
  leftLeafColumns.value.forEach((column) => {
    columns.push({
      id: column.id,
      width: columnWidthMap.value[column.id]!,
    })
  })
  if (virtualPaddingLeft.value > 0) {
    columns.push({
      id: VIRTUAL_LEFT_PADDING_COLUMN_KEY,
      width: `${virtualPaddingLeft.value}px`,
    })
  }
  virtualCenterColumns.value.forEach((column) => {
    columns.push({
      id: column.id,
      width: columnWidthMap.value[column.id]!,
    })
  })
  if (virtualPaddingRight.value > 0) {
    columns.push({
      id: VIRTUAL_RIGHT_PADDING_COLUMN_KEY,
      width: `${virtualPaddingRight.value}px`,
    })
  }
  rightLeafColumns.value.forEach((column) => {
    columns.push({
      id: column.id,
      width: columnWidthMap.value[column.id]!,
    })
  })
  return columns
})
const renderedColumnCount = computed(() => renderedColGroupColumns.value.length)
watch(
  [() => centerLeafColumns.value.length, () => tableContainerWidth.value, () => columnSizing.value],
  () => {
    nextTick(() => {
      columnVirtualizer.value.measure()
    })
  },
  { deep: true },
)
// #endregion

// #region 表格样式相关逻辑
const { cssVariables, themeConfig } = useTheme(props.themeConfig)
const tableStyle = computed<CSSProperties>(() => {
  return {
    width: props.maxTableWidth === 'max-content' ? 'max-content' : '100%',
    tableLayout: props.maxTableWidth === 'max-content' ? 'auto' : 'fixed',
    whiteSpace: props.maxTableWidth === 'max-content' ? 'nowrap' : 'normal',
  }
})
/** 判断单元格是否应该渲染（被合并的单元格返回 false） */
const canRenderCell = (
  row: TData,
  column: VTableColumn,
  rowIndex: number,
  colIndex: number,
): boolean => {
  if (!column) {
    return true
  }
  const attrs = props.customCellAttributes(row, column, rowIndex, colIndex) || {}
  // 当 colspan 或 rowspan 为 0 时，不渲染该单元格
  if (attrs.colspan === 0 || attrs.rowspan === 0) {
    return false
  }
  return true
}
/** 列样式 Map */
const columnStyleCache = new Map<string, CSSProperties>()
const columnStyleMap = computed(() => {
  columnStyleCache.clear()
  for (const column of allLeafColumns.value) {
    const meta = column.columnDef.meta
    const pinPosition = column.getIsPinned()
    const style: CSSProperties = {
      textAlign: meta?.columnAlign || 'left',
    }
    if (pinPosition) {
      style.position = 'sticky'
      if (pinPosition === 'left') {
        style.left = `${column.getStart('left')}px`
      } else {
        style.right = `${column.getAfter('right')}px`
      }
      style.zIndex = themeConfig.value.zIndex?.pinnedColumn
    }
    columnStyleCache.set(column.id, style)
  }
  return columnStyleCache
})
/** 固定列阴影 Map */
const shadowPinnedColumnCache = new Map<string, string>()
const shadowPinnedColumnMap = computed(() => {
  shadowPinnedColumnCache.clear()
  for (const column of allLeafColumns.value) {
    const pinPosition = column.getIsPinned()
    if (!pinPosition) continue
    if (pinPosition === 'left' && column.getIsLastColumn('left')) {
      shadowPinnedColumnCache.set(column.id, 'pinned-left-shadow')
    } else if (pinPosition === 'right' && column.getIsFirstColumn('right')) {
      shadowPinnedColumnCache.set(column.id, 'pinned-right-shadow')
    }
  }
  return shadowPinnedColumnCache
})
// #endregion

// #region 右键菜单逻辑
const contextMenuState = ref<{
  visible: boolean
  x: number
  y: number
  context: VTableContextMenuContext
}>({
  visible: false,
  x: 0,
  y: 0,
  context: {} as VTableContextMenuContext,
})
/** 判断单元格是否处于右键菜单激活 */
const isContextMenuActiveCell = (rowIndex: number, cellIndex: number) => {
  const ctx = contextMenuState.value.context
  return (
    contextMenuState.value.visible &&
    ctx?.type === 'cell' &&
    ctx.rowIndex === rowIndex &&
    ctx.columnIndex === cellIndex
  )
}
/** 判断表头是否处于右键菜单激活 */
const isContextMenuActiveHeader = (columnIndex: number) => {
  const ctx = contextMenuState.value.context
  return contextMenuState.value.visible && ctx?.type === 'header' && ctx.columnIndex === columnIndex
}
/** 处理单元格右键事件 */
const handleCellContextMenu = (
  event: MouseEvent,
  row: Row<TData>,
  cell: Cell<TData, any>,
  rowIndex: number,
  cellIndex: number,
) => {
  if (!props.contextMenuConfig?.enableCellMenu) return
  // 阻止默认右键菜单
  event.preventDefault()
  event.stopPropagation()
  // 过滤掉 checkbox 和 expand 列
  if (cell.column.id === CHECKBOX_COLUMN_KEY || cell.column.id === EXPAND_COLUMN_KEY) {
    return
  }
  contextMenuState.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    context: {
      type: 'cell',
      row: row.original,
      rowIndex,
      column: cell.column.columnDef.meta!,
      columnIndex: cellIndex,
    },
  }
}

/** 处理表头右键事件 */
const handleHeaderContextMenu = (event: MouseEvent, header: any, columnIndex: number) => {
  if (!props.contextMenuConfig?.enableHeaderMenu) return
  // 阻止默认右键菜单
  event.preventDefault()
  event.stopPropagation()
  // 过滤掉 checkbox 和 expand 列
  if (header.column.id === CHECKBOX_COLUMN_KEY || header.column.id === EXPAND_COLUMN_KEY) {
    return
  }
  contextMenuState.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    context: {
      type: 'header',
      column: header.column.columnDef.meta!,
      columnIndex,
    },
  }
}

/** 关闭右键菜单 */
const closeContextMenu = () => {
  contextMenuState.value.visible = false
  contextMenuState.value.context = {} as VTableContextMenuContext
}
// #endregion

onMounted(() => {
  initResizeObserver()
  if (props.defaultExpandAllRows) {
    setAllRowsExpand()
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

useProvideVTableContext({
  tableProps: props,
})

defineExpose<VTableInstance<TData>>({
  tanstackTable: table,
  /** 滚动到指定下标 */
  scrollToIndex: async (index: number, behavior: 'auto' | 'smooth' = 'smooth') => {
    nextTick(() => {
      rowVirtualizer.value.scrollToIndex(index, { align: 'start', behavior })
    })
  },
  /** 设置编辑状态（不传 columnKey 为行编辑，传 columnKey 为单元格编辑，传 null 清除） */
  setEditingState: (rowId: string | number | null, columnKey?: string | null) => {
    table.setEditingState(
      rowId === null ? null : String(rowId),
      columnKey === undefined ? undefined : columnKey === null ? null : String(columnKey),
    )
  },
})
</script>

<style lang="less" scoped>
.border-mixin(@position: bottom) {
  border-@{position}: 1px var(--v-table-border-style) var(--v-table-border-color);
}

.pinned-shadow-base() {
  content: '';
  position: absolute;
  top: 0;
  bottom: -1px;
  width: 30px;
  transition: box-shadow 0.3s;
  pointer-events: none;
}

.v-table-wrapper {
  display: flex;
  flex-direction: column;
}

.v-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  font-size: 14px;
  min-width: 100%;

  :deep(.v-table-header) tr {
    &:not(:last-child) th {
      &.checkbox-col,
      &.expand-col {
        border-bottom: none;
      }
    }
    th {
      position: relative;
      font-weight: 600;
      background-color: var(--v-table-header-bg);
      color: var(--v-table-header-color);
      padding: var(--v-table-header-padding);
      .border-mixin(bottom);
      word-wrap: break-word;
      word-break: break-word;

      &:not(.checkbox-col, .expand-col, :last-child, .pinned-left-shadow)::before {
        content: '';
        position: absolute;
        top: 50%;
        inset-inline-end: 0;
        width: 1px;
        height: 1.6em;
        background-color: var(--v-table-header-split-color);
        transform: translateY(-50%);
      }

      &:first-child {
        border-start-start-radius: var(--v-table-header-border-radius);
      }
      &:last-child {
        border-start-end-radius: var(--v-table-header-border-radius);
      }

      &.v-table-context-menu-active {
        background-color: var(--v-table-context-menu-active-bg, #e6f7ff) !important;
        position: relative;
        z-index: 2;
        outline: 2px solid var(--v-table-context-menu-active-border, #1890ff);
        outline-offset: -2px;
      }
    }
  }

  :deep(.v-table-body) tr {
    &.v-table-row-hover:hover td:not(.v-table-context-menu-active) {
      background-color: var(--v-table-row-hover-color);
    }

    td {
      background-color: var(--v-table-body-bg);
      .border-mixin(bottom);
      padding: var(--v-table-body-padding);
      color: var(--v-table-body-color);
      word-wrap: break-word;
      word-break: break-word;

      &.v-table-context-menu-active {
        background-color: var(--v-table-context-menu-active-bg, #e6f4ff) !important;
        position: relative;
        z-index: 2;
        outline: 1px solid var(--v-table-context-menu-active-border, #1890ff);
        outline-offset: -1px;
      }
    }
  }

  :deep(.v-table-bordered) {
    .v-table-header th {
      &::before {
        display: none;
      }
      .border-mixin(right);
      &:first-child {
        .border-mixin(left);
      }
    }
    .v-table-header tr:first-child > th {
      .border-mixin(top);
    }

    .v-table-body td {
      .border-mixin(right);
      &:first-child {
        .border-mixin(left);
      }
    }
  }

  // #region --------------------------------------- 固定列阴影样式区域 ---------------------------------------
  :deep(.pinned-left-shadow::after) {
    .pinned-shadow-base();
    right: 0;
    transform: translateX(100%);
    box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }

  :deep(.pinned-right-shadow::after) {
    .pinned-shadow-base();
    left: 0;
    transform: translateX(-100%);
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }
  // #endregion --------------------------------------- 固定列阴影样式区域 ---------------------------------------
}
</style>
