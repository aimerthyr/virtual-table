<template>
  <div class="examples-container">
    <div class="examples-content">
      <h1 class="page-title">VTable 示例</h1>
      <p class="page-description">
        展示 VTable 组件的各种使用场景和功能特性，每个示例都可以独立运行和复制。
      </p>

      <!-- 基础用法 -->
      <section id="basic" class="example-section">
        <h2 class="example-title">基础用法</h2>
        <p class="example-desc">最简单的表格用法，展示基本的数据渲染。</p>

        <div class="example-demo">
          <BasicExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('basic')">
            <CodeOutlined />
            {{ codeVisible.basic ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('basic')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.basic" language="vue">
          {{ codes.basic }}
        </CodeBlock>
      </section>

      <!-- 固定表头 -->
      <section id="fixed-header" class="example-section">
        <h2 class="example-title">固定表头/表体</h2>
        <p class="example-desc">表头固定，内容区域可滚动，适合数据量较大的场景。</p>

        <div class="example-demo">
          <FixedHeaderExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('fixedHeader')">
            <CodeOutlined />
            {{ codeVisible.fixedHeader ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('fixedHeader')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.fixedHeader" language="vue">
          {{ codes.fixedHeader }}
        </CodeBlock>
      </section>

      <!-- 行选择 -->
      <section id="row-selection" class="example-section">
        <h2 class="example-title">行选择</h2>
        <p class="example-desc">支持多选、单选、禁用选择等功能。</p>

        <div class="example-demo">
          <RowSelectionExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('rowSelection')">
            <CodeOutlined />
            {{ codeVisible.rowSelection ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('rowSelection')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.rowSelection" language="vue">
          {{ codes.rowSelection }}
        </CodeBlock>
      </section>

      <!-- 排序和筛选 -->
      <section id="sort-filter" class="example-section">
        <h2 class="example-title">排序和筛选</h2>
        <p class="example-desc">支持列排序和自定义筛选功能。</p>

        <div class="example-demo">
          <SortFilterExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('sortFilter')">
            <CodeOutlined />
            {{ codeVisible.sortFilter ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('sortFilter')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.sortFilter" language="vue">
          {{ codes.sortFilter }}
        </CodeBlock>
      </section>

      <!-- 分页 -->
      <section id="pagination" class="example-section">
        <h2 class="example-title">分页</h2>
        <p class="example-desc">支持前端分页和后端分页，可自定义分页位置。</p>

        <div class="example-demo">
          <PaginationExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('pagination')">
            <CodeOutlined />
            {{ codeVisible.pagination ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('pagination')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.pagination" language="vue">
          {{ codes.pagination }}
        </CodeBlock>
      </section>

      <!-- 树形数据 -->
      <section id="tree-data" class="example-section">
        <h2 class="example-title">树形数据</h2>
        <p class="example-desc">展示树形结构数据，支持展开/收起子节点。</p>

        <div class="example-demo">
          <TreeDataExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('treeData')">
            <CodeOutlined />
            {{ codeVisible.treeData ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('treeData')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.treeData" language="vue">
          {{ codes.treeData }}
        </CodeBlock>
      </section>

      <!-- 可展开行 -->
      <section id="expandable" class="example-section">
        <h2 class="example-title">可展开行</h2>
        <p class="example-desc">自定义展开行内容，显示更多详细信息。</p>

        <div class="example-demo">
          <ExpandableExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('expandable')">
            <CodeOutlined />
            {{ codeVisible.expandable ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('expandable')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.expandable" language="vue">
          {{ codes.expandable }}
        </CodeBlock>
      </section>

      <!-- 固定列 -->
      <section id="fixed-columns" class="example-section">
        <h2 class="example-title">固定列</h2>
        <p class="example-desc">固定左侧或右侧列，横向滚动时保持可见。</p>

        <div class="example-demo">
          <FixedColumnsExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('fixedColumns')">
            <CodeOutlined />
            {{ codeVisible.fixedColumns ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('fixedColumns')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.fixedColumns" language="vue">
          {{ codes.fixedColumns }}
        </CodeBlock>
      </section>

      <!-- 列宽调整 -->
      <section id="column-resize" class="example-section">
        <h2 class="example-title">列宽调整</h2>
        <p class="example-desc">拖动列边缘调整列宽，支持最小/最大宽度限制，列宽可设置百分比</p>

        <div class="example-demo">
          <ColumnResizeExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('columnResize')">
            <CodeOutlined />
            {{ codeVisible.columnResize ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('columnResize')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.columnResize" language="vue">
          {{ codes.columnResize }}
        </CodeBlock>
      </section>

      <!-- 单元格合并 -->
      <section id="cell-merge" class="example-section">
        <h2 class="example-title">单元格合并</h2>
        <p class="example-desc">支持行合并和列合并，实现复杂表格布局。</p>

        <div class="example-demo">
          <CellMergeExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('cellMerge')">
            <CodeOutlined />
            {{ codeVisible.cellMerge ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('cellMerge')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.cellMerge" language="vue">
          {{ codes.cellMerge }}
        </CodeBlock>
      </section>

      <!-- 自定义 Slot -->
      <section id="custom-slot" class="example-section">
        <h2 class="example-title">自定义 Slot</h2>
        <p class="example-desc">
          通过插槽自定义表头、单元格、复选框、筛选器、空状态等。例如复选框，分页器这种你可以直接换成其他组件库的都是允许的
        </p>

        <div class="example-demo">
          <CustomSlotExample />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('customSlot')">
            <CodeOutlined />
            {{ codeVisible.customSlot ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('customSlot')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.customSlot" language="vue">
          {{ codes.customSlot }}
        </CodeBlock>
      </section>

      <!-- 自定义主题 -->
      <section id="custom-theme" class="example-section">
        <h2 class="example-title">自定义主题</h2>
        <p class="example-desc">
          通过 themeConfig 配置自定义表格主题，包括颜色、边框、内边距等样式。
        </p>

        <div class="example-demo">
          <CustomTheme />
        </div>

        <div class="example-actions">
          <a-button class="flex items-center" type="link" @click="toggleCode('customTheme')">
            <CodeOutlined />
            {{ codeVisible.customTheme ? '隐藏代码' : '显示代码' }}
          </a-button>
          <a-button class="flex items-center" type="link" @click="copyCode('customTheme')">
            <CopyOutlined />
            复制代码
          </a-button>
        </div>

        <CodeBlock v-show="codeVisible.customTheme" language="vue">
          {{ codes.customTheme }}
        </CodeBlock>
      </section>
    </div>

    <!-- 右侧锚点导航 -->
    <aside class="examples-anchor">
      <a-anchor
        :affix="false"
        :target-offset="64"
        :items="anchorItems"
        :get-current-anchor="getCurrentAnchor"
        @click="handleAnchorClick"
      />
    </aside>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { CodeOutlined, CopyOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import BasicExample from '../examples/BasicExample.vue'
import CellMergeExample from '../examples/CellMergeExample.vue'
import ColumnResizeExample from '../examples/ColumnResizeExample.vue'
import CustomSlotExample from '../examples/CustomSlotExample.vue'
import CustomTheme from '../examples/CustomTheme.vue'
import ExpandableExample from '../examples/ExpandableExample.vue'
import FixedColumnsExample from '../examples/FixedColumnsExample.vue'
import FixedHeaderExample from '../examples/FixedHeaderExample.vue'
import PaginationExample from '../examples/PaginationExample.vue'
import RowSelectionExample from '../examples/RowSelectionExample.vue'
import SortFilterExample from '../examples/SortFilterExample.vue'
import TreeDataExample from '../examples/TreeDataExample.vue'

defineOptions({ name: 'Examples' })

// 锚点导航配置
const anchorItems = [
  { key: 'basic', href: '#basic', title: '基础用法' },
  { key: 'fixed-header', href: '#fixed-header', title: '固定表头/表体' },
  { key: 'row-selection', href: '#row-selection', title: '行选择' },
  { key: 'sort-filter', href: '#sort-filter', title: '排序和筛选' },
  { key: 'pagination', href: '#pagination', title: '分页' },
  { key: 'tree-data', href: '#tree-data', title: '树形数据' },
  { key: 'expandable', href: '#expandable', title: '可展开行' },
  { key: 'fixed-columns', href: '#fixed-columns', title: '固定列' },
  { key: 'column-resize', href: '#column-resize', title: '列宽调整' },
  { key: 'cell-merge', href: '#cell-merge', title: '单元格合并' },
  { key: 'custom-slot', href: '#custom-slot', title: '自定义 Slot' },
  { key: 'custom-theme', href: '#custom-theme', title: '自定义主题' },
]

// 代码显示状态
const codeVisible = ref({
  basic: false,
  fixedHeader: false,
  rowSelection: false,
  sortFilter: false,
  pagination: false,
  treeData: false,
  expandable: false,
  fixedColumns: false,
  columnResize: false,
  cellMerge: false,
  customSlot: false,
  customTheme: false,
})

// 示例代码
const codes = {
  basic: `<template>
    <VTable :data="data" :columns="columns" :bordered="true" />
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
<\/script>`,

  fixedHeader: `<template>
  <div class="h-[400px]">
    <VTable
      :data="data"
      :columns="columns"
      :fixed-header="true"
      :row-height="48"
      :bordered="true"
      :fixed-footer="true"
    >
      <template #customFooter>
        <div class="w-full bg-[#fafafa] p-[12px]">我是表尾可以自定义</div>
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
    name: \`用户\${i + 1}\`,
    age: 20 + (i % 30),
    email: \`user\${i + 1}@example.com\`,
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
<\/script>`,
  rowSelection: `<template>
  <div>
    <div class="mb-4">
      <a-tag color="blue">已选择: {{ selectedRows.length }} 条</a-tag>
    </div>
    <VTable
      :data="data"
      :columns="columns"
      :bordered="true"
      row-key="id"
      :row-selection-config="{
        enabled: true,
        getRowCheckDisabled: (row) => row.disabled,
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
<\/script>`,

  sortFilter: `<template>
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
<\/script>`,

  pagination: `<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
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
      :bordered="true"
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
      name: \`员工\${id}\`,
      age: 20 + (id % 30),
      email: \`user\${id}@example.com\`,
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
<\/script>`,
  treeData: `
<template>
  <VTable
    :data="data"
    :columns="columns"
    :tree-config="{
      enabled: true,
      childrenKey: 'children',
    }"
  />
</template>

<script setup>
const data = ref([
  {
    id: 1,
    name: '部门A',
    children: [
      { id: 11, name: '员工1' },
      { id: 12, name: '员工2' },
    ],
  },
])
<\/script>`,

  expandable: `<template>
  <VTable :data="data" :columns="columns" :bordered="true" row-key="id" :enable-expand-row="true">
    <template #expandedRowRender="{ row }">
      <div class="bg-gray-50 p-4">
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
<\/script>`,

  fixedColumns: `<template>
  <div>
    <div class="mb-4">
      <a-button @click="handleFixColumns">固定左右列</a-button>
      <a-button class="ml-2" @click="handleClearFixed">取消固定</a-button>
    </div>
    <VTable
      v-model:default-column-pinning="columnPinning"
      :data="data"
      :columns="columns"
      :bordered="true"
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
<\/script>`,

  columnResize: `<template>
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
      :bordered="true"
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
  message.success(\`已切换到 \${modeName} 模式，请尝试拖拽列宽观察区别\`)
}
<\/script>`,

  cellMerge: `<template>
  <VTable
    :data="data"
    :columns="columns"
    :bordered="true"
    :custom-cell-attributes="customCellHandler"
  />
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
<\/script>`,

  customSlot: `<template>
  <div class="mb-[8px] flex items-center gap-[8px]">
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
    :default-checkbox-column-width="82"
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
  message.info(\`编辑: \${row.name}\`)
}

const handleDelete = (row: any) => {
  message.warning(\`删除: \${row.name}\`)
}

const handleAddData = () => {
  data.value.push({
    id: data.value.length + 1,
    name: \`新员工\${data.value.length + 1}\`,
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
<\/script>`,

  customTheme: `<template>
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
      :bordered="true"
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
    name: \`用户\${i + 1}\`,
    age: 20 + (i % 30),
    email: \`user\${i + 1}@example.com\`,
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
<\/script>

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
<\/style>`,
}

// 切换代码显示
const toggleCode = (key: string) => {
  codeVisible.value[key as keyof typeof codeVisible.value] =
    !codeVisible.value[key as keyof typeof codeVisible.value]
}

// 复制代码
const copyCode = async (key: string) => {
  try {
    await navigator.clipboard.writeText((codes as any)[key])
    message.success('代码已复制到剪贴板')
  } catch {
    message.error('复制失败，请手动复制')
  }
}

const currentAnchor = ref('#basic')
const handleAnchorClick = (e: MouseEvent, link: { href: string; title: string }) => {
  e.preventDefault()
  const targetId = link.href.replace('#', '')
  const targetElement = document.getElementById(targetId)
  if (targetElement) {
    const headerHeight = 64
    const elementPosition = targetElement.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight
    currentAnchor.value = link.href
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

// 获取当前激活的锚点
const getCurrentAnchor = () => {
  return currentAnchor.value
}

// 更新当前激活的锚点（基于滚动位置）
const updateCurrentAnchor = () => {
  const sections = anchorItems.map((item) => item.key)
  const headerHeight = 64
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i]!)
    if (section) {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + scrollTop - headerHeight
      if (scrollTop >= sectionTop - 10) {
        currentAnchor.value = `#${sections[i]}`
        return
      }
    }
  }
  currentAnchor.value = '#basic'
}

// 监听滚动事件
let scrollTimer: number | null = null
const handleScroll = () => {
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
  scrollTimer = window.setTimeout(() => {
    updateCurrentAnchor()
  }, 100)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateCurrentAnchor()
  const hash = window.location.hash
  const match = hash.match(/#\/examples#(.+)/)
  if (match) {
    const targetId = match[1]
    setTimeout(() => {
      const targetElement = document.getElementById(targetId!)
      if (targetElement) {
        const headerHeight = 64
        const elementPosition = targetElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight
        currentAnchor.value = `#${targetId}`
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
      }
    }, 100)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }
})
</script>

<style scoped lang="less">
.examples-content :deep(.v-table-wrapper) {
  height: 100%;
}

.examples-container {
  display: flex;
  min-height: 100vh;
  background: #fff;
  gap: 24px;
  padding: 24px;
}

.examples-content {
  flex: 1;
  min-width: 0;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.examples-anchor {
  width: 180px;
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.page-title {
  font-size: 30px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 16px;
}

.page-description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 48px;
}

.example-section {
  margin-bottom: 64px;
  scroll-margin-top: 64px;

  &:last-child {
    margin-bottom: 0;
  }
}

.example-title {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 8px;
}

.example-desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 16px;
}

.example-demo {
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  padding: 24px;
  background: #fff;
}

.example-actions {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  border: 1px solid #f0f0f0;
  border-top: none;
  background: #fafafa;
}

.example-code {
  border: 1px solid #f0f0f0;
  border-top: none;
  background: #f5f5f5;
  padding: 16px;
  overflow-x: auto;

  pre {
    margin: 0;
    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.6;
    color: rgba(0, 0, 0, 0.88);

    code {
      background: transparent;
      border: none;
      padding: 0;
    }
  }
}
</style>
