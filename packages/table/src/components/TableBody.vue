<template>
  <tbody class="v-table-body">
    <tr v-if="props.paddingTop > 0" :style="{ height: `${props.paddingTop}px` }" />

    <tr
      v-for="vRow in props.virtualRows"
      :key="props.rows[vRow.index]!.id!"
      :ref="
        (el: any) => props.measureElement(el, props.rows[vRow.index]?.original?.[EXPAND_ROW_KEY])
      "
      :data-index="vRow.index"
      :style="{
        height: `${vRow.size}px`,
      }"
      :class="{ 'v-table-row-hover': tableProps.enableRowHover }"
      v-bind="tableProps.customRowAttributes?.(props.rows[vRow.index]!.original, vRow.index)"
    >
      <template v-if="!props.rows[vRow.index]!.original?.[EXPAND_ROW_KEY]">
        <template v-for="section in bodySections" :key="section.key">
          <!-- Padding 单元格 -->
          <td
            v-if="section.isPadding && section.show"
            class="virtual-padding-cell"
            :style="{ width: `${section.width}px`, minWidth: `${section.width}px` }"
          />

          <!-- 数据单元格 -->
          <BodyTd
            v-for="cell in section.getCells?.(props.rows[vRow.index]!) ?? []"
            :key="cell.id"
            :cell="cell"
            :row="props.rows[vRow.index]!"
            :row-index="vRow.index"
            :columns="tableProps.columns"
            :column-style-map="props.columnStyleMap"
            :shadow-pinned-column-map="props.shadowPinnedColumnMap"
            :can-render-cell="props.canRenderCell"
            :get-cell-column-index="props.getCellColumnIndex"
            :is-context-menu-active-cell="props.isContextMenuActiveCell"
            :handle-cell-context-menu="props.handleCellContextMenu"
          >
            <template v-if="$slots.bodyCell" #bodyCell="slotProps">
              <slot name="bodyCell" v-bind="slotProps" />
            </template>
            <template v-if="$slots.customExpandIcon" #customExpandIcon="slotProps">
              <slot name="customExpandIcon" v-bind="slotProps" />
            </template>
          </BodyTd>
        </template>
      </template>
      <!-- 自定义展开行的模板 -->
      <td v-else class="!p-0" :colspan="props.renderedColumnCount">
        <div
          class="overflow-hidden"
          :style="{
            position: props.hasFixedColumns ? 'sticky' : 'static',
            left: 0,
            width: props.hasFixedColumns ? `${props.tableContainerWidth}px` : 'auto',
          }"
        >
          <slot name="expandedRowRender" :row="props.rows[vRow.index]!.original" />
        </div>
      </td>
    </tr>

    <tr
      v-if="props.paddingBottom > 0"
      :style="{ height: `${props.paddingBottom}px`, border: 'none' }"
    />

    <!-- 底部汇总行 -->
    <tr
      v-if="tableProps.summaryConfig?.enabled"
      :class="{ sticky: tableProps.summaryConfig?.fixed }"
      :style="{
        zIndex: props.themeConfig.zIndex?.fixedFooter,
      }"
      class="bottom-0"
    >
      <template v-for="section in summarySections" :key="section.key">
        <!-- Padding 单元格 -->
        <td
          v-if="section.isPadding && section.show"
          class="virtual-padding-cell"
          :style="{ width: `${section.width}px`, minWidth: `${section.width}px` }"
        />

        <!-- 汇总单元格 -->
        <td
          v-for="header in section.headers ?? []"
          v-else
          :key="header.id"
          :style="props.columnStyleMap.get(header.id)"
          :class="[
            header.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
            header.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
            props.shadowPinnedColumnMap.get(header.column.id),
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
      </template>
    </tr>

    <!-- 底部提示模板 (作为最后一行) -->
    <tr v-if="showNoMoreTip" :style="{ borderBottom: 'none' }">
      <td
        :colspan="props.renderedColumnCount"
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
</template>

<script setup lang="ts" generic="TData extends VTableData">
import type { CSSProperties } from 'vue'
import { type Row, type Table } from '@tanstack/vue-table'
import { type VirtualItem } from '@tanstack/vue-virtual'
import { CHECKBOX_COLUMN_KEY, EXPAND_COLUMN_KEY, EXPAND_ROW_KEY } from '../constant'
import { useInjectVTableContext } from '../context'
import type { VTableColumn, VTableData, VTableSlots, VTableThemeConfig } from '../interface'
import { calculateSummary } from '../utils'
import BodyTd from './BodyTd.vue'

defineOptions({ name: 'TableBody' })

defineSlots<VTableSlots<TData>>()

const props = defineProps<{
  table: Table<TData>
  rows: Row<TData>[]
  virtualRows: VirtualItem[]
  paddingTop: number
  paddingBottom: number
  hasFixedColumns: boolean
  tableContainerWidth: number
  columnStyleMap: Map<string, CSSProperties>
  shadowPinnedColumnMap: Map<string, string>
  themeConfig: VTableThemeConfig
  virtualCenterColumns: ReturnType<Table<TData>['getCenterVisibleLeafColumns']>
  virtualPaddingLeft: number
  virtualPaddingRight: number
  renderedColumnCount: number
  measureElement: (el: any, isExpandRow?: boolean) => void
  canRenderCell: (row: TData, column: VTableColumn, rowIndex: number, colIndex: number) => boolean
  getCellColumnIndex: (cell: any) => number
  isContextMenuActiveCell: (rowIndex: number, colIndex: number) => boolean
  handleCellContextMenu: (
    event: MouseEvent,
    row: Row<TData>,
    cell: any,
    rowIndex: number,
    colIndex: number,
  ) => void
}>()

const tableContext = useInjectVTableContext()
const tableProps = computed(() => tableContext.tableProps)
const getVirtualCenterCells = (row: Row<TData>) => {
  const centerCellMap = new Map(row.getCenterVisibleCells().map((cell) => [cell.column.id, cell]))
  const cells = []
  for (const column of props.virtualCenterColumns) {
    const cell = centerCellMap.get(column.id)
    if (cell) {
      cells.push(cell)
    }
  }
  return cells
}
const leftLeafHeaders = computed(() => props.table.getLeftLeafHeaders())
const virtualCenterLeafHeaders = computed(() => {
  const centerHeaderMap = new Map(
    props.table.getCenterLeafHeaders().map((header) => [header.column.id, header]),
  )
  const headers = []
  for (const column of props.virtualCenterColumns) {
    const header = centerHeaderMap.get(column.id)
    if (header) {
      headers.push(header)
    }
  }
  return headers
})
const rightLeafHeaders = computed(() => props.table.getRightLeafHeaders())

/**
 * 虚拟滚动列表体也需要分为五个区域
 * 1. 左固定列
 * 2. 左虚拟padding
 * 3. 中间虚拟列
 * 4. 右虚拟padding
 * 5. 右固定列
 */
const bodySections = computed(() => [
  {
    key: 'left',
    getCells: (row: Row<TData>) => row.getLeftVisibleCells(),
  },
  {
    key: 'left-padding',
    isPadding: true,
    show: props.virtualPaddingLeft > 0,
    width: props.virtualPaddingLeft,
  },
  {
    key: 'center',
    getCells: getVirtualCenterCells,
  },
  {
    key: 'right-padding',
    isPadding: true,
    show: props.virtualPaddingRight > 0,
    width: props.virtualPaddingRight,
  },
  {
    key: 'right',
    getCells: (row: Row<TData>) => row.getRightVisibleCells(),
  },
])

// #region 汇总行逻辑
// 汇总行区域配置：与表体区域对应
const summarySections = computed(() => [
  {
    key: 'left',
    headers: leftLeafHeaders.value,
  },
  {
    key: 'left-padding',
    isPadding: true,
    show: props.virtualPaddingLeft > 0,
    width: props.virtualPaddingLeft,
  },
  {
    key: 'center',
    headers: virtualCenterLeafHeaders.value,
  },
  {
    key: 'right-padding',
    isPadding: true,
    show: props.virtualPaddingRight > 0,
    width: props.virtualPaddingRight,
  },
  {
    key: 'right',
    headers: rightLeafHeaders.value,
  },
])
/** 汇总值 Map */
const summaryValueMap = computed(() => {
  const summaryValueCache = new Map<string, any>()
  const allLeafColumns = props.table.getAllLeafColumns()
  for (const column of allLeafColumns) {
    const columnKey = column.id
    const columnMeta = column.columnDef.meta
    // checkbox 和 expand 列不显示汇总
    if (columnKey === CHECKBOX_COLUMN_KEY || columnKey === EXPAND_COLUMN_KEY) {
      summaryValueCache.set(columnKey, '')
      continue
    }
    // 优先使用全局自定义汇总函数
    if (tableProps.value.summaryConfig?.customSummary) {
      summaryValueCache.set(
        columnKey,
        tableProps.value.summaryConfig.customSummary(columnMeta!, tableProps.value.data),
      )
      continue
    }
    // 使用列配置的汇总方式
    if (columnMeta?.columnSummary) {
      summaryValueCache.set(
        columnKey,
        calculateSummary(tableProps.value.data, columnMeta, columnMeta.columnSummary),
      )
      continue
    }
    summaryValueCache.set(columnKey, '')
  }
  return summaryValueCache
})
// #endregion

// #region 底部提示模板逻辑
const showNoMoreTip = computed(() => {
  return (
    props.rows.length > 0 &&
    !tableProps.value.loading &&
    tableProps.value.loadMoreConfig?.showNoMore
  )
})
const noMoreText = computed(() => tableProps.value.loadMoreConfig?.noMoreText || '没有更多了')
// #endregion
</script>
