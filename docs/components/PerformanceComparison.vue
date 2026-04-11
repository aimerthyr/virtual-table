<template>
  <div class="performance-comparison">
    <div class="controls">
      <h3>📊 表格性能对比测试</h3>
      <div class="button-group">
        <button @click="generateData(1000)">1,000 行</button>
        <button @click="generateData(10000)">10,000 行</button>
        <button @click="generateData(50000)">50,000 行</button>
        <button class="danger" @click="generateData(100000)">⚠️ 100,000 行</button>
      </div>
      <div class="info">
        当前数据量: <strong>{{ data.length.toLocaleString() }}</strong> 行
      </div>
    </div>

    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
        <span v-if="results[tab.key]" class="result"> {{ results[tab.key].renderTime }}ms </span>
      </button>
    </div>

    <div class="table-container">
      <!-- VTable -->
      <div v-if="activeTab === 'vtable'" class="table-wrapper">
        <VTable class="h-full" :data="data" :columns="columns" :bordered="false" :row-height="48" />
      </div>

      <!-- Ant Design Vue Table -->
      <div v-else-if="activeTab === 'antd'" class="table-wrapper">
        <a-table
          :data-source="data"
          :columns="antdColumns"
          :pagination="false"
          :scroll="{ y: 400 }"
          size="small"
        />
      </div>

      <!-- Element Plus Table -->
      <div v-else-if="activeTab === 'element'" class="table-wrapper">
        <el-table :data="data" height="400" size="small">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="age" label="年龄" width="100" align="center" />
          <el-table-column prop="address" label="地址" />
        </el-table>
      </div>

      <!-- VXE Table -->
      <div v-else-if="activeTab === 'vxe'" class="table-wrapper">
        <vxe-table :data="data" height="400" size="small">
          <vxe-column field="id" title="ID" width="80" />
          <vxe-column field="name" title="姓名" width="120" />
          <vxe-column field="age" title="年龄" width="100" align="center" />
          <vxe-column field="address" title="地址" />
        </vxe-table>
      </div>
    </div>

    <div class="results-panel">
      <h4>性能测试结果</h4>
      <table class="results-table">
        <thead>
          <tr>
            <th>表格组件</th>
            <th>渲染耗时</th>
            <th>内存占用</th>
            <th>FPS</th>
            <th>评级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tab in tabs" :key="tab.key">
            <td>{{ tab.label }}</td>
            <td>{{ results[tab.key]?.renderTime || '-' }}ms</td>
            <td>{{ results[tab.key]?.memory || '-' }} MB</td>
            <td>{{ results[tab.key]?.fps || '-' }}</td>
            <td>
              <span :class="getRatingClass(results[tab.key]?.rating)">
                {{ results[tab.key]?.rating || '-' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import { Table as ATable } from 'ant-design-vue'

const data = ref<any[]>([])
const activeTab = ref('vtable')

const tabs = [
  { key: 'vtable', label: 'VTable (当前)', maxRows: 100000 },
  { key: 'antd', label: 'Ant Design Vue', maxRows: 5000 },
  { key: 'element', label: 'Element Plus', maxRows: 5000 },
  { key: 'vxe', label: 'VXE Table', maxRows: 100000 },
]

const results = ref<Record<string, any>>({})

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: '地址' },
]

const antdColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100, align: 'center' },
  { title: '地址', dataIndex: 'address', key: 'address' },
]

function generateData(count: number) {
  const currentTab = tabs.find((t) => t.key === activeTab.value)
  const maxRows = currentTab?.maxRows || 5000

  // 检查是否超过当前表格的最大行数限制
  if (count > maxRows) {
    console.warn(
      `%c[警告] ${currentTab?.label} 不支持 ${count.toLocaleString()} 行数据，已限制为 ${maxRows.toLocaleString()} 行`,
      'color: #ff4d4f; font-size: 14px; font-weight: bold;',
    )
    count = maxRows
  }

  console.clear()
  console.log(
    `%c========== 生成 ${count.toLocaleString()} 行测试数据 ==========`,
    'color: #1890ff; font-size: 16px; font-weight: bold;',
  )

  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const cities = ['北京市朝阳区', '上海市浦东新区', '广州市天河区', '深圳市南山区']

  const newData = []
  for (let i = 0; i < count; i++) {
    newData.push({
      id: i + 1,
      key: i + 1,
      name: `${names[i % names.length]}_${i}`,
      age: 20 + (i % 50),
      address: cities[i % cities.length],
    })
  }

  // 记录开始时间（数据更新前）
  const memBefore = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
  const startTime = performance.now()

  // 更新数据，触发渲染
  data.value = newData

  // 等待渲染完成并可交互
  waitForRenderComplete(() => {
    const endTime = performance.now()
    const memAfter = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
    const renderTime = Math.round(endTime - startTime)
    const memory = (memAfter - memBefore).toFixed(2)

    results.value[activeTab.value] = {
      renderTime,
      memory,
      fps: renderTime < 200 ? '55-60' : renderTime < 500 ? '40-50' : '< 40',
      rating: getRating(renderTime, parseFloat(memory)),
    }

    console.log(
      `%c[${tabs.find((t) => t.key === activeTab.value)?.label}] 渲染: ${renderTime}ms | 内存: ${memory}MB`,
      'color: #52c41a; font-weight: bold;',
    )
  })
}

function switchTab(key: string) {
  // 清空当前 tab 的测试结果，避免显示旧数据
  if (results.value[key]) {
    results.value[key] = undefined
  }

  activeTab.value = key

  // 如果有数据，重新测试当前表格
  if (data.value.length > 0) {
    const memBefore = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
    const startTime = performance.now()

    waitForRenderComplete(() => {
      const endTime = performance.now()
      const memAfter = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0
      const renderTime = Math.round(endTime - startTime)
      const memory = (memAfter - memBefore).toFixed(2)

      results.value[activeTab.value] = {
        renderTime,
        memory,
        fps: renderTime < 200 ? '55-60' : renderTime < 500 ? '40-50' : '< 40',
        rating: getRating(renderTime, parseFloat(memory)),
      }

      console.log(
        `%c[${tabs.find((t) => t.key === activeTab.value)?.label}] 渲染: ${renderTime}ms | 内存: ${memory}MB`,
        'color: #52c41a; font-weight: bold;',
      )
    })
  }
}

// 等待渲染完全完成（多帧确保可交互）
function waitForRenderComplete(callback: () => void) {
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 再等一个宏任务，确保所有微任务和渲染都完成
          setTimeout(callback, 0)
        })
      })
    })
  })
}

function getRating(renderTime: number, memory: number): string {
  if (renderTime < 200 && memory < 50) return '⭐⭐⭐⭐⭐'
  if (renderTime < 500 && memory < 150) return '⭐⭐⭐⭐'
  if (renderTime < 1000 && memory < 300) return '⭐⭐⭐'
  if (renderTime < 2000) return '⭐⭐'
  return '⭐'
}

function getRatingClass(rating?: string): string {
  if (!rating) return ''
  const count = (rating.match(/⭐/g) || []).length
  if (count >= 4) return 'rating-good'
  if (count >= 3) return 'rating-ok'
  return 'rating-bad'
}

onMounted(() => {
  generateData(1000)
})
</script>

<style scoped>
.performance-comparison {
  width: 100%;
}

.controls {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.controls h3 {
  margin: 0 0 12px 0;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.button-group button {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.button-group button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.button-group button.danger {
  background: #ff4d4f;
  color: white;
  border: none;
}

.info {
  font-size: 14px;
  color: #666;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.tabs button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
}

.tabs button:hover {
  color: #1890ff;
}

.tabs button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.tabs button .result {
  margin-left: 8px;
  padding: 2px 8px;
  background: #52c41a;
  color: white;
  border-radius: 4px;
  font-size: 12px;
}

.table-container {
  height: 400px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
}

.table-wrapper {
  /* height: 100%; */
  height: 500px;
}

.not-installed {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

.results-panel {
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.results-panel h4 {
  margin: 0 0 12px 0;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table th,
.results-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.results-table th {
  background: #fafafa;
  font-weight: 600;
}

.rating-good {
  color: #52c41a;
}

.rating-ok {
  color: #faad14;
}

.rating-bad {
  color: #ff4d4f;
}
</style>
