<template>
  <div
    v-if="tableProps.treeConfig?.enabled && props.cell.column.id === props.columns[0]?.columnKey"
    class="flex h-full items-center gap-[8px]"
    :style="{
      paddingLeft: `${props.row.depth * (tableProps.treeConfig?.indentSize ?? 16)}px`,
    }"
  >
    <div
      class="flex flex-shrink-0 items-center"
      :class="[props.row.getCanExpand() ? 'visible' : 'invisible']"
    >
      <slot
        :expand="props.row.getIsExpanded()"
        name="customExpandIcon"
        @expand-change="handleExpandChange"
      >
        <ExpandIcon :expand="props.row.getIsExpanded()" @expand-change="handleExpandChange" />
      </slot>
    </div>
    <component :is="cellRender" />
  </div>
  <component :is="cellRender" v-else />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Cell, Row } from '@tanstack/vue-table'
import { useInjectVTableContext } from '../context'
import ExpandIcon from '../icons/ExpandIcon.vue'
import type { VTableColumn, VTableSlots } from '../interface'
import { hasPassSlot } from '../utils'

defineOptions({ name: 'BodyCell' })

const props = defineProps<{
  cell: Cell<any, any>
  columns: VTableColumn[]
  row: Row<any>
}>()

const tableContext = useInjectVTableContext()
const tableProps = computed(() => tableContext.tableProps)
const slots = defineSlots<VTableSlots>()

const columnKey = props.cell.column.id
const rowIndex = props.cell.row.index
const originalRow = computed(() => props.cell.row.original)
const column = computed(() => props.cell.column.columnDef.meta!)
const isRowEditing = computed(() => {
  return props.cell.getContext().table.isEditing(props.row.id)
})
const isCellEditing = computed(() => {
  return props.cell.getContext().table.isEditing(props.row.id, props.cell.column.id)
})

const handleExpandChange = async () => {
  props.row.toggleExpanded()
  tableProps.value.onExpand?.(props.row.getIsExpanded(), originalRow.value)
}

const cellRender = computed(() => {
  return () => {
    const bodyCellContent = slots.bodyCell?.({
      columnKey,
      rowIndex,
      row: originalRow.value,
      column: column.value,
      isEditingMode: isRowEditing.value ? 'row' : isCellEditing.value ? 'cell' : null,
    })
    const vNode = bodyCellContent?.[0]
    if (hasPassSlot(vNode)) {
      return bodyCellContent
    }
    const cellDef = props.cell.column.columnDef.cell
    if (typeof cellDef === 'function') {
      const result = cellDef(props.cell.getContext())
      return typeof result === 'string' ? h('span', result) : result
    }
    // 默认显示单元格值
    return h('span', props.cell.getValue() ?? '')
  }
})
</script>
