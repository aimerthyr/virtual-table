---
title: Examples
---

# VTable Examples

Display the various usage scenarios and functional features of the VTable component, each example can run and copy independently.

<script setup>
import BasicExample from '../../components/BasicExample.vue'
import CellMergeExample from '../../components/CellMergeExample.vue'
import ColumnResizeExample from '../../components/ColumnResizeExample.vue'
import CustomSlotExample from '../../components/CustomSlotExample.vue'
import CustomTheme from '../../components/CustomTheme.vue'
import ExpandableExample from '../../components/ExpandableExample.vue'
import FixedColumnsExample from '../../components/FixedColumnsExample.vue'
import FixedHeaderExample from '../../components/FixedHeaderExample.vue'
import PaginationExample from '../../components/PaginationExample.vue'
import RowSelectionExample from '../../components/RowSelectionExample.vue'
import SortFilterExample from '../../components/SortFilterExample.vue'
import SummaryExample from '../../components/SummaryExample.vue'
import ContextMenuExample from '../../components/ContextMenuExample.vue'

import TreeDataExample from '../../components/TreeDataExample.vue'
import EditStateExample from '../../components/EditStateExample.vue'
</script>

### Basic Usage

The simplest table usage, showing basic data rendering.

::: raw
<BasicExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-i4218nn4?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable :data="data" :columns="columns" :bordered="false" />
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'BasicExample' })

const data = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区' },
  { id: 4, name: '赵六', age: 35, address: '深圳市南山区' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: '地址' },
]
</script>
```

</details>

### Fixed Header/Body

Fixed header, content area can scroll, suitable for large data volume scenarios.

::: raw
<FixedHeaderExample  />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-a4j48cku?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div style="height: 400px">
    <VTable
      style="height: 100%"
      :data="data"
      :columns="columns"
      :fixed-header="true"
      :row-height="48"
      :bordered="true"
      :fixed-footer="true"
    >
      <template #customFooter>
        <div style="width: 100%; background-color: #fafafa; padding: 12px">我是表尾可以自定义</div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'FixedHeaderExample' })

// 生成 100 条数据
const data = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    department: ['技术部', '产品部', '运营部'][i % 3],
  })),
)

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'email', columnHeader: '邮箱', columnWidth: 200 },
  { columnKey: 'department', columnHeader: '部门' },
]
</script>
```

</details>

### Editable

Supports editable rows and editable cells features (double-click the name tag to enter cell editing)
::: raw
<EditStateExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-xxrjq8pp?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
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
```

</details>

### Right-click menu

Supports custom right-click menus (insert rows, columns, etc.).

::: raw
<ContextMenuExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-tzxe1jsr?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable
    :data="tableData"
    :columns="columns"
    style="max-height: 400px"
    :row-key="(row) => row.id"
    :context-menu-config="{ enableHeaderMenu: true, enableCellMenu: true }"
    :bordered="false"
    :enable-row-hover="true"
  >
    <template #customContextMenu="{ context, close }">
      <!-- 表头右键菜单 -->
      <div v-if="context.type === 'header'" class="context-menu">
        <div class="context-menu-item" @click="handleSortAsc(context, close)">升序排序</div>
        <div class="context-menu-item" @click="handleSortDesc(context, close)">降序排序</div>
        <div class="context-menu-divider" />
        <div class="context-menu-item" @click="handleHideColumn(context, close)">隐藏列</div>
        <div class="context-menu-item" @click="handleInsertColumnLeft(context, close)">
          在左侧插入列
        </div>
        <div class="context-menu-item" @click="handleInsertColumnRight(context, close)">
          在右侧插入列
        </div>
        <div class="context-menu-item" @click="handleDeleteColumn(context, close)">删除当前列</div>
      </div>

      <!-- 单元格右键菜单 -->
      <div v-else-if="context.type === 'cell'" class="context-menu">
        <div class="context-menu-item" @click="handleInsertRowAbove(context, close)">
          在上方插入行
        </div>
        <div class="context-menu-item" @click="handleInsertRowBelow(context, close)">
          在下方插入行
        </div>
        <div class="context-menu-item" @click="handleDeleteRow(context, close)">删除当前行</div>
        <div class="context-menu-divider" />
        <div class="context-menu-item" @click="handleCopyCell(context, close)">复制单元格</div>
        <div class="context-menu-item" @click="handleCopyRow(context, close)">复制整行</div>
        <div class="context-menu-divider" />
        <div class="context-menu-item" @click="handleDuplicateRow(context, close)">复制当前行</div>
        <div
          v-if="context.row?.status === 'active'"
          class="context-menu-item"
          @click="handleSetInactive(context, close)"
        >
          设为离职
        </div>
        <div v-else class="context-menu-item" @click="handleSetActive(context, close)">
          设为在职
        </div>
        <template v-if="context.column.columnKey === 'salary'">
          <div class="context-menu-divider" />
          <div class="context-menu-item" @click="handleIncreaseSalary(context, close)">
            涨薪 10%
          </div>
          <div class="context-menu-item" @click="handleDecreaseSalary(context, close)">
            降薪 10%
          </div>
        </template>
      </div>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'ContextMenuExample' })

// 数据类型定义
interface Employee {
  id: number
  name: string
  department: string
  position: string
  salary: number
  email: string
  status: 'active' | 'inactive'
}

// 表格数据
const tableData = ref<Employee[]>([
  {
    id: 1,
    name: '张三',
    department: '技术部',
    position: '前端工程师',
    salary: 15000,
    email: 'zhangsan@company.com',
    status: 'active',
  },
  {
    id: 2,
    name: '李四',
    department: '产品部',
    position: '产品经理',
    salary: 18000,
    email: 'lisi@company.com',
    status: 'active',
  },
  {
    id: 3,
    name: '王五',
    department: '技术部',
    position: '后端工程师',
    salary: 16000,
    email: 'wangwu@company.com',
    status: 'active',
  },
  {
    id: 4,
    name: '赵六',
    department: '设计部',
    position: 'UI 设计师',
    salary: 14000,
    email: 'zhaoliu@company.com',
    status: 'inactive',
  },
  {
    id: 5,
    name: '钱七',
    department: '市场部',
    position: '市场专员',
    salary: 12000,
    email: 'qianqi@company.com',
    status: 'active',
  },
])

// 列配置
const columns = ref<VTableColumn[]>([
  {
    columnKey: 'id',
    columnHeader: 'ID',
    columnWidth: 80,
    columnAlign: 'center',
  },
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 120,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnWidth: 120,
  },
  {
    columnKey: 'position',
    columnHeader: '职位',
    columnWidth: 150,
  },
  {
    columnKey: 'salary',
    columnHeader: '薪资',
    columnWidth: 120,
    columnAlign: 'right',
    columnCell: (props) => {
      const value = props.getValue()
      return h('span', { style: { color: '#1890ff', fontWeight: 600 } }, `¥${value}`)
    },
  },
  {
    columnKey: 'email',
    columnHeader: '邮箱',
    columnWidth: 200,
  },
  {
    columnKey: 'status',
    columnHeader: '状态',
    columnWidth: 100,
    columnAlign: 'center',
    columnCell: (props) => {
      const value = props.getValue()
      const isActive = value === 'active'
      return h(
        'span',
        {
          style: {
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            backgroundColor: isActive ? '#f6ffed' : '#fff1f0',
            color: isActive ? '#52c41a' : '#ff4d4f',
            border: `1px solid ${isActive ? '#b7eb8f' : '#ffccc7'}`,
          },
        },
        isActive ? '在职' : '离职',
      )
    },
  },
])

// 生成新 ID
let nextId = 6
const generateId = () => nextId++

// 右键菜单操作
const handleSortAsc = (context: any, close: () => void) => {
  console.log('升序排序:', context.column.columnKey)
  alert(`对 "${context.column.columnKey}" 列进行升序排序`)
  close()
}

const handleSortDesc = (context: any, close: () => void) => {
  console.log('降序排序:', context.column.columnKey)
  alert(`对 "${context.column.columnKey}" 列进行降序排序`)
  close()
}

const handleHideColumn = (context: any, close: () => void) => {
  console.log('隐藏列:', context.column.columnKey)
  alert(`隐藏 "${context.column.columnKey}" 列`)
  close()
}

const handleInsertColumnLeft = (context: any, close: () => void) => {
  const newColumnKey = `new_column_${Date.now()}`
  const newColumn: VTableColumn = {
    columnKey: newColumnKey,
    columnHeader: '新列',
    columnWidth: 120,
  }
  columns.value.splice(context.columnIndex, 0, newColumn)
  // 为所有行添加新列的默认值
  tableData.value.forEach((row: any) => {
    row[newColumnKey] = '-'
  })
  close()
}

const handleInsertColumnRight = (context: any, close: () => void) => {
  const newColumnKey = `new_column_${Date.now()}`
  const newColumn: VTableColumn = {
    columnKey: newColumnKey,
    columnHeader: '新列',
    columnWidth: 120,
  }
  columns.value.splice(context.columnIndex + 1, 0, newColumn)
  // 为所有行添加新列的默认值
  tableData.value.forEach((row: any) => {
    row[newColumnKey] = '-'
  })
  close()
}

const handleDeleteColumn = (context: any, close: () => void) => {
  if (columns.value.length <= 1) {
    alert('至少需要保留一列！')
    close()
    return
  }
  if (confirm(`确定要删除 "${context.column.columnKey}" 列吗？`)) {
    columns.value.splice(context.columnIndex, 1)
    // 从所有行中删除该列数据
    tableData.value.forEach((row: any) => {
      delete row[context.column.columnKey]
    })
  }
  close()
}

const handleInsertRowAbove = (context: any, close: () => void) => {
  const newRow: Employee = {
    id: generateId(),
    name: '新员工',
    department: '未分配',
    position: '待定',
    salary: 10000,
    email: `employee${nextId}@company.com`,
    status: 'active',
  }
  tableData.value.splice(context.rowIndex, 0, newRow)
  close()
}

const handleInsertRowBelow = (context: any, close: () => void) => {
  const newRow: Employee = {
    id: generateId(),
    name: '新员工',
    department: '未分配',
    position: '待定',
    salary: 10000,
    email: `employee${nextId}@company.com`,
    status: 'active',
  }
  tableData.value.splice(context.rowIndex + 1, 0, newRow)
  close()
}

const handleDeleteRow = (context: any, close: () => void) => {
  if (confirm(`确定要删除员工 "${context.row.name}" 的记录吗？`)) {
    tableData.value.splice(context.rowIndex, 1)
  }
  close()
}

const handleCopyCell = (context: any, close: () => void) => {
  const value = String(context.cellValue || '')
  navigator.clipboard.writeText(value).then(() => {
    alert(`已复制: ${value}`)
  })
  close()
}

const handleCopyRow = (context: any, close: () => void) => {
  const rowText = JSON.stringify(context.row, null, 2)
  navigator.clipboard.writeText(rowText).then(() => {
    alert('已复制整行数据到剪贴板')
  })
  close()
}

const handleDuplicateRow = (context: any, close: () => void) => {
  const newRow: Employee = {
    ...context.row,
    id: generateId(),
    name: `${context.row.name} (副本)`,
  }
  tableData.value.splice(context.rowIndex + 1, 0, newRow)
  close()
}

const handleSetInactive = (context: any, close: () => void) => {
  context.row.status = 'inactive'
  close()
}

const handleSetActive = (context: any, close: () => void) => {
  context.row.status = 'active'
  close()
}

const handleIncreaseSalary = (context: any, close: () => void) => {
  context.row.salary = Math.round(context.row.salary * 1.1)
  close()
}

const handleDecreaseSalary = (context: any, close: () => void) => {
  context.row.salary = Math.round(context.row.salary * 0.9)
  close()
}
</script>

<style scoped>
/* 右键菜单样式 */
.context-menu {
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 160px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  transition: background-color 0.2s;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}
</style>
```

</details>

### Row Selection

Supports multi-selection, single selection, disabled selection, etc.

::: raw
<RowSelectionExample  />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-dzb3ipw2?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-tag color="blue">已选择: {{ selectedRows.length }} 条</a-tag>
    </div>
    <VTable
      :data="data"
      :columns="columns"
      row-key="id"
      :row-selection-config="{
        enabled: true,
        getRowCheckDisabled: (row) => row.disabled ?? false,
        onChange: handleSelectionChange,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'RowSelectionExample' })

interface DataRow {
  id: number
  name: string
  age: number
  status: string
  disabled?: boolean
}

const selectedRows = ref<DataRow[]>([])

const data = ref<DataRow[]>([
  { id: 1, name: '张三', age: 28, status: '正常' },
  { id: 2, name: '李四', age: 32, status: '正常' },
  { id: 3, name: '王五', age: 25, status: '已禁用', disabled: true },
  { id: 4, name: '赵六', age: 35, status: '正常' },
  { id: 5, name: '钱七', age: 29, status: '已禁用', disabled: true },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'status', columnHeader: '状态' },
]

const handleSelectionChange = (rows: DataRow[]) => {
  selectedRows.value = rows
}
</script>
```

</details>

### Sort and Filter

Supports column sorting state and custom filtering interaction, usually combined with `table-change` for external data handling.

::: raw
<SortFilterExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-y9pux5uy?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable
    v-model:default-sort="sortState"
    v-model:default-filter="filterState"
    :data="data"
    :columns="columns"
    @table-change="handleTableChange"
  >
    <template #customFilterDropdown="{ confirm, reset, setFilterValue, filterModelValue }">
      <div style="padding: 8px">
        <a-input
          :value="filterModelValue"
          placeholder="输入关键词"
          style="width: 200px; margin-bottom: 8px"
          @input="(e: any) => setFilterValue(e.target.value)"
          @press-enter="confirm"
        />
        <div style="display: flex; gap: 8px">
          <a-button type="primary" size="small" @click="confirm">确定</a-button>
          <a-button size="small" @click="reset">重置</a-button>
        </div>
      </div>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, {
  type VTableChangeState,
  type VTableColumn,
  type VTableColumnFiltersState,
  type VTableSortingState,
} from '@aimerthyr/virtual-table'
import { message } from 'ant-design-vue'

defineOptions({ name: 'SortFilterExample' })

const sortState = ref<VTableSortingState>([])
const filterState = ref<VTableColumnFiltersState>([])

const data = ref([
  { id: 1, name: '张三', age: 28, department: '技术部' },
  { id: 2, name: '李四', age: 32, department: '产品部' },
  { id: 3, name: '王五', age: 25, department: '技术部' },
  { id: 4, name: '赵六', age: 35, department: '运营部' },
  { id: 5, name: '钱七', age: 29, department: '产品部' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 120,
    columnEnableFilter: true,
  },
  {
    columnKey: 'age',
    columnHeader: '年龄',
    columnWidth: 100,
    columnAlign: 'center',
    columnEnableSort: true,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnEnableFilter: true,
  },
]

const handleTableChange = (changeState: VTableChangeState) => {
  // 拿到对应筛选的值，然后触发后端筛选
  console.log('changeState', changeState)
  message.info('请求后端数据，手动实现')
}
</script>
```

</details>

### Pagination

Supports pagination functionality, can set the position, mode of the pagination component.

::: raw
<PaginationExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-29wpw8fn?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div>
    <div
      style="
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div>
        <a-tag color="blue">总数据: {{ totalCount }} 条</a-tag>
        <a-tag color="green">当前页: {{ pagination.pageIndex }}</a-tag>
      </div>
      <a-radio-group v-model:value="paginationPlacement" button-style="solid">
        <a-radio-button value="left">左对齐</a-radio-button>
        <a-radio-button value="center">居中</a-radio-button>
        <a-radio-button value="right">右对齐</a-radio-button>
      </a-radio-group>
    </div>

    <VTable
      v-model:default-pagination="pagination"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :pagination-config="{
        enabled: true,
        placement: paginationPlacement,
        total: totalCount,
      }"
      @table-change="handleTableChange"
    />
  </div>
</template>

<script setup lang="ts">
import VTable, {
  type VTableChangeState,
  type VTableColumn,
  type VTablePaginationState,
} from '@aimerthyr/virtual-table'

defineOptions({ name: 'PaginationExample' })

const loading = ref(false)
const totalCount = ref(200)
const paginationPlacement = ref<'left' | 'center' | 'right'>('right')

const pagination = ref<VTablePaginationState>({
  pageIndex: 1,
  pageSize: 10,
})

const tableData = ref<any[]>([])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'email', columnHeader: '邮箱', columnWidth: 200 },
  { columnKey: 'department', columnHeader: '部门', columnWidth: 120 },
  { columnKey: 'position', columnHeader: '职位' },
]

// 模拟后端分页数据
const fetchData = async (page: number, pageSize: number) => {
  loading.value = true

  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  const start = (page - 1) * pageSize
  const data = Array.from({ length: pageSize }, (_, i) => {
    const id = start + i + 1
    return {
      id,
      name: `员工${id}`,
      age: 20 + (id % 30),
      email: `user${id}@example.com`,
      department: ['技术部', '产品部', '运营部', '市场部'][id % 4],
      position: ['工程师', '经理', '专员', '主管'][id % 4],
    }
  })

  tableData.value = data
  loading.value = false
}

// 表格状态变化处理
const handleTableChange = (state: VTableChangeState) => {
  fetchData(state.pagination.pageIndex, state.pagination.pageSize)
}

// 初始化加载
onMounted(() => {
  fetchData(pagination.value.pageIndex, pagination.value.pageSize)
})
</script>
```

</details>

### Tree Data

Supports tree data display.

::: raw
<TreeDataExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-qpgmdtjv?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable
    :data="data"
    :columns="columns"
    :bordered="true"
    row-key="id"
    :tree-config="{
      enabled: true,
      childrenKey: 'children',
    }"
    @expand="handleExpand"
  />
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'TreeDataExample' })

const data = ref([
  {
    id: 1,
    name: '技术部',
    count: 15,
    children: [
      { id: 11, name: '前端组', count: 8 },
      { id: 12, name: '后端组', count: 7 },
    ],
  },
  {
    id: 2,
    name: '产品部',
    count: 10,
    children: [
      { id: 21, name: '产品组', count: 6 },
      { id: 22, name: '设计组', count: 4 },
    ],
  },
  {
    id: 3,
    name: '运营部',
    count: 8,
    children: [],
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'name', columnHeader: '部门名称', columnWidth: 200 },
  { columnKey: 'count', columnHeader: '人数', columnAlign: 'center' },
]

const handleExpand = (expanded: boolean, row: any) => {
  if (row.id === 3 && expanded) {
    row.children = [
      { id: 211, name: '运营组1', count: 6 },
      { id: 212, name: '运营组2', count: 4 },
    ]
  }
}
</script>
```

</details>

### Expandable Row

Supports expandable row functionality, can set the collapsed state of the expanded row.

::: raw
<ExpandableExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-45kvolhg?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable :data="data" :columns="columns" row-key="id" :enable-expand-row="true">
    <template #expandedRowRender="{ row }">
      <div style="background-color: #f0f0f0; padding: 16px">
        <p><strong>详细信息：</strong></p>
        <p>邮箱：{{ row.email }}</p>
        <p>电话：{{ row.phone }}</p>
        <p>地址：{{ row.address }}</p>
      </div>
    </template>
  </VTable>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'ExpandableExample' })

const data = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138001',
    address: '上海市浦东新区',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13800138002',
    address: '广州市天河区',
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnAlign: 'center' },
]
</script>
```

</details>

### Fixed Columns

Supports fixed column functionality, can set the position, mode of the fixed column.

::: raw
<FixedColumnsExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-modavt47?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div>
    <div style="margin-bottom: 16px">
      <a-button @click="handleFixColumns">固定左右列</a-button>
      <a-button style="margin-left: 8px" @click="handleClearFixed">取消固定</a-button>
    </div>
    <VTable
      v-model:default-column-pinning="columnPinning"
      :data="data"
      :columns="columns"
      row-key="id"
    />
  </div>
</template>

<script setup lang="ts">
import VTable, { type VTableColumn, type VTableColumnPinningState } from '@aimerthyr/virtual-table'

defineOptions({ name: 'FixedColumnsExample' })

const columnPinning = ref<VTableColumnPinningState>({})

const data = ref([
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    address: '北京市朝阳区',
    status: '正常',
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138001',
    address: '上海市浦东新区',
    status: '正常',
  },
  {
    id: 3,
    name: '王五',
    age: 25,
    email: 'wangwu@example.com',
    phone: '13800138002',
    address: '广州市天河区',
    status: '正常',
  },
  {
    id: 4,
    name: '赵六',
    age: 35,
    email: 'zhaoliu@example.com',
    phone: '13800138003',
    address: '深圳市南山区',
    status: '正常',
  },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: '30%' },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: '20%', columnAlign: 'center' },
  { columnKey: 'email', columnHeader: '邮箱', columnWidth: 200 },
  { columnKey: 'phone', columnHeader: '电话', columnWidth: 150 },
  { columnKey: 'address', columnHeader: '地址', columnWidth: 200 },
  { columnKey: 'status', columnHeader: '状态', columnWidth: 100 },
]

const handleFixColumns = () => {
  columnPinning.value = {
    left: ['name'],
    right: ['status'],
  }
}

const handleClearFixed = () => {
  columnPinning.value = {}
}
</script>
```

</details>

### Column Resize

Supports column resize functionality, can set the resize mode of the column.

::: raw
<ColumnResizeExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-ucurmqms?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div>
    <div style="margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px">
      <div>
        <span style="margin-right: 8px">调整模式:</span>
        <a-radio-group v-model:value="resizeMode" @change="handleResizeModeChange">
          <a-radio value="onChange">实时调整 (onChange)</a-radio>
          <a-radio value="onEnd">结束后调整 (onEnd)</a-radio>
        </a-radio-group>
      </div>
    </div>

    <div style="margin-bottom: 16px">
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
```

</details>

### Cell Merge

Supports cell merge functionality, can set the merge mode of the cell.

::: raw
<CellMergeExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-otwnasiw?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <VTable :data="data" :columns="columns" :custom-cell-attributes="customCellHandler" />
</template>

<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

defineOptions({ name: 'CellMergeExample' })

const data = ref([
  { id: 1, name: '张三', department: '技术部', position: '前端工程师' },
  { id: 2, name: '李四', department: '技术部', position: '后端工程师' },
  { id: 3, name: '王五', department: '技术部', position: '测试工程师' },
  { id: 4, name: '赵六', department: '产品部', position: '产品经理' },
  { id: 5, name: '钱七', department: '产品部', position: 'UI设计师' },
  { id: 6, name: '孙八', department: '运营部', position: '运营专员' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'department', columnHeader: '部门', columnWidth: 150 },
  { columnKey: 'position', columnHeader: '职位' },
]

/**
 * 单元格合并处理
 * 相同部门的行，部门列进行纵向合并
 */
const customCellHandler = (row: any, column: VTableColumn | undefined, rowIndex: number) => {
  if (!column || column.columnKey !== 'department') {
    return null
  }

  // 查找当前行之前有多少个相同部门的连续行
  let prevSameCount = 0
  for (let i = rowIndex - 1; i >= 0; i--) {
    if (data.value[i]?.department === row.department) {
      prevSameCount++
    } else {
      break
    }
  }

  // 如果前面有相同部门，当前单元格不渲染
  if (prevSameCount > 0) {
    return { rowspan: 0 }
  }

  // 查找当前行之后有多少个相同部门的连续行
  let nextSameCount = 0
  for (let i = rowIndex + 1; i < data.value.length; i++) {
    if (data.value[i]?.department === row.department) {
      nextSameCount++
    } else {
      break
    }
  }

  // 返回合并的行数
  return {
    rowspan: 1 + nextSameCount,
    style: {
      background: '#fafafa',
      fontWeight: 'bold',
    },
  }
}
</script>
```

</details>

### Summary

Supports summary row functionality, which allows for statistical calculations on data (such as sum, average, count, maximum, minimum, etc.).

::: raw
<SummaryExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-pf8nrvc6?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div>
    <div style="display: flex; margin-bottom: 8px">
      <a-button @click="summaryFixed = !summaryFixed">
        {{ summaryFixed ? '取消固定' : '固定汇总行' }}
      </a-button>
    </div>

    <VTable
      :data="tableData"
      :columns="columns"
      :fixed-header="true"
      :summary-config="{
        enabled: true,
        fixed: summaryFixed,
      }"
      :style="{ height: '500px' }"
    >
      <template #summaryCell="{ columnKey, summaryValue }">
        <div v-if="columnKey === 'id'" style="color: blue">总计</div>
        <div v-else style="color: red">
          {{ summaryValue }}
        </div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  sales: number
  rating: number
}

const summaryFixed = ref(false)

const columns: VTableColumn<Product>[] = [
  {
    columnKey: 'id',
    columnHeader: 'ID',
    columnWidth: 80,
  },
  {
    columnKey: 'name',
    columnHeader: '产品名称',
    columnWidth: 150,
    columnSummary: 'count',
  },
  {
    columnKey: 'category',
    columnHeader: '分类',
    columnWidth: 120,
    columnSummary: 'count',
  },
  {
    columnKey: 'price',
    columnHeader: '单价',
    columnWidth: 100,
    columnAlign: 'right',
    columnCell: ({ row }) => `¥${row.original.price.toFixed(2)}`,
    columnSummary: 'avg',
  },
  {
    columnKey: 'quantity',
    columnHeader: '库存',
    columnWidth: 100,
    columnAlign: 'right',
    columnSummary: 'sum',
  },
  {
    columnKey: 'sales',
    columnHeader: '销量',
    columnWidth: 100,
    columnAlign: 'right',
    columnSummary: 'sum',
  },
  {
    columnKey: 'rating',
    columnHeader: '评分',
    columnWidth: 100,
    columnAlign: 'center',
    columnSummary: 'avg',
  },
  {
    columnKey: 'total',
    columnHeader: '总价值',
    columnWidth: 120,
    columnAlign: 'right',
    columnCell: ({ row }) => `¥${(row.original.price * row.original.quantity).toFixed(2)}`,
    // 自定义汇总计算
    columnSummary: (data) => {
      const total = data.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return `¥${total.toFixed(2)}`
    },
  },
]

const tableData = ref<Product[]>(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `产品 ${i + 1}`,
    category: ['电子产品', '服装', '食品', '图书', '家居'][i % 5] as string,
    price: Math.random() * 1000 + 50,
    quantity: Math.floor(Math.random() * 500) + 10,
    sales: Math.floor(Math.random() * 1000),
    rating: Math.random() * 2 + 3, // 3-5分
  })),
)
</script>
```

</details>

### Custom Slot

Supports custom slot functionality, can set the rendering mode of the custom slot.

::: raw
<CustomSlotExample />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-tjaac8wh?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
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
```

</details>

### Custom Theme

Supports custom theme functionality, can set the style of the theme.

::: raw
<CustomTheme />
:::

<details>
<summary>View code <a href="https://stackblitz.com/edit/vitejs-vite-dwofdryk?file=src%2FApp.vue" target="_blank">Online link</a></summary>

```vue
<template>
  <div class="custom-theme-example">
    <div class="theme-selector">
      <a-radio-group v-model:value="currentTheme" button-style="solid">
        <a-radio-button value="default">默认主题</a-radio-button>
        <a-radio-button value="dark">暗黑主题</a-radio-button>
        <a-radio-button value="blue">蓝色主题</a-radio-button>
        <a-radio-button value="green">绿色主题</a-radio-button>
      </a-radio-group>
    </div>

    <VTable
      :key="currentTheme"
      v-model:default-pagination="pagination"
      v-model:default-filter="filterState"
      :data="displayData"
      :columns="columns"
      :theme-config="themeConfig"
      :enable-row-hover="true"
      :fixed-header="true"
      :pagination-config="{
        enabled: true,
        mode: 'client',
        placement: 'right',
        total: data.length,
      }"
      class="h-[500px]"
      @table-change="handleTableChange"
    >
      <template #customFilterDropdown="{ confirm, reset, setFilterValue, filterModelValue }">
        <div class="filter-dropdown">
          <a-input
            :value="filterModelValue"
            placeholder="输入关键词筛选"
            class="filter-input"
            @input="(e: any) => setFilterValue(e.target.value)"
            @press-enter="confirm"
          />
          <div class="filter-actions">
            <a-button type="primary" size="small" @click="confirm">确定</a-button>
            <a-button size="small" @click="reset">重置</a-button>
          </div>
        </div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import VTable, {
  type VTableChangeState,
  type VTableColumn,
  type VTableColumnFiltersState,
  type VTablePaginationState,
  type VTableThemeConfig,
} from '@aimerthyr/virtual-table'

defineOptions({ name: 'CustomTheme' })

const currentTheme = ref<'default' | 'dark' | 'blue' | 'green'>('default')
const pagination = ref<VTablePaginationState>({ pageIndex: 1, pageSize: 10 })
const filterState = ref<VTableColumnFiltersState>([])

// 生成更多数据用于分页展示
const data = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
    department: ['技术部', '产品部', '运营部'][i % 3],
    status: ['在职', '离职', '休假'][i % 3],
  })),
)

// 客户端筛选逻辑
const displayData = computed(() => {
  let result = [...data.value]

  // 应用筛选
  filterState.value.forEach((filter) => {
    const filterValue = String(filter.value).toLowerCase()
    if (filterValue) {
      result = result.filter((row) => {
        const cellValue = String(row[filter.id as keyof typeof row]).toLowerCase()
        return cellValue.includes(filterValue)
      })
    }
  })

  return result
})

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 120,
    columnEnableFilter: true,
  },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  {
    columnKey: 'email',
    columnHeader: '邮箱',
    columnWidth: 200,
    columnEnableFilter: true,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnWidth: 120,
    columnEnableFilter: true,
  },
  {
    columnKey: 'status',
    columnHeader: '状态',
    columnEnableFilter: true,
  },
]

const handleTableChange = (changeState: VTableChangeState) => {
  console.log('表格状态变化:', changeState)
}

// 主题配置映射
const themeConfigs: Record<string, VTableThemeConfig> = {
  default: {
    primaryColor: '#1890ff',
    header: {
      color: 'rgba(0, 0, 0, 0.88)',
      backgroundColor: '#fafafa',
      borderRadius: 0,
      splitColor: 'rgba(0, 0, 0, 0.06)',
      headerIconColor: 'rgba(0, 0, 0, 0.45)',
      padding: 16,
    },
    body: {
      color: 'rgba(0, 0, 0, 0.88)',
      backgroundColor: '#ffffff',
      padding: 16,
    },
    border: {
      borderStyle: 'solid',
      borderColor: '#f0f0f0',
    },
    rowHoverColor: '#fafafa',
    zIndex: {
      pinnedColumn: 2,
      fixedHeader: 3,
      fixedFooter: 3,
    },
  },
  dark: {
    primaryColor: '#177ddc',
    header: {
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: '#1f1f1f',
      borderRadius: 0,
      splitColor: 'rgba(255, 255, 255, 0.12)',
      headerIconColor: 'rgba(255, 255, 255, 0.45)',
      padding: 16,
    },
    body: {
      color: 'rgba(255, 255, 255, 0.85)',
      backgroundColor: '#141414',
      padding: 16,
    },
    border: {
      borderStyle: 'solid',
      borderColor: '#303030',
    },
    rowHoverColor: '#262626',
    zIndex: {
      pinnedColumn: 2,
      fixedHeader: 3,
      fixedFooter: 3,
    },
  },
  blue: {
    primaryColor: '#1890ff',
    header: {
      color: '#ffffff',
      backgroundColor: '#1890ff',
      borderRadius: 8,
      splitColor: 'rgba(255, 255, 255, 0.2)',
      headerIconColor: 'rgba(255, 255, 255, 0.85)',
      padding: 16,
    },
    body: {
      color: 'rgba(0, 0, 0, 0.88)',
      backgroundColor: '#ffffff',
      padding: 16,
    },
    border: {
      borderStyle: 'solid',
      borderColor: '#e6f7ff',
    },
    rowHoverColor: '#e6f7ff',
    zIndex: {
      pinnedColumn: 2,
      fixedHeader: 3,
      fixedFooter: 3,
    },
  },
  green: {
    primaryColor: '#52c41a',
    header: {
      color: '#ffffff',
      backgroundColor: '#52c41a',
      borderRadius: 8,
      splitColor: 'rgba(255, 255, 255, 0.2)',
      headerIconColor: 'rgba(255, 255, 255, 0.85)',
      padding: 16,
    },
    body: {
      color: 'rgba(0, 0, 0, 0.88)',
      backgroundColor: '#ffffff',
      padding: 16,
    },
    border: {
      borderStyle: 'solid',
      borderColor: '#f6ffed',
    },
    rowHoverColor: '#f6ffed',
    zIndex: {
      pinnedColumn: 2,
      fixedHeader: 3,
      fixedFooter: 3,
    },
  },
}

const themeConfig = computed(() => themeConfigs[currentTheme.value])
</script>

<style scoped lang="less">
.custom-theme-example {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.theme-selector {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.filter-dropdown {
  padding: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.filter-input {
  width: 200px;
  margin-bottom: 8px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}
</style>
```

</details>
