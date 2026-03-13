<template>
  <div
    v-if="props.treeConfig?.enabled && props.cell.column.id === props.columns[0]?.columnKey"
    class="flex h-full items-center gap-[8px]"
    :style="{
      paddingLeft: `${props.row.depth * (props.treeConfig?.indentSize ?? 16)}px`,
    }"
  >
    <div class="flex-shrink-0" :class="[props.row.getCanExpand() ? 'visible' : 'invisible']">
      <slot
        :expand="props.row.getIsExpanded()"
        :on-expand-change="props.row.toggleExpanded"
        name="customExpandIcon"
      >
        <ExpandIcon :expand="props.row.getIsExpanded()" @expand-change="props.row.toggleExpanded" />
      </slot>
    </div>
    <component :is="cellRender" />
  </div>
  <component :is="cellRender" v-else />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Cell, Row } from '@tanstack/vue-table'
import ExpandIcon from '../icons/ExpandIcon.vue'
import type { VTableColumn, VTableSlots, VTableTreeConfig } from '../interface'
import { hasPassSlot } from '../utils'

defineOptions({ name: 'BodyCell' })

const props = defineProps<{
  cell: Cell<any, any>
  treeConfig: VTableTreeConfig
  columns: VTableColumn[]
  row: Row<any>
}>()

const slots = defineSlots<VTableSlots>()

const columnKey = computed(() => props.cell.column.id)
const rowIndex = computed(() => props.cell.row.index)
const row = computed(() => props.cell.row.original)
const column = computed(() => props.cell.column.columnDef.meta!)

const cellRender = computed(() => {
  const bodyCellContent = slots.bodyCell?.({
    columnKey: columnKey.value,
    row: row.value,
    column: column.value,
    rowIndex: rowIndex.value,
  })
  const vNode = bodyCellContent?.[0]
  if (hasPassSlot(vNode)) {
    return () => bodyCellContent
  }
  const cellDef = props.cell.column.columnDef.cell
  if (typeof cellDef === 'function') {
    const result = cellDef(props.cell.getContext())
    return typeof result === 'string' ? h('span', result) : result
  }
  // 默认显示单元格值
  return h('span', props.cell.getValue() ?? '')
})
</script>
