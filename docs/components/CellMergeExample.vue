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
