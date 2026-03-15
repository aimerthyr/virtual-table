<template>
  <VTable
    :data="data"
    :columns="columns"
    :bordered="true"
    row-key="id"
    :tree-config="{
      enabled: true,
      childrenKey: 'children',
    }"
  />
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'TreeDataExample' })

const data = ref([
  {
    id: 1,
    name: '技术部',
    count: 15,
    children: [
      { id: 11, name: '前端组', count: 8 },
      { id: 12, name: '后端组', count: 7 },
    ],
  },
  {
    id: 2,
    name: '产品部',
    count: 10,
    children: [
      { id: 21, name: '产品组', count: 6 },
      { id: 22, name: '设计组', count: 4 },
    ],
  },
  {
    id: 3,
    name: '运营部',
    count: 8,
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'name', columnHeader: '部门名称', columnWidth: 200 },
  { columnKey: 'count', columnHeader: '人数', columnAlign: 'center' },
]
</script>
