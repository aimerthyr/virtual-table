<template>
  <VTable ref="tableRef" :data="data" :columns="columns" row-key="id" :loading="loading">
    <template #bodyCell="{ columnKey, row, isEditing }">
      <template v-if="columnKey === 'name'">
        <a-tag v-if="!isEditing" :color="row.level === 'senior' ? 'gold' : 'blue'">
          {{ row.name }}
        </a-tag>
        <a-input v-else v-model:value="row.name" />
      </template>
      <template v-else-if="columnKey === 'department'">
        <span v-if="!isEditing">{{ row.department }}</span>
        <a-select
          v-else
          v-model:value="row.department"
          :options="[
            { label: '技术部', value: '技术部' },
            { label: '产品部', value: '产品部' },
            { label: '运营部', value: '运营部' },
          ]"
        />
      </template>
      <template v-else-if="columnKey === 'status'">
        <a-badge
          v-if="!isEditing"
          :status="row.status === 'active' ? 'success' : 'error'"
          :text="row.status === 'active' ? '在职' : '离职'"
        />
        <a-select
          v-else
          v-model:value="row.status"
          :options="[
            { label: '在职', value: 'active' },
            { label: '离职', value: 'inactive' },
          ]"
        />
      </template>
      <template v-else-if="columnKey === 'salary'">
        <span v-if="!isEditing" class="font-semibold text-green-600">
          ¥{{ row.salary.toLocaleString() }}
        </span>
        <a-input-number v-else v-model:value="row.salary" />
      </template>
      <template v-else-if="columnKey === 'action'">
        <template v-if="!isEditing">
          <a-button type="link" size="small" @click="handleEdit(row)">编辑</a-button>
        </template>
        <template v-else>
          <a-button type="primary" size="small" @click="handleSave">保存</a-button>
          <a-button size="small" style="margin-left: 8px" @click="handleCancel(row)">取消</a-button>
        </template>
      </template>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'EditRowExample' })

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

const tableRef = useTemplateRef('tableRef')

// 快照，用于撤回
const snapshot = new Map<number, Record<string, any>>()

const handleEdit = (row: any) => {
  // 进入编辑前，记录快照
  snapshot.set(row.id, { ...row })
  tableRef.value?.setEditingRow(row.id)
}

const handleSave = () => {
  tableRef.value?.setEditingRow(null)
  console.log(data.value, 'data')
}

const handleCancel = (row: any) => {
  const original = snapshot.get(row.id)
  if (original) {
    // 恢复
    Object.assign(row, original)
    snapshot.delete(row.id)
  }
  tableRef.value?.setEditingRow(null)
  console.log(data.value, 'data')
}
</script>
