<template>
  <div style="height: 400px">
    <VTable
      class="h-full"
      :data="data"
      :columns="columns"
      :fixed-header="true"
      :row-height="48"
      :bordered="true"
      :fixed-footer="true"
    >
      <template #customFooter>
        <div class="w-full bg-[#fafafa] p-[12px]">我是表尾可以自定义</div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'FixedHeaderExample' })

// 生成 100 条数据
const data = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    department: ['技术部', '产品部', '运营部'][i % 3],
  })),
)

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'email', columnHeader: '邮箱', columnWidth: 200 },
  { columnKey: 'department', columnHeader: '部门' },
]
</script>
