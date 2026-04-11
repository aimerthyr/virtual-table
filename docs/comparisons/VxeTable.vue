<template>
  <div class="table-wrapper">
    <vxe-grid
      :data="data"
      :virtual-y-config="{
        enabled: true,
        gt: 0,
      }"
      height="400"
      size="small"
      :columns="[
        { field: 'id', title: 'ID', width: 80 },
        { field: 'name', title: '姓名', width: 120 },
        { field: 'age', title: '年龄', width: 100, align: 'center' },
        { field: 'address', title: '地址' },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { nextTick, watch } from 'vue'
import { measureRenderStable } from './utils'

const props = defineProps<{
  data: any[]
}>()

const emit = defineEmits<{
  renderComplete: [result: { renderTime: number; memory: string }]
}>()

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
