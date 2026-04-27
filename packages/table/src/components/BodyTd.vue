<template>
  <td
    v-if="
      props.canRenderCell(
        props.row.original,
        props.cell.column.columnDef?.meta!,
        props.rowIndex,
        props.getCellColumnIndex(props.cell),
      )
    "
    :style="props.columnStyleMap.get(props.cell.column.id)"
    :class="[
      props.cell.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
      props.cell.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
      props.shadowPinnedColumnMap.get(props.cell.column.id),
      {
        'v-table-context-menu-active': props.isContextMenuActiveCell(
          props.rowIndex,
          props.getCellColumnIndex(props.cell),
        ),
      },
    ]"
    v-bind="
      tableContext.tableProps.customCellAttributes?.(
        props.row.original,
        props.cell.column.columnDef?.meta!,
        props.rowIndex,
        props.getCellColumnIndex(props.cell),
      ) ?? {}
    "
    @contextmenu="
      props.handleCellContextMenu(
        $event,
        props.row,
        props.cell,
        props.rowIndex,
        props.getCellColumnIndex(props.cell),
      )
    "
  >
    <FlexRender
      v-if="props.cell.column.id === CHECKBOX_COLUMN_KEY"
      :render="props.cell.column.columnDef.cell"
      :props="props.cell.getContext()"
    />
    <BodyCell v-else :cell="props.cell" :columns="props.columns" :row="props.row">
      <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps" />
      </template>
    </BodyCell>
  </td>
</template>

<script setup lang="ts" generic="TData extends VTableData">
import type { CSSProperties } from 'vue'
import { FlexRender, type Cell, type Row } from '@tanstack/vue-table'
import { CHECKBOX_COLUMN_KEY, EXPAND_COLUMN_KEY } from '../constant'
import { useInjectVTableContext } from '../context'
import type { VTableColumn, VTableData, VTableSlots } from '../interface'
import BodyCell from './BodyCell.vue'

defineOptions({ name: 'BodyTd' })

defineSlots<VTableSlots<TData>>()

const tableContext = useInjectVTableContext()

const props = defineProps<{
  cell: Cell<TData, any>
  row: Row<TData>
  rowIndex: number
  columns: VTableColumn[]
  columnStyleMap: Map<string, CSSProperties>
  shadowPinnedColumnMap: Map<string, string>
  canRenderCell: (row: TData, column: VTableColumn, rowIndex: number, colIndex: number) => boolean
  getCellColumnIndex: (cell: Cell<TData, any>) => number
  isContextMenuActiveCell: (rowIndex: number, colIndex: number) => boolean
  handleCellContextMenu: (
    event: MouseEvent,
    row: Row<TData>,
    cell: Cell<TData, any>,
    rowIndex: number,
    colIndex: number,
  ) => void
}>()
</script>
