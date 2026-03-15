<template>
  <div>
    <div class="mb-4 flex flex-col gap-4">
      <div>
        <span class="mr-2">调整模式:</span>
        <a-radio-group v-model:value="resizeMode" @change="handleResizeModeChange">
          <a-radio value="onChange">实时调整 (onChange)</a-radio>
          <a-radio value="onEnd">结束后调整 (onEnd)</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div class="mb-4">
      <a-space>
        <a-button @click="handleResetWidth">重置列宽</a-button>
        <a-button @click="handleShowSizing">查看当前列宽</a-button>
      </a-space>
    </div>

    <VTable
      :key="resizeMode"
      v-model:default-column-sizing="columnSizing"
      :data="data"
      :columns="columns"
      :column-resize-mode="resizeMode"
      @column-sizing-change="handleColumnSizingChange"
    />

    <!-- 列宽信息展示 -->
    <a-modal v-model:open="sizingModalVisible" title="当前列宽信息" :footer="null" width="600px">
      <a-descriptions bordered :column="1">
        <a-descriptions-item
          v-for="(width, key) in columnSizing"
          :key="key"
          :label="getColumnLabel(key)"
        >
          {{ width }}px
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn, type VTableColumnSizingState } from '@aimerthyr/virtual-table'
import { message } from 'ant-design-vue'

defineOptions({ name: 'ColumnResizeExample' })

const resizeMode = ref<'onChange' | 'onEnd'>('onEnd')
const columnSizing = ref<VTableColumnSizingState>({})
const sizingModalVisible = ref(false)

const data = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区某某街道',
    department: '技术部',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138001',
    address: '上海市浦东新区某某路',
    department: '产品部',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13800138002',
    address: '广州市天河区某某大道',
    department: '运营部',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    phone: '13800138003',
    address: '深圳市南山区某某中心',
    department: '市场部',
  },
])

const columns: VTableColumn[] = [
  {
    columnKey: 'id',
    columnHeader: 'ID',
    columnWidth: 80,
    columnEnableResize: true,
    columnMinWidth: 60,
    columnMaxWidth: 150,
  },
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 120,
    columnEnableResize: true,
    columnMinWidth: 80,
    columnMaxWidth: 200,
  },
  {
    columnKey: 'age',
    columnHeader: '年龄',
    columnWidth: 100,
    columnAlign: 'center',
    columnEnableResize: true,
    columnMinWidth: 80,
  },
  {
    columnKey: 'email',
    columnHeader: '邮箱',
    columnWidth: 200,
    columnEnableResize: true,
    columnMinWidth: 150,
    columnMaxWidth: 300,
  },
  {
    columnKey: 'phone',
    columnHeader: '电话',
    columnWidth: 150,
    columnEnableResize: true,
  },
  {
    columnKey: 'address',
    columnHeader: '地址',
    columnWidth: 250,
    columnEnableResize: true,
    columnMinWidth: 150,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnWidth: 120,
    columnEnableResize: true,
  },
]

// 列宽变化回调
const handleColumnSizingChange = (sizing: VTableColumnSizingState) => {
  console.log('列宽已调整:', sizing)
}

// 重置列宽
const handleResetWidth = () => {
  columnSizing.value = {}
  message.success('列宽已重置')
}

// 显示当前列宽
const handleShowSizing = () => {
  if (Object.keys(columnSizing.value).length === 0) {
    message.info('当前使用默认列宽，未进行调整')
    return
  }
  sizingModalVisible.value = true
}

// 获取列名称
const getColumnLabel = (key: string) => {
  const column = columns.find((col) => col.columnKey === key)
  return column?.columnHeader || key
}

// 切换调整模式
const handleResizeModeChange = () => {
  const modeName = resizeMode.value === 'onChange' ? '实时调整' : '结束后调整'
  message.success(`已切换到 ${modeName} 模式，请尝试拖拽列宽观察区别`)
}
</script>
