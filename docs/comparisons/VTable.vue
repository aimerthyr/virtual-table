<template>
  <div class="table-wrapper">
    <VTable
      style="height: 400px"
      :data="data"
      :columns="columns"
      :bordered="false"
      :row-height="46"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import { measureRenderStable } from './utils'

const props = defineProps<{
  data: any[]
}>()

const emit = defineEmits<{
  renderComplete: [result: { renderTime: number; memory: string }]
}>()

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: '地址' },
]

watch(
  () => props.data,
  () => {
    if (!props.data.length) return
    const startTime = performance.now()
    nextTick(() => {
      measureRenderStable(startTime, (result) => {
        emit('renderComplete', result)
      })
    })
  },
  { immediate: true },
)
</script>

<style scoped>
.table-wrapper {
  height: 400px;
}
</style>
