<template>
  <div style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px">
    <a-button @click="handleLoading">触发 loading</a-button>
    <a-button @click="handleEmpty">触发空状态</a-button>
    <a-button @click="data = dataList">重置</a-button>
  </div>
  <VTable
    :data="data"
    :columns="columns"
    :bordered="true"
    row-key="id"
    :loading="loading"
    :row-selection-config="{
      enabled: true,
    }"
    :default-checkbox-column-width="100"
    :adaptive-column-width="180"
  >
    <!-- 自定义表头单元格 -->
    <template #headerCell="{ column }">
      <span v-if="column.columnKey === 'name'" class="flex items-center gap-2">
        <UserOutlined />
        <span>{{ column.columnHeader }}</span>
      </span>
    </template>

    <!-- 自定义数据单元格 -->
    <template #bodyCell="{ columnKey, row }">
      <template v-if="columnKey === 'name'">
        <a-tag :color="row.level === 'senior' ? 'gold' : 'blue'">
          {{ row.name }}
        </a-tag>
      </template>
      <template v-else-if="columnKey === 'status'">
        <a-badge
          :status="row.status === 'active' ? 'success' : 'error'"
          :text="row.status === 'active' ? '在职' : '离职'"
        />
      </template>
      <template v-else-if="columnKey === 'salary'">
        <span class="font-semibold text-green-600"> ¥{{ row.salary.toLocaleString() }} </span>
      </template>
      <template v-else-if="columnKey === 'action'">
        <a-space>
          <a-button type="link" size="small" @click="handleEdit(row)">
            <EditOutlined />
            编辑
          </a-button>
          <a-button type="link" size="small" danger @click="handleDelete(row)">
            <DeleteOutlined />
            删除
          </a-button>
        </a-space>
      </template>
    </template>

    <!-- 自定义复选框 -->
    <template #customCheckbox="{ checked, indeterminate, disabled, onCheckedChange }">
      <a-checkbox
        :checked="checked"
        :indeterminate="indeterminate"
        :disabled="disabled"
        @change="onCheckedChange"
      >
        <span v-if="!checked && !indeterminate" class="text-xs text-gray-400">选择</span>
      </a-checkbox>
    </template>

    <!-- 自定义筛选图标 -->
    <template #customFilterIcon="{ filtered }">
      <FilterOutlined :style="{ color: filtered ? '#1890ff' : undefined }" />
    </template>

    <!-- 自定义筛选下拉 -->
    <template #customFilterDropdown="{ confirm, reset, setFilterValue, filterModelValue }">
      <div class="w-[250px] p-3">
        <h3 class="mb-[8px]">我可以自定义筛选下拉</h3>
        <a-input
          :value="filterModelValue"
          placeholder="输入姓名搜索"
          class="mb-2"
          @input="(e: any) => setFilterValue(e.target.value)"
          @press-enter="confirm"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <div class="flex justify-end gap-2">
          <a-button size="small" @click="reset">重置</a-button>
          <a-button type="primary" size="small" @click="confirm">确定</a-button>
        </div>
      </div>
    </template>

    <!-- 自定义加载图标 -->
    <template #customLoadingIcon>
      <LoadingOutlined style="font-size: 24px" spin />
    </template>

    <!-- 自定义空状态 -->
    <template #customEmpty>
      <div class="py-12 text-center">
        <InboxOutlined style="font-size: 48px; color: #d9d9d9" />
        <p class="mt-4 text-gray-500">暂无数据</p>
        <a-button type="primary" class="mt-2" @click="handleAddData">
          <PlusOutlined />
          添加数据
        </a-button>
      </div>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import {
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

defineOptions({ name: 'CustomSlotExample' })

const loading = ref(false)
const dataList = [
  {
    id: 1,
    name: '张三',
    level: 'senior',
    status: 'active',
    salary: 25000,
    department: '技术部',
  },
  {
    id: 2,
    name: '李四',
    level: 'junior',
    status: 'active',
    salary: 15000,
    department: '产品部',
  },
  {
    id: 3,
    name: '王五',
    level: 'senior',
    status: 'inactive',
    salary: 28000,
    department: '技术部',
  },
  {
    id: 4,
    name: '赵六',
    level: 'junior',
    status: 'active',
    salary: 18000,
    department: '运营部',
  },
]

const data = ref(dataList)

const columns: VTableColumn[] = [
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 150,
    columnEnableFilter: true,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnWidth: 120,
  },
  {
    columnKey: 'salary',
    columnHeader: '薪资',
    columnWidth: 150,
    columnAlign: 'right',
  },
  {
    columnKey: 'status',
    columnHeader: '状态',
    columnWidth: 120,
    columnAlign: 'center',
  },
  {
    columnKey: 'action',
    columnHeader: '操作',
    columnAlign: 'center',
  },
]

const handleEdit = (row: any) => {
  message.info(`编辑: ${row.name}`)
}

const handleDelete = (row: any) => {
  message.warning(`删除: ${row.name}`)
}

const handleAddData = () => {
  data.value.push({
    id: data.value.length + 1,
    name: `新员工${data.value.length + 1}`,
    level: 'junior',
    status: 'active',
    salary: 12000,
    department: '技术部',
  })
  message.success('添加成功')
}

const handleLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

const handleEmpty = () => {
  data.value = []
}
</script>
