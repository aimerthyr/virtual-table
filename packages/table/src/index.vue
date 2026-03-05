<template>
  <div class="flex h-full flex-col">
    <div
      v-loading="{ spinning: props.loading, indicator: $slots?.customLoadingIcon?.() }"
      class="relative min-h-0 flex-1"
    >
      <div
        ref="tableContainerRef"
        class="h-full overflow-x-auto"
        :class="{ 'overflow-y-auto': props.fixedHeader }"
      >
        <table
          :class="{ 'v-table-bordered': props.borderConfig?.enabled }"
          :style="{ width: tableWidth }"
        >
          <thead :class="{ sticky: props.fixedHeader }" :style="{ top: 0, zIndex: 12 }">
            <slot name="customHeader" :columns="columns" :table="table">
              <tr
                v-for="headerGroup in table.getHeaderGroups()"
                :key="headerGroup.id"
                :style="{ display: 'flex' }"
              >
                <th
                  v-for="header in headerGroup.headers"
                  :key="header.id"
                  :colspan="header.colSpan"
                  class="relative"
                  :class="[
                    header.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
                    header.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
                    isShadowPinnedColumn(header.column),
                  ]"
                  :style="getColumnStyle(header.column)"
                  v-bind="
                    props?.customHeaderCell?.(
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
                      <template
                        v-if="$slots.customFilterDropdown"
                        #customFilterDropdown="slotProps"
                      >
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

          <tbody>
            <tr v-if="paddingTop > 0" :style="{ display: 'flex', height: `${paddingTop}px` }" />

            <tr
              v-for="vRow in virtualRows"
              :key="renderRowKeys[vRow.index]"
              :ref="(el: any) => measureElement(el, rows[vRow.index]?.original?.[EXPAND_ROW_KEY])"
              :data-index="vRow.index"
              :style="{
                display: 'flex',
                minHeight: `${vRow.size}px`,
                width: '100%',
              }"
              :class="[props.enableRowHover ? 'group hover:!bg-[#fafafa]' : '']"
              v-bind="props?.customRow?.(rows[vRow.index]!.original, vRow.index)"
            >
              <template v-if="!rows[vRow.index]!.original?.[EXPAND_ROW_KEY]">
                <td
                  v-for="cell in rows[vRow.index]!.getVisibleCells()"
                  :key="cell.id"
                  :style="getColumnStyle(cell.column)"
                  class="group-hover:!bg-[#fafafa]"
                  :class="[isShadowPinnedColumn(cell.column)]"
                  v-bind="props?.customCell?.(cell.column.columnDef?.meta!, cell.column.getIndex())"
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
              <!-- 自定义展开行的模板 -->
              <td
                v-else
                :style="{
                  position: hasFixedColumns ? 'sticky' : 'static',
                  left: 0,
                  width: hasFixedColumns ? `${tableContainerWidth}px` : 'auto',
                  maxWidth: hasFixedColumns ? `${tableContainerWidth}px` : 'none',
                }"
              >
                <slot name="expandedRowRender" :row="rows[vRow.index]!.original" />
              </td>
            </tr>

            <tr
              v-if="paddingBottom > 0"
              :style="{ display: 'flex', height: `${paddingBottom}px`, border: 'none' }"
            />
            <!-- 底部提示模板 (作为最后一行) -->
            <tr
              v-if="showNoMoreTip"
              :style="{ display: 'flex', height: `${footerHeight}px`, borderBottom: 'none' }"
            >
              <td class="text-lightest flex w-full items-center justify-center">
                {{ noMoreText }}
              </td>
            </tr>
          </tbody>
        </table>
        <!-- 空状态 -->
        <div v-if="!virtualRows.length" class="absolute inset-0 flex items-center justify-center">
          <slot name="customEmpty"> 当前内容为空 </slot>
        </div>
      </div>
    </div>

    <div
      v-if="props.paginationConfig.enabled"
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
import BodyCell from './components/BodyCell.vue'
import HeaderCell from './components/HeaderCell.vue'
import {
  CHECKBOX_COLUMN_KEY,
  EXPAND_COLUMN_KEY,
  EXPAND_ROW_DATA_INDEX,
  EXPAND_ROW_KEY,
  TABLE_DEFAULT_STYLE,
  vTableDefaultProps,
} from './constant/index.ts'
import ExpandIcon from './icons/ExpandIcon.vue'
import type { VTableCheckboxProps, VTableData, VTablePaginationProps } from './interface/index.ts'
import type { VTableInstance, VTableProps, VTableSlots } from './interface/table.ts'
import VCheckbox from './libs/VCheckbox.vue'
import vLoading from './libs/VLoading'
import VPagination from './libs/VPagination.vue'
import {
  buildData,
  convertSizeToPixels,
  convertToColumnDefList,
  getAllRowKeys,
  simpleHash,
} from './utils/index.ts'

defineOptions({ name: 'VTable' })

const props = withDefaults(defineProps<VTableProps<TData>>(), vTableDefaultProps)
const $slots = defineSlots<VTableSlots<TData>>()

// #region 自适应列宽计算
const tableContainerRef = ref<HTMLDivElement | null>(null)
const tableContainerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null
// 初始化 ResizeObserver（在 onMounted 中调用）
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
  const allColumns = table.getAllColumns()
  const containerWidth = tableContainerWidth.value || 0
  if (containerWidth === 0) return {}
  // 计算固定列总宽度
  const fixedWidthTotal = allColumns.reduce((sum, col) => {
    // 统计所有设置列宽的列
    if (col.columnDef.size) {
      return sum + Math.round(col.getSize())
    }
    return sum
  }, 0)
  // 筛选出自适应列（未设置 size 的列）
  const adaptiveColumns = allColumns.filter((col) => !col.columnDef.size)
  const adaptiveCount = adaptiveColumns.length
  if (adaptiveCount === 0) return {}
  const remainingWidth = Math.max(0, containerWidth - fixedWidthTotal)
  // 1.第一种情况：固定列总宽 < 容器宽度，则自适应列均分剩余空间
  if (remainingWidth > 0) {
    const avgWidth = Math.floor(remainingWidth / adaptiveCount)
    // 计算余数（因为可能均分之后，不能整除的情况）
    const remainder = remainingWidth % adaptiveCount
    // 将余数分配给前 remainder 列，避免像素损失
    return adaptiveColumns.reduce(
      (map, col, index) => {
        map[col.id] = avgWidth + (index < remainder ? 1 : 0)
        return map
      },
      {} as Record<string, number>,
    )
  }
  // 2. 第二种情况：固定列总宽 >= 容器宽度，自适应列使用最小宽度
  return adaptiveColumns.reduce(
    (map, col) => {
      map[col.id] = props.adaptiveColumnWidth
      return map
    },
    {} as Record<string, number>,
  )
})
/** 获取表格列宽 */
const getColumnWidth = (column: Column<TData>) => {
  let width: string | undefined
  const actualSize = column.getSize()
  const definedSize = column.columnDef.size
  if (definedSize) {
    // 1.有固定宽度，使用实际宽度（可能被拖拽调整过）
    width = `${actualSize}px`
  } else {
    // 2.未传入 size 时，则需要设置成自适应列宽
    const adaptiveWidth = adaptiveColumnWidthMap.value[column.id]
    if (adaptiveWidth) {
      width = `${adaptiveWidth}px`
    }
  }
  return width
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
  size: 50,
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
  return rows.value.map((row) => `${row.id}_${simpleHash(row.original)}`)
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
const tableData = computed(() => {
  const data = buildData(props.data)
  if (props.paginationConfig?.enabled && props.paginationConfig?.mode === 'client') {
    const { pageIndex, pageSize } = pagination.value
    const start = (pageIndex - 1) * pageSize
    const end = start + pageSize
    return data.slice(start, end)
  }
  return data
})
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
  enableRowSelection: (row) =>
    Boolean(props.rowSelectionConfig?.getRowCheckDisabled?.(row.original) ?? true),
  manualSorting: true, // 手动排序，结合后端
  manualFiltering: true, // 手动筛选，结合后端
  manualPagination: true,
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
    total: props.paginationConfig.total,
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
const footerHeight = 46
const showNoMoreTip = computed(() => {
  return tableData.value.length > 0 && !props.loading && props.loadMoreConfig?.showNoMore
})
const noMoreText = computed(() => props.loadMoreConfig?.noMoreText || '没有更多了')
// #endregion

// #region 表格样式相关逻辑
const borderColor = computed(() => props.borderConfig?.borderColor || '#f0f0f0')
const borderStyle = computed(() => props.borderConfig?.borderStyle || 'solid')
const getColumnStyle = (column: Column<TData>): CSSProperties => {
  const meta = column.columnDef.meta
  const pinPosition = column.getIsPinned()
  // 处理自适应列宽
  const width = getColumnWidth(column)
  const baseStyle: CSSProperties = {
    ...TABLE_DEFAULT_STYLE,
    width,
    flex: width ? `0 0 ${width}` : '1 0 0',
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
    baseStyle.backgroundColor = '#ffffff'
  }
  if (column.id === CHECKBOX_COLUMN_KEY) {
    baseStyle.display = 'flex'
    baseStyle.alignItems = 'center'
    baseStyle.justifyContent = 'flex-end'
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
/** 计算表格宽度 */
const tableWidth = computed(() => {
  const allColumns = table.getAllColumns()
  const containerWidth = tableContainerWidth.value || 0
  // 容器宽度为 0 时，返回 100%
  if (containerWidth === 0) return '100%'
  // 计算所有列的总宽度
  const totalWidth = allColumns.reduce((sum, col) => {
    const size = col.columnDef.size
    // 如果有固定宽度，使用固定宽度
    if (size) {
      const fixedWidth = convertSizeToPixels(size, containerWidth)
      return sum + fixedWidth
    }
    // 如果是自适应列，使用计算出的自适应宽度
    const adaptiveWidth = adaptiveColumnWidthMap.value[col.id]
    const width = adaptiveWidth || props.adaptiveColumnWidth
    return sum + width
  }, 0)
  return totalWidth <= containerWidth ? '100%' : `${totalWidth}px`
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

defineExpose<VTableInstance>({
  /** 滚动到指定行 */
  scrollToIndex: async (index: number) => {
    nextTick(() => {
      rowVirtualizer.value.scrollToIndex(index, { align: 'start', behavior: 'smooth' })
      virtualRows.value = rowVirtualizer.value.getVirtualItems()
    })
  },
})
</script>

<style lang="less" scoped>
@borderColor: v-bind('borderColor');
@borderStyle: v-bind('borderStyle');

table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

tr {
  border-bottom: 1px @borderStyle @borderColor;
}

/* 表头样式 */
thead {
  tr {
    background-color: #ffffff;
  }
}

/* 带边框样式 */
table.v-table-bordered {
  border: 1px @borderStyle @borderColor;
  border-top: none;
  thead {
    border-top: 1px @borderStyle @borderColor;
  }
  tbody {
    tr > td:not(:last-child) {
      border-right: 1px @borderStyle @borderColor;
    }
    tr:last-child {
      border-bottom: none;
    }
  }
}

.pinned-left-shadow {
  // 固定列阴影不需要分割线
  &::before {
    display: none;
  }
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: -1px;
    width: 30px;
    transform: translateX(100%);
    transition: box-shadow 0.3s;
    content: '';
    pointer-events: none;
    box-shadow: inset 10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }
}

.pinned-right-shadow {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: -1px;
    width: 30px;
    transform: translateX(-100%);
    transition: box-shadow 0.3s;
    content: '';
    pointer-events: none;
    box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.15);
  }
}
</style>
