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
