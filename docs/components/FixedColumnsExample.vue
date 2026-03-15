<template>
  <div>
    <div class="mb-4">
      <a-button @click="handleFixColumns">固定左右列</a-button>
      <a-button class="ml-2" @click="handleClearFixed">取消固定</a-button>
    </div>
    <VTable
      v-model:default-column-pinning="columnPinning"
      :data="data"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn, type VTableColumnPinningState } from '@aimerthyr/virtual-table'

defineOptions({ name: 'FixedColumnsExample' })

const columnPinning = ref<VTableColumnPinningState>({})

const data = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区',
    status: '正常',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138001',
    address: '上海市浦东新区',
    status: '正常',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13800138002',
    address: '广州市天河区',
    status: '正常',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    phone: '13800138003',
    address: '深圳市南山区',
    status: '正常',
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: '30%' },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: '20%', columnAlign: 'center' },
  { columnKey: 'email', columnHeader: '邮箱', columnWidth: 200 },
  { columnKey: 'phone', columnHeader: '电话', columnWidth: 150 },
  { columnKey: 'address', columnHeader: '地址', columnWidth: 200 },
  { columnKey: 'status', columnHeader: '状态', columnWidth: 100 },
]

const handleFixColumns = () => {
  columnPinning.value = {
    left: ['name'],
    right: ['status'],
  }
}

const handleClearFixed = () => {
  columnPinning.value = {}
}
</script>
