<template>
  <div
    v-loading="{
      spinning: props.loading,
      indicator: $slots?.customLoadingIcon?.(),
      bottom: paginationRef?.offsetHeight,
    }"
    class="flex h-full flex-col"
    :style="cssVariables"
  >
    <div
      ref="tableContainerRef"
      class="min-h-0 flex-1 overflow-x-auto"
      :class="{ 'overflow-y-auto': props.fixedHeader }"
    >
      <table class="v-table" :class="{ 'v-table-bordered': props.bordered }">
        <colgroup>
          <col
            v-for="column in table.getAllLeafColumns()"
            :key="column.id"
            :style="{ width: getColumnWidth(column) }"
          />
        </colgroup>
        <thead
          ref="tableHeaderRef"
          class="v-table-header"
          :class="{ sticky: props.fixedHeader }"
          :style="{ top: 0, zIndex: 12 }"
        >
          <slot name="customHeader" :columns="columns" :table="table">
            <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
              <th
                v-for="header in headerGroup.headers"
                :key="header.id"
                :colspan="header.colSpan"
                class="relative"
                :class="[
                  header.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
                  header.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
                  isShadowPinnedColumn(header.column),
                ]"
                :style="getColumnStyle(header.column)"
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
                  <HeaderCell v-else :header="header">
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
            :key="renderRowKeys[vRow.index]"
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
                  :style="getColumnStyle(cell.column)"
                  :class="[isShadowPinnedColumn(cell.column)]"
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
                  <BodyCell v-else :cell="cell">
                    <template v-if="$slots.bodyCell" #bodyCell="slotProps">
                      <!-- 树形结构（第一列添加展开图标和缩进） -->
                      <div
                        v-if="
                          props.treeConfig?.enabled &&
                          cell.column.id === props.columns[0]?.columnKey
                        "
                        class="flex h-full items-center gap-[8px]"
                        :style="{
                          paddingLeft: `${rows[vRow.index]!.depth * (props.treeConfig?.indentSize ?? 16)}px`,
                        }"
                      >
                        <ExpandIcon
                          :class="[rows[vRow.index]!.getCanExpand() ? 'visible' : 'invisible']"
                          class="flex-shrink-0"
                          :expand="rows[vRow.index]!.getIsExpanded()"
                          @expand="rows[vRow.index]!.toggleExpanded()"
                        />
                        <slot name="bodyCell" v-bind="slotProps">
                          {{ slotProps.row[slotProps.columnKey] }}
                        </slot>
                      </div>
                      <slot v-else name="bodyCell" v-bind="slotProps" />
                    </template>
                  </BodyCell>
                </td>
              </template>
            </template>
            <!-- 自定义展开行的模板 -->
            <td
              v-else
              :style="{
                position: hasFixedColumns ? 'sticky' : 'static',
                left: 0,
                width: hasFixedColumns ? `${tableContainerWidth}px` : 'auto',
                maxWidth: hasFixedColumns ? `${tableContainerWidth}px` : 'none',
              }"
              class="p-[12px]"
              :colspan="table.getAllLeafColumns().length"
            >
              <slot name="expandedRowRender" :row="rows[vRow.index]!.original" />
            </td>
          </tr>

          <tr v-if="paddingBottom > 0" :style="{ height: `${paddingBottom}px`, border: 'none' }" />
          <!-- 底部提示模板 (作为最后一行) -->
          <tr v-if="showNoMoreTip" :style="{ borderBottom: 'none' }">
            <td
              :colspan="table.getAllLeafColumns().length"
              class="!border-b-0 p-[12px] text-center text-[14px] text-[rgba(0,0,0,0.32)]"
            >
              <slot name="customLoadNoMore">
                {{ noMoreText }}
              </slot>
            </td>
          </tr>
        </tbody>
        <tfoot :class="{ sticky: props.fixedFooter }" :style="{ bottom: 0, zIndex: 12 }">
          <slot name="customFooter" />
        </tfoot>
      </table>
      <!-- 空状态 -->
      <div
        v-if="!virtualRows.length && !props.loading"
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
import { Virtualizer, useVirtualizer, type VirtualItem } from '@tanstack/vue-virtual'
import { hash } from 'ohash'
import BodyCell from './components/BodyCell.vue'
import HeaderCell from './components/HeaderCell.vue'
import {
  CHECKBOX_COLUMN_KEY,
  EXPAND_COLUMN_KEY,
  EXPAND_ROW_DATA_INDEX,
  EXPAND_ROW_KEY,
  vTableDefaultProps,
} from './constant'
import { useTheme } from './hooks/useTheme'
import ExpandIcon from './icons/ExpandIcon.vue'
import type {
  VTableCheckboxProps,
  VTableColumn,
  VTableData,
  VTableInstance,
  VTablePaginationProps,
  VTableProps,
  VTableSlots,
} from './interface'
import VCheckbox from './libs/VCheckbox.vue'
import vLoading from './libs/VLoading'
import VPagination from './libs/VPagination.vue'
import { buildData, convertToColumnDefList, getAllRowKeys } from './utils'

defineOptions({ name: 'VTable' })

const props = withDefaults(defineProps<VTableProps<TData>>(), vTableDefaultProps)
const $slots = defineSlots<VTableSlots<TData>>()

// #region 自适应列宽计算
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
/** 计算自适应列的实际宽度 */
const adaptiveColumnWidthMap = computed(() => {
  const allColumns = table.getAllLeafColumns()
  const containerWidth = tableContainerWidth.value || 0
  if (containerWidth === 0) return {}
  // 筛选出自适应列（未设置 size 的列）
  const adaptiveColumns = allColumns.filter((col) => !col.columnDef.size)
  const adaptiveCount = adaptiveColumns.length
  if (adaptiveCount === 0) return {}

  // 计算固定列总宽度
  const fixedWidthTotal = allColumns.reduce((sum, col) => {
    // 统计所有设置列宽的列
    if (col.columnDef.size) {
      return sum + Math.round(col.getSize())
    }
    return sum
  }, 0)
  // 计算自适应列的最小总宽度
  const adaptiveMinWidthTotal = adaptiveCount * props.adaptiveColumnWidth

  // 计算剩余可用宽度（避免垂直滚动条导致的计算误差）
  const tolerance = 20
  const remainingWidth = containerWidth - fixedWidthTotal

  // 1. 剩余宽度 >= 自适应列最小总宽度 - 误差，则自适应列均分剩余空间
  if (remainingWidth >= adaptiveMinWidthTotal - tolerance) {
    const avgWidth = Math.floor(remainingWidth / adaptiveCount)
    // 计算余数（因为可能均分之后，不能整除的情况）
    const remainder = remainingWidth % adaptiveCount
    // 将余数分配给前 remainder 列，避免误差
    return adaptiveColumns.reduce(
      (map, col, index) => {
        map[col.id] = avgWidth + (index < remainder ? 1 : 0)
        return map
      },
      {} as Record<string, number>,
    )
  }
  // 2. 剩余宽度 < 自适应列最小总宽度，所有自适应列使用最小宽度
  return adaptiveColumns.reduce(
    (map, col) => {
      map[col.id] = props.adaptiveColumnWidth
      return map
    },
    {} as Record<string, number>,
  )
})
/** 获取表格列宽（用于 colgroup） */
const getColumnWidth = (column: Column<TData>) => {
  const definedSize = column.columnDef.size
  if (definedSize) {
    // 1. 用户传了固定宽度，使用实际宽度（可能被拖拽调整过）
    return `${column.getSize()}px`
  } else {
    // 2. 用户没传，使用自适应列宽
    const adaptiveWidth = adaptiveColumnWidthMap.value[column.id]
    return adaptiveWidth ? `${adaptiveWidth}px` : `${props.adaptiveColumnWidth}px`
  }
}
// #endregion

// #region tanstack-table 核心逻辑
/** checkbox 列 */
const CHECKBOX_COLUMN = computed<ColumnDef<TData>>(() => ({
  id: CHECKBOX_COLUMN_KEY,
  accessorKey: CHECKBOX_COLUMN_KEY,
  size: 40,
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
  size: 42,
  header: () => {
    return ''
  },
  cell: ({ row }: { row: Row<TData> }) => {
    return h(
      'div',
      {
        class: 'flex items-center justify-center w-full h-full',
      },
      h(ExpandIcon, {
        expand: row.getIsExpanded(),
        onExpand: () => row.toggleExpanded(),
      }),
    )
  },
}
const renderRowKeys = computed(() => {
  return rows.value.map((row) => `${row.id}_${hash(row.original)}`)
})
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
const tableData = computed(() => buildData(props.data, props.enableExpandRow))
const table = useVueTable<TData>({
  state: {
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
  },
  getSubRows: (row) => {
    // 如果开启了自定义可展开行
    if (props.enableExpandRow) {
      return (row as any)[EXPAND_ROW_DATA_INDEX]
    }
    // 反之就是开启了 tree 模式，那直接读取用户提供的字段
    return (row as any)[props.treeConfig!.childrenKey!] as TData[] | undefined
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
    pageIndex: pagination.value.pageIndex,
    pageSize: pagination.value.pageSize,
    total:
      props.paginationConfig?.mode === 'client' ? props.data.length : props.paginationConfig.total,
    onPageChange: handlePageChange,
  }
  return () => $slots?.customPagination?.(paginationProps) || h(VPagination, paginationProps)
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
      // 非滚动状态立即更新
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
/** 当展开收起时，需要重新计算虚拟滚动的位置 */
watch(
  () => rows.value.length,
  () => {
    rowVirtualizer.value.measure()
  },
  { immediate: true },
)
function measureElement(element?: any, isExpandRow?: boolean) {
  if (!element) return
  if (isExpandRow) {
    rowVirtualizer.value.measureElement(element)
  } else {
    if (props.rowHeight) return
    rowVirtualizer.value.measureElement(element)
  }
}
watchEffect(() => {
  const [lastItem] = [...virtualRows.value].reverse()
  if (!lastItem || !rowVirtualizer.value.isScrolling) {
    return
  }
  // 判断当前最后一项是否是目前总数据长度的最后一项
  if (lastItem.index >= tableData.value?.length - 1 && !props.loading) {
    props.onScrollToBottom?.()
  }
})
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
  return tableData.value.length > 0 && !props.loading && props.loadMoreConfig?.showNoMore
})
const noMoreText = computed(() => props.loadMoreConfig?.noMoreText || '没有更多了')
// #endregion

// #region 表格样式相关逻辑
const { cssVariables } = useTheme(props.themeConfig)

/** 判断单元格是否应该渲染（被合并的单元格返回 false） */
const canRenderCell = (
  row: TData,
  column: VTableColumn,
  rowIndex: number,
  colIndex: number,
): boolean => {
  const attrs = props.customCellAttributes(row, column, rowIndex, colIndex) || {}
  // 当 colspan 或 rowspan 为 0 时，不渲染该单元格
  if (attrs.colspan === 0 || attrs.rowspan === 0) {
    return false
  }
  return true
}
const getColumnStyle = (column: Column<TData>): CSSProperties => {
  const meta = column.columnDef.meta
  const pinPosition = column.getIsPinned()
  const baseStyle: CSSProperties = {
    padding: '12px',
    textAlign: meta?.columnAlign || 'left',
  }
  // 处理固定列逻辑
  if (pinPosition) {
    baseStyle.position = 'sticky'
    if (pinPosition === 'left') {
      baseStyle.left = `${column.getStart('left')}px`
    } else {
      baseStyle.right = `${column.getAfter('right')}px`
    }
    baseStyle.zIndex = 10
  }
  return baseStyle
}
/** 判断是否为固定阴影列 */
const isShadowPinnedColumn = (column: Column<TData>): string => {
  const pinPosition = column.getIsPinned()
  if (!pinPosition) return ''
  if (pinPosition === 'left' && column.getIsLastColumn('left')) {
    return 'pinned-left-shadow'
  }
  if (pinPosition === 'right' && column.getIsFirstColumn('right')) {
    return 'pinned-right-shadow'
  }
  return ''
}
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

defineExpose<VTableInstance>({
  /** 滚动到指定行 */
  scrollToIndex: async (index: number) => {
    nextTick(() => {
      rowVirtualizer.value.scrollToIndex(index, { align: 'start' })
      virtualRows.value = rowVirtualizer.value.getVirtualItems()
    })
  },
})
</script>

<style lang="less" scoped>
.border-mixin(@position: bottom) {
  border-@{position}: 1px var(--v-table-border-style) var(--v-table-border-color);
}
.v-table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  width: 100%;

  &-header tr {
    &:not(:last-child) th {
      &.checkbox-col,
      &.expand-col {
        border-bottom: none;
      }
    }
    th {
      position: relative;
      background-color: var(--v-table-header-bg);
      .border-mixin(bottom);

      &:not(.checkbox-col, .expand-col, :last-child)::before {
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
    &.v-table-row-hover:hover {
      background-color: var(--v-table-row-hover-color);
    }

    td {
      background-color: var(--v-table-body-bg);
      .border-mixin(bottom);
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

// 固定列阴影样式
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
</style>
