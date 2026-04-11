<template>
  <div class="table-wrapper">
    <el-table :data="data" height="400" size="small">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="age" label="年龄" width="100" align="center" />
      <el-table-column prop="address" label="地址" />
    </el-table>
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
