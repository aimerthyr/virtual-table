<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 16px; display: flex; gap: 10px">
      <a-button @click="switchMode('default')">默认 (100×20)</a-button>
      <a-button @click="switchMode('big')">1000 × 50</a-button>
      <a-button @click="switchMode('huge')">10000 × 100</a-button>
    </div>

    <VTable
      :data="data"
      :columns="columns"
      :bordered="true"
      style="height: 400px; overflow: auto"
    />
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'BasicExample' })

const generateColumns = (total: number): VTableColumn[] => {
  const cols: VTableColumn[] = []
  cols.push(
    { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
    { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  )
  for (let i = 1; i <= total - 2; i++) {
    cols.push({
      columnKey: `col_${i}`,
      columnHeader: `列 ${i}`,
      columnWidth: 120,
    })
  }
  return cols
}

const generateData = (rows: number, cols: number) => {
  const list = Array.from({ length: rows }).map((_, i) => {
    const row: Record<string, any> = {
      id: i,
      name: `用户 ${i}`,
    }

    for (let j = 1; j <= cols - 2; j++) {
      row[`col_${j}`] = `数据 ${i}-${j}`
    }

    return row
  })
  console.log('生成数据条数:', list.length)
  return list
}

const columns = shallowRef<VTableColumn[]>([])
const data = shallowRef<any[]>([])

const switchMode = (mode: 'default' | 'big' | 'huge') => {
  const now = performance.now()
  if (mode === 'default') {
    columns.value = generateColumns(20)
    data.value = generateData(100, 20)
  }

  if (mode === 'big') {
    columns.value = generateColumns(50)
    data.value = generateData(1000, 50)
  }

  if (mode === 'huge') {
    columns.value = generateColumns(100)
    data.value = generateData(10000, 100)
  }

  console.log('耗时(ms):', performance.now() - now)
}

switchMode('default')
</script>
