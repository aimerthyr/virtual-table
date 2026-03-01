<template>
  <slot
    name="bodyCell"
    :row="cell.row.original"
    :column="cell.column.columnDef.meta!"
    :column-key="cell.column.id"
    :row-index="cell.row.index"
  >
    <component :is="cellRender" />
  </slot>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Cell } from '@tanstack/vue-table'
import type { VTableSlots } from '../interface'

defineOptions({ name: 'BodyCell' })

const props = defineProps<{
  cell: Cell<any, any>
}>()

defineSlots<VTableSlots>()

const cellRender = computed(() => {
  const cellDef = props.cell.column.columnDef.cell
  if (typeof cellDef === 'function') {
    const result = cellDef(props.cell.getContext())
    return typeof result === 'string' ? h('span', result) : result
  }
  // 默认显示单元格值
  return h('span', props.cell.getValue() ?? '')
})
</script>
