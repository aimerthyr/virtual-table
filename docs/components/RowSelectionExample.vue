<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-tag color="blue">已选择: {{ selectedRows.length }} 条</a-tag>
    </div>
    <VTable
      :data="data"
      :columns="columns"
      row-key="id"
      :row-selection-config="{
        enabled: true,
        getRowCheckDisabled: (row) => row.disabled ?? false,
        onChange: handleSelectionChange,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'RowSelectionExample' })

interface DataRow {
  id: number
  name: string
  age: number
  status: string
  disabled?: boolean
}

const selectedRows = ref<DataRow[]>([])

const data = ref<DataRow[]>([
  { id: 1, name: '张三', age: 28, status: '正常' },
  { id: 2, name: '李四', age: 32, status: '正常' },
  { id: 3, name: '王五', age: 25, status: '已禁用', disabled: true },
  { id: 4, name: '赵六', age: 35, status: '正常' },
  { id: 5, name: '钱七', age: 29, status: '已禁用', disabled: true },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'status', columnHeader: '状态' },
]

const handleSelectionChange = (rows: DataRow[]) => {
  selectedRows.value = rows
}
</script>
