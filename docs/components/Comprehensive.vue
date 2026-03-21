<template>
  <div style="height: calc(100vh - 64px)" class="flex flex-col bg-white p-[24px]">
    <h2 class="mb-[16px] flex gap-[16px]">
      综合示例
      <div>
        <a-tag color="blue">已选择: {{ selectedRows.length }} 条</a-tag>
        <a-tag color="green">当前数据: {{ tableData.length }} 条</a-tag>
      </div>
    </h2>
    <div class="mb-[12px] flex flex-col gap-[12px]">
      <div class="flex gap-[16px]">
        <div class="flex flex-col gap-[4px]">
          <div class="text-[14px] font-medium">展开模式</div>
          <a-radio-group v-model:value="expandMode" @change="handleExpandModeChange">
            <a-radio value="expand">expand 自定义</a-radio>
            <a-radio value="tree">tree</a-radio>
            <a-radio value="">不设置</a-radio>
          </a-radio-group>
        </div>
        <div class="flex flex-col gap-[4px]">
          <div class="text-[14px] font-medium">表格模式</div>
          <a-radio-group v-model:value="columnMode" @change="handleColumnModeChange">
            <a-radio value="normal">普通列</a-radio>
            <a-radio value="combined">表头分组+单元格合并</a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="flex items-center gap-[16px]">
        <a-checkbox v-model:checked="useScrollLoad" @change="handleLoadModeChange">
          启用滚动加载
        </a-checkbox>
        <a-button @click="handleClear">重置表格状态</a-button>
      </div>
    </div>
    <!-- 操作按钮区 -->
    <div class="toolbar">
      <a-button @click="handleSelection">设置选择员工8</a-button>
      <a-button @click="handleExpand">设置展开状态</a-button>
      <a-button @click="handleFilter">设置筛选员工2</a-button>
      <a-button @click="handleSort">设置创建时间倒序</a-button>
      <a-button @click="handleScrollToIndex">滚动到指定下标</a-button>
      <a-button @click="handleFixColumn">设置固定列</a-button>
    </div>

    <!-- 表格组件 -->
    <VTable
      ref="vTableRef"
      v-model:default-filter="filterState"
      v-model:default-sort="sortState"
      v-model:default-pagination="paginationState"
      v-model:default-expanded="expandedState"
      v-model:default-selection="selectionState"
      v-model:default-column-pinning="columnPinningState"
      class="min-h-0 flex-1"
      :data="tableData"
      :columns="columns"
      :loading="loading"
      :row-height="49"
      :fixed-header="true"
      :enable-row-hover="true"
      row-key="id"
      :row-selection-config="{
        enabled: true,
        getRowCheckDisabled: (row) => row.status === 'inactive',
        onChange: handleSelectionChange,
      }"
      :pagination-config="{
        enabled: !useScrollLoad,
        placement: 'right',
        total: totalCount,
      }"
      :tree-config="{
        enabled: enableTreeExpand,
        childrenKey: 'children',
      }"
      :enable-expand-row="enableExpandRow"
      :load-more-config="{
        showNoMore: useScrollLoad && hasNoMore,
        noMoreText: '已加载全部数据',
      }"
      :custom-row-attributes="customRowHandler"
      :custom-cell-attributes="customCellHandler"
      :theme-config="{
        border: {
          borderStyle: 'dashed',
        },
      }"
      @table-change="handleTableChange"
      @scroll-to-bottom="handleScrollToBottom"
      @expanded-rows-change="handleExpandedChange"
      @column-sizing-change="handleColumnSizingChange"
    >
      <!-- 自定义单元格 -->
      <template #bodyCell="{ columnKey, row }">
        <template v-if="columnKey === 'name'">
          <a-tag :color="row.level === 1 ? 'blue' : 'green'">{{ formatName(row.name) }}</a-tag>
        </template>
        <template v-else-if="columnKey === 'status'">
          <a-badge
            :status="row.status === 'active' ? 'success' : 'error'"
            :text="row.status === 'active' ? '正常' : '已停用'"
          />
        </template>
        <template v-else-if="columnKey === 'action'">
          <a-space>
            <a-button type="link" size="small" @click="handleEdit(row)">编辑</a-button>
            <a-button type="link" size="small" danger @click="handleDelete(row)">删除</a-button>
          </a-space>
        </template>
      </template>

      <!-- 自定义筛选下拉 -->
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
      <!-- 自定义展开行 -->
      <template #expandedRowRender="{ row }">
        <div class="p-[12px]">
          <div>我是自定义展开行 {{ row.id }}</div>
          <div style="color: red">tree 模式和 自定义展开行不可同时使用</div>
        </div>
      </template>
    </VTable>
  </div>
</template>

<script setup lang="ts">
import VTable, {
  CHECKBOX_COLUMN_KEY,
  EXPAND_COLUMN_KEY,
  type VTableChangeState,
  type VTableColumn,
  type VTableColumnFiltersState,
  type VTableColumnPinningState,
  type VTableColumnSizingState,
  type VTableExpandedState,
  type VTablePaginationState,
  type VTableSelectionState,
  type VTableSortingState,
} from '@aimerthyr/virtual-table'

defineOptions({ name: 'Comprehensive' })

// 数据类型定义
interface TableRow {
  id: number
  name: string
  age: number
  email: string
  department: string
  status: 'active' | 'inactive'
  level: number
  createTime: string
  children?: TableRow[]
}

// 表格状态
const loading = ref(false)
const tableData = ref<TableRow[]>([])
const totalCount = ref(0)
const selectedRows = ref<TableRow[]>([])
const useScrollLoad = ref(false)
const hasNoMore = ref(false)
const currentPage = ref(1)
const expandMode = ref('expand')
const enableExpandRow = ref(true)
const enableTreeExpand = ref(false)
const columnMode = ref<'normal' | 'combined'>('normal')

const paginationState = ref<VTablePaginationState>({ pageIndex: 1, pageSize: 20 })
const sortState = ref<VTableSortingState>([])
const filterState = ref<VTableColumnFiltersState>([])
const expandedState = ref<VTableExpandedState>({})
const selectionState = ref<VTableSelectionState>({})
const columnPinningState = ref<VTableColumnPinningState>({})
const vTableRef = useTemplateRef('vTableRef')

// 普通列配置（不分组）
const normalColumns: VTableColumn[] = [
  {
    columnKey: 'id',
    columnHeader: '员工id',
    columnWidth: 100,
    columnMaxWidth: 300,
    columnEnableResize: true,
  },
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: '30%',
    columnEnableFilter: true,
    columnEnableResize: true,
  },
  {
    columnKey: 'age',
    columnHeader: '年龄',
    columnWidth: '20%',
    columnAlign: 'center',
    columnEnableSort: true,
    /** 使用函数性能比插槽低，推荐使用插槽(如果内部无状态，例如下面的代码，则性能影响较小，只有在组件较为复杂，则可以改成 bodyCell 插槽) */
    columnCell(ctx) {
      return ctx.getValue()
    },
  },
  {
    columnKey: 'email',
    columnHeader: '邮箱',
    columnWidth: 220,
    columnEnableFilter: true,
  },
  {
    columnKey: 'department',
    columnHeader: '部门',
    columnWidth: 150,
    columnEnableFilter: true,
  },
  {
    columnKey: 'status',
    columnHeader: '状态',
    columnWidth: 120,
    columnAlign: 'center',
  },
  {
    columnKey: 'createTime',
    columnHeader: '创建时间',
    columnWidth: 180,
    columnEnableSort: true,
  },
  {
    columnKey: 'action',
    columnHeader: '操作',
    columnAlign: 'left',
  },
]

// 表头分组 + 单元格合并列配置
const combinedColumns: VTableColumn[] = [
  {
    columnKey: 'id',
    columnHeader: '员工id',
    columnWidth: 100,
    columnMaxWidth: 300,
    columnEnableResize: true,
  },
  // 表头分组：基本信息
  {
    columnKey: 'basicInfo',
    columnHeader: '基本信息',
    columnChildren: [
      {
        columnKey: 'name',
        columnHeader: '姓名',
        columnWidth: 120,
        columnEnableFilter: true,
        columnEnableResize: true,
      },
      {
        columnKey: 'department',
        columnHeader: '部门',
        columnWidth: 120,
      },
      {
        columnKey: 'age',
        columnHeader: '年龄',
        columnWidth: 100,
        columnAlign: 'center',
      },
    ],
  },
  // 表头分组：联系方式
  {
    columnKey: 'contactInfo',
    columnHeader: '联系方式',
    columnChildren: [
      {
        columnKey: 'email',
        columnHeader: '邮箱',
        columnWidth: 180,
      },
      {
        columnKey: 'status',
        columnHeader: '状态',
        columnWidth: 120,
        columnAlign: 'center',
      },
    ],
  },
  {
    columnKey: 'createTime',
    columnHeader: '创建时间',
    columnWidth: 140,
  },
  {
    columnKey: 'action',
    columnHeader: '操作',
    columnAlign: 'left',
  },
]

// 根据模式动态切换列配置
const columns = computed(() => {
  if (columnMode.value === 'combined') return combinedColumns
  return normalColumns
})

// 模拟后端数据生成
function generateMockData(page: number, pageSize: number): TableRow[] {
  const departments = ['技术部', '产品部', '运营部']
  const statuses: Array<'active' | 'inactive'> = ['active', 'inactive']
  const data: TableRow[] = []

  for (let i = 0; i < pageSize; i++) {
    const id = (page - 1) * pageSize + i + 1
    if (id > 200) break

    const parentRow: TableRow = {
      id,
      name: `员工${id}`,
      age: 25 + (id % 20),
      email: `user${id}@company.com`,
      department: departments[id % 3]!,
      status: statuses[id % 8 === 0 ? 1 : 0]!,
      level: 1,
      createTime: new Date(2024, 0, id).toLocaleDateString(),
      children:
        id % 5 === 0
          ? [
              {
                id: id * 1000 + 1,
                name: `下属${id}-1`,
                age: 22 + (id % 15),
                email: `sub${id}_1@company.com`,
                department: departments[id % 3]!,
                status: 'active' as const,
                level: 2,
                createTime: new Date(2024, 1, id).toLocaleDateString(),
              },
            ]
          : undefined,
    }
    data.push(parentRow)
  }

  return data
}

// 模拟分页请求
async function fetchDataByPage(params: {
  page: number
  pageSize: number
  sortList: VTableSortingState
  filterList: VTableColumnFiltersState
}) {
  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 500))

  let data = generateMockData(params.page, params.pageSize)

  // 模拟筛选
  params.filterList.forEach((filter: any) => {
    if (filter.id === 'name' && filter.value) {
      data = data.filter((item) => item.name.includes(filter.value as string))
    }
    if (filter.id === 'email' && filter.value) {
      data = data.filter((item) => item.email.includes(filter.value as string))
    }
    if (filter.id === 'department' && Array.isArray(filter.value) && filter.value.length) {
      data = data.filter((item) => filter.value.includes(item.department))
    }
  })

  // 模拟排序
  if (params.sortList.length > 0) {
    const sort = params.sortList[0]
    if (sort) {
      data.sort((a, b) => {
        const aVal = a[sort.id as keyof TableRow]
        const bVal = b[sort.id as keyof TableRow]
        if (sort.desc) {
          return aVal! > bVal! ? -1 : 1
        }
        return aVal! > bVal! ? 1 : -1
      })
    }
  }

  tableData.value = data
  totalCount.value = 200

  loading.value = false
}

// 模拟滚动加载请求
async function fetchDataByScroll(isLoadMore = false) {
  if (loading.value) return

  loading.value = true
  await new Promise((resolve) => setTimeout(resolve, 800))

  const pageSize = 20
  const newData = generateMockData(currentPage.value, pageSize)

  if (isLoadMore) {
    tableData.value = [...tableData.value, ...newData]
  } else {
    tableData.value = newData
  }

  hasNoMore.value = tableData.value.length >= 200
  totalCount.value = 200
  loading.value = false
}

// 事件处理
const handleFixColumn = () => {
  columnPinningState.value = {
    left: [CHECKBOX_COLUMN_KEY, EXPAND_COLUMN_KEY, 'name'],
    right: ['action'],
  }
}
const handleScrollToIndex = () => {
  vTableRef.value?.scrollToIndex(4)
}
const handleExpandModeChange = () => {
  if (expandMode.value === 'expand') {
    enableExpandRow.value = true
    enableTreeExpand.value = false
  } else if (expandMode.value === 'tree') {
    enableExpandRow.value = false
    enableTreeExpand.value = true
  } else {
    enableExpandRow.value = false
    enableTreeExpand.value = false
  }
  handleClear()
  handleRefresh()
}
const handleExpand = () => {
  expandedState.value = {
    '1': true,
    '5': true,
  }
}
const handleFilter = () => {
  filterState.value = [{ id: 'name', value: '员工2' }]
  handleRefresh()
}
const handleSort = () => {
  sortState.value = [{ id: 'createTime', desc: true }]
  handleRefresh()
}
const handleSelection = () => {
  selectionState.value = { '8': true }
}
const handleTableChange = (state: VTableChangeState) => {
  // 此案例仅在分页时处理了筛选
  if (!useScrollLoad.value) {
    fetchDataByPage({
      page: state.pagination.pageIndex,
      pageSize: state.pagination.pageSize,
      sortList: state.sortList,
      filterList: state.filterList,
    })
  }
}

const handleScrollToBottom = () => {
  if (useScrollLoad.value && !hasNoMore.value && !loading.value) {
    currentPage.value++
    fetchDataByScroll(true)
  }
}

const handleExpandedChange = (state: VTableExpandedState) => {
  console.log('展开状态:', state)
}

const handleSelectionChange = (rows: TableRow[]) => {
  selectedRows.value = rows
}

const handleColumnSizingChange = (state: VTableColumnSizingState) => {
  console.log('列宽调整:', state)
}

const handleLoadModeChange = () => {
  currentPage.value = 1
  hasNoMore.value = false
  tableData.value = []
  handleClear()

  if (useScrollLoad.value) {
    fetchDataByScroll()
  } else {
    paginationState.value = { pageIndex: 1, pageSize: 20 }
    fetchDataByPage({
      page: 1,
      pageSize: 20,
      sortList: sortState.value,
      filterList: filterState.value,
    })
  }
}

const handleRefresh = () => {
  if (useScrollLoad.value) {
    currentPage.value = 1
    hasNoMore.value = false
    fetchDataByScroll()
  } else {
    fetchDataByPage({
      page: paginationState.value.pageIndex,
      pageSize: paginationState.value.pageSize,
      sortList: sortState.value,
      filterList: filterState.value,
    })
  }
}

const handleClear = () => {
  selectionState.value = {}
  sortState.value = []
  filterState.value = []
  expandedState.value = {}
  selectedRows.value = []
  paginationState.value = {
    pageIndex: 1,
    pageSize: 20,
  }
  columnPinningState.value = {}
  handleRefresh()
}

const formatName = (name: string) => {
  console.log('是否重新调用', name)
  return name
}

const handleEdit = (row: TableRow) => {
  console.log('编辑:', row)
  row.name = 'xxx'
  row.age = 300
}

const handleDelete = (row: TableRow) => {
  console.log('删除:', row)
}

const customRowHandler = (row: TableRow) => {
  return {
    onClick: () => console.log('点击行:', row),
    style: row.status === 'inactive' ? { opacity: 0.6, background: '#fafafa' } : {},
  }
}

/**
 * 单元格合并处理函数
 * 实现规则：
 * 1. 相同部门的员工，部门列进行纵向合并
 * 2. 每5行，邮箱列进行横向合并（跨2列）
 * 3. 每10行，创建时间列进行纵向合并（跨2行）
 */
const customCellHandler = (
  row: TableRow,
  column: VTableColumn | undefined,
  rowIndex: number,
  _colIndex: number,
) => {
  // 只在单元格合并模式和组合模式下生效
  if (columnMode.value !== 'combined') {
    return null
  }

  if (!column || !row) {
    return null
  }

  const columnKey = column.columnKey

  // 规则1：相同部门的员工，部门列进行纵向合并
  if (columnKey === 'department') {
    // 查找当前行之前有多少个相同部门的连续行
    let prevSameCount = 0
    for (let i = rowIndex - 1; i >= 0; i--) {
      if (tableData.value[i]?.department === row.department) {
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
    for (let i = rowIndex + 1; i < tableData.value.length; i++) {
      if (tableData.value[i]?.department === row.department) {
        nextSameCount++
      } else {
        break
      }
    }

    // 返回合并的行数
    return { rowspan: 1 + nextSameCount }
  }

  // 规则2：每5行，邮箱列进行横向合并（跨2列：邮箱 + 状态）
  if (columnKey === 'email' && (rowIndex + 1) % 5 === 0) {
    return {
      colspan: 2,
      style: {
        background: '#e6f7ff',
        fontWeight: 'bold',
      },
    }
  }

  // 规则2：被合并的状态列不渲染
  if (columnKey === 'status' && (rowIndex + 1) % 5 === 0) {
    return { colspan: 0 }
  }

  // 规则3：每10行，创建时间列进行纵向合并（跨2行）
  if (columnKey === 'createTime') {
    // 每10行的第1行开始合并
    if ((rowIndex + 1) % 10 === 1 && rowIndex + 1 < tableData.value.length) {
      return {
        rowspan: 2,
        style: {
          background: '#fff7e6',
          verticalAlign: 'middle',
        },
      }
    }
    // 每10行的第2行不渲染
    if ((rowIndex + 1) % 10 === 2) {
      return { rowspan: 0 }
    }
  }

  return null
}

const handleColumnModeChange = () => {
  // 切换模式时重置状态
  handleClear()
  handleRefresh()
}

onMounted(() => {
  // 初始化
  fetchDataByPage({
    page: 1,
    pageSize: 20,
    sortList: [],
    filterList: [],
  })
})
</script>

<style scoped>
h2 {
  font-size: 18px;
  font-weight: 600;
}

.toolbar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}
</style>
