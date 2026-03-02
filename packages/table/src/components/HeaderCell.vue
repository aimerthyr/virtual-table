<template>
  <div class="flex h-full w-full items-center">
    <div
      :class="[
        columnMeta?.columnAlign === 'right' ? 'inline-flex' : 'flex',
        canSort ? 'cursor-pointer' : '',
      ]"
      class="min-w-0 flex-1 items-center gap-[4px]"
      @click="handleHeaderClick"
    >
      <slot name="headerCell" :column="columnMeta" :column-key="columnId">
        <component :is="headerRender" />
      </slot>
      <div class="ml-auto flex items-center">
        <SorterIcon v-if="canSort" :class="{ 'mr-[16px]': canFilter }" :sort="currentSort" />
        <HeaderFilter v-if="canFilter" :header="props.header">
          <template v-if="$slots.customFilterDropdown" #customFilterDropdown="slotProps">
            <slot name="customFilterDropdown" v-bind="slotProps" />
          </template>
        </HeaderFilter>
      </div>
    </div>
    <div
      v-if="canResize"
      class="resize-handle"
      :class="[column.getIsResizing() ? 'isResizing' : '']"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
      @dblclick.stop="handleDoubleClick"
    >
      <div class="resize-handle-line" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Header } from '@tanstack/vue-table'
import SorterIcon from '../icons/SorterIcon.vue'
import type { VTableSlots } from '../interface'
import HeaderFilter from './HeaderFilter.vue'

defineOptions({ name: 'HeaderCell' })

defineSlots<VTableSlots>()

const props = defineProps<{
  header: Header<any, any>
}>()

const column = computed(() => props.header.column)
const columnDef = computed(() => column.value.columnDef)
const columnMeta = computed(() => columnDef.value.meta!)
const columnId = computed(() => column.value.id)

/** 渲染表头默认值 */
const headerRender = computed(() => {
  const headerDef = columnDef.value.header
  if (typeof headerDef === 'function') {
    const result = headerDef(props.header.getContext())
    return typeof result === 'string' ? h('span', result) : result
  }
  // 默认显示 header 字符串或列 ID
  return h('span', String(headerDef ?? columnId.value))
})

// #region 排序相关
const canSort = computed(() => columnDef.value.enableSorting)
const currentSort = computed(() => column.value.getIsSorted() || null)
const handleHeaderClick = (event: MouseEvent) => {
  if (canSort.value) {
    column.value.getToggleSortingHandler()?.(event)
  }
}
// #endregion

// #region 筛选相关
const canFilter = computed(() => columnDef.value.enableColumnFilter)
// #endregion

const canResize = computed(() => column.value.getCanResize())
const handleMouseDown = (event: MouseEvent) => {
  props.header.getResizeHandler()?.(event)
}
const handleTouchStart = (event: TouchEvent) => {
  props.header.getResizeHandler()?.(event)
}
const handleDoubleClick = () => {
  column.value.resetSize()
}
</script>

<style lang="less" scoped>
.resize-handle {
  position: absolute;
  top: 0;
  height: 100% !important;
  bottom: 0;
  left: auto !important;
  right: -8px;
  cursor: col-resize;
  touch-action: none;
  user-select: auto;
  width: 16px;
  z-index: 1;

  .resize-handle-line {
    display: block;
    width: 1px;
    margin-left: 7px;
    height: 100% !important;
    background-color: #1677ff;
    opacity: 0;
    transition: opacity 0.2s;
  }

  &.isResizing .resize-handle-line {
    opacity: 1;
  }
}
</style>
