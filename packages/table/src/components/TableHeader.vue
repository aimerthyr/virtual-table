<template>
  <thead
    ref="headerRef"
    class="v-table-header"
    :class="{ sticky: tableContext.tableProps.fixedHeader }"
    :style="{ top: 0, zIndex: themeConfig.zIndex?.fixedHeader }"
  >
    <slot
      name="customHeader"
      :columns="tableContext.tableProps.columns"
      :table="table"
      :virtual-columns="virtualCenterColumns"
      :virtual-padding-left="virtualPaddingLeft"
      :virtual-padding-right="virtualPaddingRight"
    >
      <tr v-for="(headerGroup, headerGroupIndex) in headerGroups" :key="headerGroup.id">
        <template v-for="section in headerSections" :key="section.key">
          <!-- Padding 单元格 -->
          <th
            v-if="section.isPadding && section.show"
            class="virtual-padding-cell"
            :style="{ width: `${section.width}px`, minWidth: `${section.width}px` }"
          />

          <!-- 表头单元格 -->
          <HeaderTh
            v-for="header in section.headers?.(headerGroupIndex) ?? []"
            v-else
            :key="header.id"
            :colspan="section.getColspan?.(header)"
            :header="header"
            :table="table"
            :column-style-map="columnStyleMap"
            :shadow-pinned-column-map="shadowPinnedColumnMap"
            :is-context-menu-active-header="isContextMenuActiveHeader"
            :handle-header-context-menu="handleHeaderContextMenu"
          >
            <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
              <slot :name="name" v-bind="slotProps" />
            </template>
          </HeaderTh>
        </template>
      </tr>
    </slot>
  </thead>
</template>

<script setup lang="ts" generic="TData extends VTableData">
import type { CSSProperties } from 'vue'
import { type Column, type Header, type Table } from '@tanstack/vue-table'
import { useInjectVTableContext } from '../context'
import type { VTableData, VTableSlots, VTableThemeConfig } from '../interface'
import HeaderTh from './HeaderTh.vue'

defineOptions({ name: 'TableHeader' })

defineSlots<VTableSlots<TData>>()

const props = defineProps<{
  table: Table<TData>
  themeConfig: VTableThemeConfig
  virtualCenterColumns: Column<TData>[]
  virtualPaddingLeft: number
  virtualPaddingRight: number
  columnStyleMap: Map<string, CSSProperties>
  shadowPinnedColumnMap: Map<string, string>
  isContextMenuActiveHeader: (columnIndex: number) => boolean
  handleHeaderContextMenu: (
    event: MouseEvent,
    header: Header<TData, any>,
    columnIndex: number,
  ) => void
}>()

const tableContext = useInjectVTableContext()

const headerRef = ref<HTMLDivElement>()
const headerGroups = computed(() => props.table.getHeaderGroups())
const leftHeaderGroups = computed(() => props.table.getLeftHeaderGroups())
const centerHeaderGroups = computed(() => props.table.getCenterHeaderGroups())
const rightHeaderGroups = computed(() => props.table.getRightHeaderGroups())
const virtualCenterColumnIdSet = computed(() => {
  return new Set(props.virtualCenterColumns.map((column) => column.id))
})

const getVirtualCenterHeaderColSpan = (header: Header<TData, any>) => {
  // 对于占位符，直接检查其列 ID 是否在虚拟列集合中
  if (header.isPlaceholder) {
    return virtualCenterColumnIdSet.value.has(header.column.id) ? 1 : 0
  }
  // 对于真实的分组表头，过滤出在虚拟列集合中的叶子节点
  const leafHeaders = header.getLeafHeaders()
  const filteredLeafHeaders = leafHeaders.filter((leafHeader) => {
    return virtualCenterColumnIdSet.value.has(leafHeader.column.id)
  })
  return filteredLeafHeaders.length
}

const getVirtualCenterHeaders = (headers: Header<TData, any>[] = []) => {
  return headers.filter((header) => getVirtualCenterHeaderColSpan(header) > 0)
}

/**
 * 虚拟固定列需要分成五个区域：
 * 1. 左固定列
 * 2. 左虚拟padding
 * 3. 中间虚拟列
 * 4. 右虚拟padding
 * 5. 右固定列
 */
const headerSections = computed(() => [
  {
    key: 'left',
    headers: (index: number) => leftHeaderGroups.value[index]?.headers ?? [],
    getColspan: (header: Header<TData, any>) => header.colSpan,
  },
  {
    key: 'left-padding',
    isPadding: true,
    show: props.virtualPaddingLeft > 0,
    width: props.virtualPaddingLeft,
  },
  {
    key: 'center',
    headers: (index: number) => getVirtualCenterHeaders(centerHeaderGroups.value[index]?.headers),
    getColspan: getVirtualCenterHeaderColSpan,
  },
  {
    key: 'right-padding',
    isPadding: true,
    show: props.virtualPaddingRight > 0,
    width: props.virtualPaddingRight,
  },
  {
    key: 'right',
    headers: (index: number) => rightHeaderGroups.value[index]?.headers ?? [],
    getColspan: (header: Header<TData, any>) => header.colSpan,
  },
])

defineExpose({
  tableHeaderElement: computed(() => headerRef.value),
})
</script>
