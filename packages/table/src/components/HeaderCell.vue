<template>
  <div
    :class="[
      columnMeta?.columnAlign === 'right' ? 'inline-flex' : 'flex',
      canSort ? 'cursor-pointer' : '',
    ]"
    class="items-center gap-[4px]"
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
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import type { Header } from '@tanstack/vue-table'
import type { VTableSlots } from '../interface'
import HeaderFilter from './HeaderFilter.vue'
import SorterIcon from './SorterIcon.vue'

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
</script>
