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
      class="v-table-container min-h-0 flex-1"
      :class="{ 'overflow-y-auto': props.fixedHeader }"
    >
      <table
        class="v-table"
        :class="{ 'v-table-bordered': props.bordered }"
        :style="{ width: props.layoutMode === 'fixed' ? '100%' : 'max-content' }"
      >
        <colgroup>
          <col
            v-for="column in allLeafColumns"
            :key="column.id"
            :style="{ width: columnWidthMap[column.id] }"
          />
        </colgroup>
        <thead
          ref="tableHeaderRef"
          class="v-table-header"
          :class="{ sticky: props.fixedHeader }"
          :style="{ top: 0, zIndex: themeConfig.zIndex?.fixedHeader }"
        >
          <slot name="customHeader" :columns="props.columns" :table="table">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                :colspan="header.colSpan"
                class="relative"
                :class="[
                  header.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
                  header.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
                  shadowPinnedColumnMap.get(header.column.id),
                ]"
                :style="columnStyleMap.get(header.column.id)"
                v-bind="
                  props?.customHeaderCellAttributes?.(
                    header.column.columnDef?.meta!,
                    header.column.getIndex(),
                  )
                "
              >
                <template v-if="!header.isPlaceholder">
                  <FlexRender
                    v-if="header.id === CHECKBOX_COLUMN_KEY"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                  />
                  <HeaderCell v-else :header="header" :table="table">
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
                  </HeaderCell>
                </template>
              </th>
            </tr>
          </slot>
        </thead>

        <tbody class="v-table-body">
          <tr v-if="paddingTop > 0" :style="{ height: `${paddingTop}px` }" />

          <tr
            v-for="vRow in virtualRows"
            :key="rows[vRow.index]!.id!"
            :ref="(el: any) => measureElement(el, rows[vRow.index]?.original?.[EXPAND_ROW_KEY])"
            :data-index="vRow.index"
            :style="{
              minHeight: `${vRow.size}px`,
            }"
            :class="{ 'v-table-row-hover': props.enableRowHover }"
            v-bind="props?.customRowAttributes?.(rows[vRow.index]!.original, vRow.index)"
          >
            <template v-if="!rows[vRow.index]!.original?.[EXPAND_ROW_KEY]">
              <template
                v-for="(cell, cellIndex) in rows[vRow.index]!.getVisibleCells()"
                :key="cell.id"
              >
                <td
                  v-if="
                    canRenderCell(
                      rows[vRow.index]!.original,
                      cell.column.columnDef?.meta!,
                      vRow.index,
                      cellIndex,
                    )
                  "
                  :style="columnStyleMap.get(cell.column.id)"
                  :class="[
                    cell.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
                    cell.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
                    shadowPinnedColumnMap.get(cell.column.id),
                  ]"
                  v-bind="
                    props.customCellAttributes?.(
                      rows[vRow.index]!.original,
                      cell.column.columnDef?.meta!,
                      vRow.index,
                      cellIndex,
                    ) ?? {}
                  "
                >
                  <FlexRender
                    v-if="cell.column.id === CHECKBOX_COLUMN_KEY"
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                  <BodyCell v-else :cell="cell" :columns="props.columns" :row="rows[vRow.index]!">
                    <template v-if="$slots.bodyCell" #bodyCell="slotProps">
                      <slot name="bodyCell" v-bind="slotProps" />
                    </template>
                    <template v-if="$slots.customExpandIcon" #customExpandIcon="slotProps">
                      <slot name="customExpandIcon" v-bind="slotProps" />
                    </template>
                  </BodyCell>
                </td>
              </template>
            </template>
            <!-- 自定义展开行的模板 -->
            <td v-else class="!p-0" :colspan="allLeafColumns.length">
              <div
                class="overflow-hidden"
                :style="{
                  position: hasFixedColumns ? 'sticky' : 'static',
                  left: 0,
                  width: hasFixedColumns ? `${tableContainerWidth}px` : 'auto',
                }"
              >
                <slot name="expandedRowRender" :row="rows[vRow.index]!.original" />
              </div>
            </td>
          </tr>

          <tr v-if="paddingBottom > 0" :style="{ height: `${paddingBottom}px`, border: 'none' }" />

          <!-- 底部汇总行 -->
          <tr
            v-if="props.summaryConfig?.enabled"
            :class="{ sticky: props.summaryConfig?.fixed }"
            :style="{
              zIndex: themeConfig.zIndex?.fixedFooter,
            }"
            class="bottom-0"
          >
            <td
              v-for="header in table.getFlatHeaders()"
              :key="header.id"
              :style="columnStyleMap.get(header.id)"
              :class="[
                header.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
                header.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
                shadowPinnedColumnMap.get(header.column.id),
              ]"
            >
              <slot
                v-if="$slots.summaryCell"
                name="summaryCell"
                :column-key="header.column.id"
                :column="header.column.columnDef.meta!"
                :summary-value="summaryValueMap.get(header.column.id)"
              >
                {{ summaryValueMap.get(header.column.id) }}
              </slot>
              <template v-else>
                {{ summaryValueMap.get(header.column.id) }}
              </template>
            </td>
          </tr>

          <!-- 底部提示模板 (作为最后一行) -->
          <tr v-if="showNoMoreTip" :style="{ borderBottom: 'none' }">
            <td
              :colspan="allLeafColumns.length"
              class="!border-b-0 !p-0 text-center text-[14px] text-[rgba(0,0,0,0.32)]"
            >
              <slot name="customLoadNoMore">
                <div class="p-[12px]">
                  {{ noMoreText }}
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot
          :class="{ sticky: props.fixedFooter }"
          :style="{ bottom: 0, zIndex: themeConfig.zIndex?.fixedFooter }"
        >
          <tr>
            <td class="!p-0" :colspan="allLeafColumns.length">
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
        :style="{ height: `calc(100% - ${tableHeaderRef?.offsetHeight ?? 0}px)` }"
        class="flex items-center justify-center"
      >
        <slot name="customEmpty"> 当前内容为空 </slot>
      </div>
    </div>

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
import { type CSSProperties } from 'vue'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  useVueTable,
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
import { Virtualizer, useVirtualizer, type VirtualItem } from '@tanstack/vue-virtual'
import BodyCell from './components/BodyCell.vue'
import HeaderCell from './components/HeaderCell.vue'
import {
  CHECKBOX_COLUMN_KEY,
  EXPAND_COLUMN_KEY,
  EXPAND_ROW_KEY,
  vTableDefaultProps,
} from './constant'
import { useProvideVTableContext } from './context'
import { EditingStateFeature, type EditingState } from './features/editingState'
import { useTheme } from './hooks/useTheme'
import ExpandIcon from './icons/ExpandIcon.vue'
import type {
  VTableCheckboxProps,
  VTableColumn,
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
import { calculateSummary, convertToColumnDefList, getAllRowKeys } from './utils'

defineOptions({ name: 'VTable' })

const props = withDefaults(defineProps<VTableProps<TData>>(), vTableDefaultProps)
const $slots = defineSlots<VTableSlots<TData>>()

// #region 自适应列宽计算
const allLeafColumns = computed(() => table.getAllLeafColumns())
const tableHeaderRef = ref<HTMLDivElement>()
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
    if (col.columnDef.size) fixedTotal += Number(col.columnDef.size)
    else flexCount += 1
  })
  // 计算 “剩余空间” 平分给每一个自适应列后，每列能分到多少像素 （剩余空间 = 容器总宽度 - 固定列总宽度）
  const avg = flexCount > 0 ? (containerWidth - fixedTotal) / flexCount : 0
  // 如果平分后的像素比最小自适应列宽还小，则认为空间不足
  const isCramped = flexCount > 0 && avg < MIN_WIDTH
  return { isCramped, minWidth: MIN_WIDTH }
})
const columnWidthMap = computed(() => {
  const allColumns = table.getAllLeafColumns()
  const { isCramped, minWidth } = columnWidthConfig.value
  const map: Record<string, string> = {}
  allColumns.forEach((column) => {
    // 如果设置了宽度，则直接使用
    if (column.columnDef.size) {
      map[column.id] = `${column.getSize()}px`
    } else {
      // 反之如果没有，则需要判断是否为空间不足，如果是则设置最小宽度，反之使用 auto 来填满剩余空间
      map[column.id] = isCramped ? `${minWidth}px` : 'auto'
    }
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
  return columnPinning.value.left?.length || columnPinning.value.right?.length
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
const tableData = computed(() => props.data)
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
      return pagination.value
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
    pagination.value =
      typeof updaterOrValue === 'function' ? updaterOrValue(pagination.value) : updaterOrValue
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

// #region 虚拟滚动相关逻辑
const rows = computed(() => table.getRowModel().rows)
// 限制重新渲染的频率 https://github.com/TanStack/virtual/issues/860
const virtualRows = ref<VirtualItem[]>([])
const rerenderTimer = ref<number | null>(null)
const lastRenderTime = ref(0)
const rowVirtualizerOptions = computed(() => {
  return {
    count: rows.value.length,
    estimateSize: () => props.rowHeight || 48,
    getScrollElement: () => tableContainerRef.value,
    overscan: 10,
    useScrollendEvent: false,
    useAnimationFrameWithResizeObserver: true,
    onChange: (instance: Virtualizer<HTMLDivElement, HTMLDivElement>) => {
      if (instance.scrollOffset && instance.scrollOffset < 0) return
      if (!instance.isScrolling) {
        virtualRows.value = instance.getVirtualItems()
        return
      }
      // 滚动时 60fps 节流
      const now = performance.now()
      const targetFrameTime = 1000 / 60
      if (now - lastRenderTime.value > targetFrameTime) {
        lastRenderTime.value = now
        if (rerenderTimer.value) {
          cancelAnimationFrame(rerenderTimer.value)
        }
        rerenderTimer.value = requestAnimationFrame(() => {
          virtualRows.value = instance.getVirtualItems()
          rerenderTimer.value = null
        })
      }
    },
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
function measureElement(element?: any, isExpandRow?: boolean) {
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

// #region 底部提示逻辑
/** 底部提示行高度 */
const showNoMoreTip = computed(() => {
  return rows.value.length > 0 && !props.loading && props.loadMoreConfig?.showNoMore
})
const noMoreText = computed(() => props.loadMoreConfig?.noMoreText || '没有更多了')
// #endregion

// #region 表格样式相关逻辑
const { cssVariables, themeConfig } = useTheme(props.themeConfig)
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

// #region 汇总行逻辑
/** 汇总值 Map */
const summaryValueCache = new Map<string, any>()
const summaryValueMap = computed(() => {
  summaryValueCache.clear()
  for (const column of allLeafColumns.value) {
    const columnKey = column.id
    const columnMeta = column.columnDef.meta
    // checkbox 和 expand 列不显示汇总
    if (columnKey === CHECKBOX_COLUMN_KEY || columnKey === EXPAND_COLUMN_KEY) {
      summaryValueCache.set(columnKey, '')
      continue
    }
    // 优先使用全局自定义汇总函数
    if (props.summaryConfig?.customSummary) {
      summaryValueCache.set(columnKey, props.summaryConfig.customSummary(columnMeta!, props.data))
      continue
    }
    // 使用列配置的汇总方式
    if (columnMeta?.columnSummary) {
      summaryValueCache.set(
        columnKey,
        calculateSummary(props.data, columnMeta, columnMeta.columnSummary),
      )
      continue
    }
    summaryValueCache.set(columnKey, '')
  }
  return summaryValueCache
})
// #endregion

onMounted(() => {
  initResizeObserver()
  if (props.defaultExpandAllRows) {
    setAllRowsExpand()
  }
})

onBeforeUnmount(() => {
  if (rerenderTimer.value) {
    cancelAnimationFrame(rerenderTimer.value)
    rerenderTimer.value = null
  }
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

  &-header tr {
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
      white-space: normal;

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
    }
  }

  &-body tr {
    &.v-table-row-hover:hover td {
      background-color: var(--v-table-row-hover-color);
    }

    td {
      background-color: var(--v-table-body-bg);
      .border-mixin(bottom);
      padding: var(--v-table-body-padding);
      color: var(--v-table-body-color);
      word-wrap: break-word;
      word-break: break-word;
      white-space: normal;
    }
  }

  &.v-table-bordered {
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
}

// #region --------------------------------------- 固定列阴影样式区域 ---------------------------------------
.pinned-shadow-base() {
  content: '';
  position: absolute;
  top: 0;
  bottom: -1px;
  width: 30px;
  transition: box-shadow 0.3s;
  pointer-events: none;
}

.pinned-left-shadow::after {
  .pinned-shadow-base();
  right: 0;
  transform: translateX(100%);
  box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
}

.pinned-right-shadow::after {
  .pinned-shadow-base();
  left: 0;
  transform: translateX(-100%);
  box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
}

// #endregion --------------------------------------- 固定列阴影样式区域 ---------------------------------------

// #region --------------------------------------- 滚动条样式区域 ---------------------------------------
.v-table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.v-table-container::-webkit-scrollbar-track {
  background: transparent;
}

.v-table-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.v-table-container::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.4);
}

@supports not selector(::-webkit-scrollbar) {
  .v-table-container {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
  }
}

// #endregion --------------------------------------- 滚动条样式区域 ---------------------------------------
</style>
