<template>
  <div>
    <div style="display: flex; margin-bottom: 8px">
      <a-button @click="summaryFixed = !summaryFixed">
        {{ summaryFixed ? '取消固定' : '固定汇总行' }}
      </a-button>
    </div>

    <VTable
      :data="tableData"
      :columns="columns"
      :fixed-header="true"
      :summary-config="{
        enabled: true,
        fixed: summaryFixed,
      }"
      :style="{ height: '500px' }"
    >
      <template #summaryCell="{ columnKey, summaryValue }">
        <div v-if="columnKey === 'id'" style="color: blue">总计</div>
        <div v-else style="color: red">
          {{ summaryValue }}
        </div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  sales: number
  rating: number
}

const summaryFixed = ref(false)

const columns: VTableColumn<Product>[] = [
  {
    columnKey: 'id',
    columnHeader: 'ID',
    columnWidth: 80,
  },
  {
    columnKey: 'name',
    columnHeader: '产品名称',
    columnWidth: 150,
  },
  {
    columnKey: 'category',
    columnHeader: '分类',
    columnWidth: 120,
    columnSummary: 'count',
  },
  {
    columnKey: 'price',
    columnHeader: '单价',
    columnWidth: 100,
    columnAlign: 'right',
    columnCell: ({ row }) => `¥${row.original.price.toFixed(2)}`,
    columnSummary: 'avg',
  },
  {
    columnKey: 'quantity',
    columnHeader: '库存',
    columnWidth: 100,
    columnAlign: 'right',
    columnSummary: 'sum',
  },
  {
    columnKey: 'sales',
    columnHeader: '销量',
    columnWidth: 100,
    columnAlign: 'right',
    columnSummary: 'sum',
  },
  {
    columnKey: 'rating',
    columnHeader: '评分',
    columnWidth: 100,
    columnAlign: 'center',
    columnSummary: 'avg',
  },
  {
    columnKey: 'total',
    columnHeader: '总价值',
    columnWidth: 120,
    columnAlign: 'right',
    columnCell: ({ row }) => `¥${(row.original.price * row.original.quantity).toFixed(2)}`,
    // 自定义汇总计算
    columnSummary: (data) => {
      const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return `¥${total.toFixed(2)}`
    },
  },
]

const tableData = ref<Product[]>(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    category: ['电子产品', '服装', '食品', '图书', '家居'][i % 5] as string,
    price: Math.random() * 1000 + 50,
    quantity: Math.floor(Math.random() * 500) + 10,
    sales: Math.floor(Math.random() * 1000),
    rating: Math.random() * 2 + 3, // 3-5分
  })),
)
</script>
