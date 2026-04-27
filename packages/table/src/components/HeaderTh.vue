<template>
  <th
    :colspan="colspan"
    class="relative"
    :class="[
      header.column.id === CHECKBOX_COLUMN_KEY ? 'checkbox-col' : '',
      header.column.id === EXPAND_COLUMN_KEY ? 'expand-col' : '',
      shadowPinnedColumnMap.get(header.column.id),
      { 'v-table-context-menu-active': isContextMenuActiveHeader(columnIndex) },
    ]"
    :style="columnStyleMap.get(header.column.id)"
    v-bind="
      tableContext.tableProps.customHeaderCellAttributes?.(
        header.column.columnDef?.meta!,
        columnIndex,
      )
    "
    @contextmenu="handleHeaderContextMenu($event, header, columnIndex)"
  >
    <template v-if="!header.isPlaceholder">
      <FlexRender
        v-if="header.id === CHECKBOX_COLUMN_KEY"
        :render="header.column.columnDef.header"
        :props="header.getContext()"
      />
      <HeaderCell v-else :header="header" :table="table">
        <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps" />
        </template>
      </HeaderCell>
    </template>
  </th>
</template>

<script setup lang="ts" generic="TData extends VTableData">
import type { CSSProperties } from 'vue'
import { FlexRender, type Header, type Table } from '@tanstack/vue-table'
import { CHECKBOX_COLUMN_KEY, EXPAND_COLUMN_KEY } from '../constant'
import { useInjectVTableContext } from '../context'
import type { VTableData, VTableSlots } from '../interface'
import HeaderCell from './HeaderCell.vue'

defineSlots<VTableSlots<TData>>()

const tableContext = useInjectVTableContext()

const props = defineProps<{
  colspan?: number
  header: Header<TData, any>
  table: Table<TData>
  columnStyleMap: Map<string, CSSProperties>
  shadowPinnedColumnMap: Map<string, string>
  isContextMenuActiveHeader: (columnIndex: number) => boolean
  handleHeaderContextMenu: (
    event: MouseEvent,
    header: Header<TData, any>,
    columnIndex: number,
  ) => void
}>()

const columnIndex = computed(() => {
  return props.header.getLeafHeaders()[0]?.column.getIndex() ?? props.header.column.getIndex()
})
</script>
