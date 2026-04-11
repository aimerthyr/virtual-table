<template>
  <div class="table-wrapper">
    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="false"
      :scroll="{ y: 400 }"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { Table as ATable } from 'ant-design-vue'
import { measureRenderStable } from './utils'

const props = defineProps<{
  data: any[]
}>()

const emit = defineEmits<{
  renderComplete: [result: { renderTime: number; memory: string }]
}>()

const columns: any[] = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100, align: 'center' },
  { title: '地址', dataIndex: 'address', key: 'address' },
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
