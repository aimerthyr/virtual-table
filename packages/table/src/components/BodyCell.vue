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
    <slot name="bodyCell" v-bind="bodyCellSlotProps">
      <component :is="cellRender" />
    </slot>
  </div>

  <slot v-else name="bodyCell" v-bind="bodyCellSlotProps">
    <component :is="cellRender" />
  </slot>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Cell, Row } from '@tanstack/vue-table'
import ExpandIcon from '../icons/ExpandIcon.vue'
import type { VTableBodyCellProps, VTableColumn, VTableSlots, VTableTreeConfig } from '../interface'

defineOptions({ name: 'BodyCell' })

const props = defineProps<{
  cell: Cell<any, any>
  treeConfig: VTableTreeConfig
  columns: VTableColumn[]
  row: Row<any>
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

const bodyCellSlotProps = computed<VTableBodyCellProps>(() => {
  return {
    row: props.cell.row.original,
    column: props.cell.column.columnDef.meta!,
    columnKey: props.cell.column.id,
    rowIndex: props.cell.row.index,
  }
})
</script>
