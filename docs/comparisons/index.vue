<template>
  <div class="performance-comparison">
    <div class="controls">
      <h3>📊 表格性能对比测试</h3>
      <a-space :size="12" wrap>
        <a-button type="primary" @click="((currentCount = 1000), generateData(currentCount))">
          1,000 行
        </a-button>
        <a-button type="primary" @click="((currentCount = 10000), generateData(currentCount))">
          10,000 行
        </a-button>
        <a-button type="primary" @click="((currentCount = 50000), generateData(currentCount))">
          50,000 行
        </a-button>
        <a-button
          danger
          type="primary"
          @click="((currentCount = 100000), generateData(currentCount))"
        >
          ⚠️ 100,000 行
        </a-button>
      </a-space>
      <div class="info">
        当前数据量: <strong>{{ currentCount }}</strong> 行
      </div>
    </div>

    <a-tabs v-model:active-key="activeTab" @change="handleTabChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.key" :tab="tab.label">
        <template #tab>
          <a-space :size="8">
            <span>{{ tab.label }}</span>
            <template v-if="results[tab.key]">
              <a-tag color="success"> ⏱️ {{ results[tab.key].renderTime }}ms </a-tag>
              <a-tag color="processing"> 💾 {{ results[tab.key].memory }}MB </a-tag>
            </template>
            <a-tag v-else color="default"> 未测试 </a-tag>
          </a-space>
        </template>
      </a-tab-pane>
    </a-tabs>

    <div class="table-container">
      <VTableComp
        v-if="activeTab === 'vtable'"
        :data="data"
        @render-complete="handleRenderComplete"
      />
      <AntdVueTableComp
        v-else-if="activeTab === 'antd'"
        :data="data"
        @render-complete="handleRenderComplete"
      />
      <ElementPlusTableComp
        v-else-if="activeTab === 'element'"
        :data="data"
        @render-complete="handleRenderComplete"
      />
      <VxeTableComp
        v-else-if="activeTab === 'vxe'"
        :data="data"
        @render-complete="handleRenderComplete"
      />
      <AntdvNextTableComp
        v-else-if="activeTab === 'antdv-next'"
        :data="data"
        @render-complete="handleRenderComplete"
      />
    </div>

    <div class="results-panel">
      <h4>性能测试结果</h4>
      <table class="results-table">
        <thead>
          <tr>
            <th>表格组件</th>
            <th>渲染耗时</th>
            <th>总内存占用</th>
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
import { nextTick } from 'vue'
import AntdvNextTableComp from './AntdVNextTable.vue'
import AntdVueTableComp from './AntdVueTable.vue'
import ElementPlusTableComp from './ElementPlusTable.vue'
import VTableComp from './VTable.vue'
import VxeTableComp from './VxeTable.vue'

const data = ref<any[]>([])
const activeTab = ref('vtable')

const tabs = [
  { key: 'vtable', label: 'VTable (当前)' },
  { key: 'antd', label: 'Ant Design Vue' },
  { key: 'element', label: 'Element Plus' },
  { key: 'vxe', label: 'VXE Table' },
  { key: 'antdv-next', label: 'Antdv Next' },
]

const results = ref<Record<string, any>>({})
const currentCount = ref(1000)
function generateData(count: number) {
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

  data.value = newData
}

function cleanupBeforeSwitch() {
  // 1. 清空数据引用（最重要）
  data.value = []

  // 2. 清空结果引用（避免 Vue 响应式占用）
  results.value = {}

  // 4. 尝试触发 GC（仅 Chrome + dev）
  if ((window as any).gc) {
    ;(window as any).gc()
    console.log('🧹 manual gc triggered')
  }
}

function handleTabChange(key: string) {
  // 🧹 关键：先清理上一轮状态
  cleanupBeforeSwitch()
  // 等待浏览器回收 + layout reset
  setTimeout(() => {
    activeTab.value = key
    nextTick(() => {
      generateData(currentCount.value)
    })
  }, 200) // 👈 给 GC 留时间
}

function handleRenderComplete(result: { renderTime: number; memory: string }) {
  const { renderTime, memory } = result
  results.value[activeTab.value] = {
    renderTime,
    memory,
    fps: renderTime < 200 ? '55-60' : renderTime < 500 ? '40-50' : '< 40',
    rating: getRating(renderTime, parseFloat(memory)),
  }

  // 调试日志：查看 results 对象
  console.log(
    `%c[${tabs.find((t) => t.key === activeTab.value)?.label}] 渲染: ${renderTime}ms | 总内存: ${memory}MB`,
    'color: #52c41a; font-weight: bold;',
  )
  console.log('%c当前 results 对象:', 'color: #faad14; font-weight: bold;', results.value)
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
  padding: 12px;
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

.info {
  font-size: 14px;
  color: #666;
  margin-top: 12px;
}

.table-container {
  height: 400px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
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
