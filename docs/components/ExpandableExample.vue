<template>
  <VTable :data="data" :columns="columns" row-key="id" :enable-expand-row="true">
    <template #expandedRowRender="{ row }">
      <div style="background-color: #f0f0f0; padding: 16px">
        <p><strong>详细信息：</strong></p>
        <p>邮箱：{{ row.email }}</p>
        <p>电话：{{ row.phone }}</p>
        <p>地址：{{ row.address }}</p>
      </div>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'ExpandableExample' })

const data = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138001',
    address: '上海市浦东新区',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13800138002',
    address: '广州市天河区',
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnAlign: 'center' },
]
</script>
