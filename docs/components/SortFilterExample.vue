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
