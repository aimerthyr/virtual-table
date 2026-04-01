<template>
  <VTable ref="tableRef" :data="data" :columns="columns" row-key="id" :loading="loading">
    <template #bodyCell="{ columnKey, row, isEditingMode }">
      <template v-if="columnKey === 'name'">
        <a-tag
          v-if="isEditingMode == null"
          :color="row.level === 'senior' ? 'gold' : 'blue'"
          @dblclick="beginCellEdit(row, columnKey)"
        >
          {{ row.name }}
        </a-tag>
        <a-input
          v-else
          v-model:value="row.name"
          autofocus
          style="width: 120px"
          @blur="saveEdit(row)"
        />
        <a-button
          v-if="isEditingMode === 'cell'"
          size="small"
          type="link"
          style="padding: 0 !important; margin-left: 8px"
          @mousedown.prevent="cancelEdit(row)"
          >取消</a-button
        >
      </template>
      <template v-else-if="columnKey === 'department'">
        <span v-if="!isEditingMode">{{ row.department }}</span>
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
          v-if="!isEditingMode"
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
        <span v-if="!isEditingMode" class="font-semibold text-green-600">
          ¥{{ row.salary.toLocaleString() }}
        </span>
        <a-input-number v-else v-model:value="row.salary" />
      </template>
      <template v-else-if="columnKey === 'action'">
        <template v-if="!isEditingMode">
          <a-button type="link" size="small" @click="beginRowEdit(row)">编辑</a-button>
        </template>
        <template v-else>
          <a-button type="primary" size="small" @click="saveEdit(row)">保存</a-button>
          <a-button size="small" style="margin-left: 8px" @click="cancelEdit(row)">取消</a-button>
        </template>
      </template>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'EditStateExample' })

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
    columnWidth: 200,
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
    columnWidth: 140,
  },
]

const tableRef = useTemplateRef('tableRef')

// 快照，用于撤回
const snapshot = new Map<number, Record<string, any>>()

const clearTableEditState = () => {
  tableRef.value?.setEditingState(null)
}

/** 整行编辑 */
const beginRowEdit = (row: Record<string, any> & { id: number }) => {
  snapshot.set(row.id, { ...row })
  tableRef.value?.setEditingState(row.id)
}

/** 单元格编辑 */
const beginCellEdit = (row: Record<string, any> & { id: number }, columnKey: string) => {
  snapshot.set(row.id, { ...row })
  tableRef.value?.setEditingState(row.id, columnKey)
}

const cancelEdit = (row: Record<string, any> & { id: number }) => {
  const original = snapshot.get(row.id)
  if (original) {
    Object.assign(row, original)
    snapshot.delete(row.id)
  }
  clearTableEditState()
}

const saveEdit = (row: Record<string, any> & { id: number }) => {
  snapshot.delete(row.id)
  clearTableEditState()
  console.log(data.value, 'data')
}
</script>
