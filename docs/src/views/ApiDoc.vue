<template>
  <div class="api-doc-container">
    <!-- 主内容区 -->
    <main class="api-doc-content">
      <!-- 概览 -->
      <section id="overview" class="doc-section">
        <h1 class="doc-title">VTable 虚拟表格</h1>
        <a-divider />
        <p class="doc-description">
          基于 TanStack Table 和 TanStack Virtual
          构建的高性能虚拟滚动表格组件，支持大数据量渲染、排序、筛选、分页、拖拽、树形结构、可展开、可选择等功能。
        </p>

        <h2 class="doc-subtitle">特性</h2>
        <ul class="doc-list">
          <li>🚀 虚拟滚动 - 支持百万级数据流畅渲染</li>
          <li>📊 丰富功能 - 排序、筛选、分页、行选择、列固定</li>
          <li>🌲 树形结构 - 支持树形数据展示和自定义展开行</li>
          <li>🎨 高度定制 - 支持自定义单元格、表头、主题配置、以及内置的复选框、分页器均可替换</li>
          <li>📱 响应式 - 自适应列宽，支持列拖拽调整</li>
          <li>🔧 TypeScript - 完整的类型定义</li>
        </ul>

        <h2 class="doc-subtitle">安装</h2>
        <div>第一步</div>
        <CodeBlock> npm install @aimerthyr/virtual-table </CodeBlock>
        <div>第二步</div>
        <CodeBlock language="ts">
          {{
            `
        // 在 main.ts 中引入样式文件
        import '@aimerthyr/virtual-table/virtual-table.css'

        `
          }}
        </CodeBlock>

        <h2 class="doc-subtitle">快速开始</h2>
        <CodeBlock language="vue">
          {{ `<template>
            <VTable :data="data" :columns="columns" />
          </template>
          <script setup>
            import VTable from '@aimerthyr/virtual-table'
          </script>
          ` }}
        </CodeBlock>
      </section>

      <!-- Props API -->
      <section id="props" class="doc-section">
        <h1 class="doc-title">Props</h1>
        <a-divider />

        <a-table :columns="propsColumns" :data-source="propsData" :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <code class="prop-name">{{ record.name }}</code>
            </template>
            <template v-else-if="column.key === 'type'">
              <a-tag class="whitespace-normal" color="blue">{{ record.type }}</a-tag>
            </template>
            <template v-else-if="column.key === 'default'">
              <code v-if="record.default">{{ record.default }}</code>
              <span v-else class="text-gray">-</span>
            </template>
          </template>
        </a-table>
      </section>

      <!-- Events API -->
      <section id="events" class="doc-section">
        <h1 class="doc-title">Events</h1>
        <a-divider />

        <a-table :columns="eventsColumns" :data-source="eventsData" :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <code class="prop-name">{{ record.name }}</code>
            </template>
            <template v-else-if="column.key === 'params'">
              <code v-if="record.params">{{ record.params }}</code>
              <span v-else class="text-gray">-</span>
            </template>
          </template>
        </a-table>
      </section>

      <!-- Slots API -->
      <section id="slots" class="doc-section">
        <h1 class="doc-title">Slots</h1>
        <a-divider />

        <a-table :columns="slotsColumns" :data-source="slotsData" :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <code class="prop-name">{{ record.name }}</code>
            </template>
            <template v-else-if="column.key === 'params'">
              <code v-if="record.params">{{ record.params }}</code>
              <span v-else class="text-gray">-</span>
            </template>
          </template>
        </a-table>
      </section>

      <!-- Methods API -->
      <section id="methods" class="doc-section">
        <h1 class="doc-title">Methods</h1>
        <a-divider />

        <a-table :columns="methodsColumns" :data-source="methodsData" :pagination="false" bordered>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <code class="prop-name">{{ record.name }}</code>
            </template>
            <template v-else-if="column.key === 'params'">
              <code v-if="record.params">{{ record.params }}</code>
              <span v-else class="text-gray">-</span>
            </template>
            <template v-else-if="column.key === 'return'">
              <a-tag v-if="record.return" color="green">{{ record.return }}</a-tag>
              <span v-else class="text-gray">void</span>
            </template>
          </template>
        </a-table>
      </section>
    </main>

    <!-- 右侧锚点导航 -->
    <aside class="api-doc-anchor">
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

defineOptions({ name: 'ApiDoc' })

// 锚点导航配置
const anchorItems = [
  { key: 'overview', href: '#overview', title: '概览' },
  { key: 'props', href: '#props', title: 'Props' },
  { key: 'events', href: '#events', title: 'Events' },
  { key: 'slots', href: '#slots', title: 'Slots' },
  { key: 'methods', href: '#methods', title: 'Methods' },
]

// 当前激活的锚点
const currentAnchor = ref('#overview')
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

const getCurrentAnchor = () => {
  return currentAnchor.value
}

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
  currentAnchor.value = '#overview'
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

// 页面加载时检查 URL hash
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  updateCurrentAnchor()
  const hash = window.location.hash
  const match = hash.match(/#\/api#(.+)/)
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

// Props 表格配置
const propsColumns = [
  { title: '属性名', dataIndex: 'name', key: 'name', width: 200 },
  { title: '说明', dataIndex: 'description', key: 'description', width: 120 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 120 },
  { title: '默认值', dataIndex: 'default', key: 'default', width: 120 },
]

// Props 表格配置
const propsData = [
  {
    key: '1',
    name: 'data',
    description: '表格数据源',
    type: 'TData[]',
    default: '[]',
  },
  {
    key: '2',
    name: 'columns',
    description: '表格列配置',
    type: 'VTableColumn[]',
    default: '[]',
  },
  {
    key: '3',
    name: 'rowHeight',
    description: '表格行高（建议设置，优化滚动性能）',
    type: 'number',
    default: 'undefined',
  },
  {
    key: '4',
    name: 'rowKey',
    description: '行唯一标识字段或函数',
    type: 'string | number | ((row: TData) => string | number)',
    default: 'undefined',
  },
  {
    key: '5',
    name: 'loading',
    description: '是否处于加载状态',
    type: 'boolean',
    default: 'false',
  },
  {
    key: '6',
    name: 'fixedHeader',
    description: '是否固定表头',
    type: 'boolean',
    default: 'true',
  },
  {
    key: '7',
    name: 'enableSortingRemoval',
    description: '是否允许取消排序',
    type: 'boolean',
    default: 'true',
  },
  {
    key: '8',
    name: 'bordered',
    description: '是否显示边框',
    type: 'boolean',
    default: 'false',
  },
  {
    key: '9',
    name: 'rowSelectionConfig',
    description: '选择行功能配置',
    type: 'VTableRowSelectionConfig<TData>',
    default: '{ enabled: false, getRowCheckDisabled: () => false, onChange: () => {} }',
  },
  {
    key: '10',
    name: 'loadMoreConfig',
    description: '加载更多配置',
    type: 'VTableLoadMoreConfig',
    default: "{ showNoMore: false, noMoreText: '没有更多了' }",
  },
  {
    key: '11',
    name: 'paginationConfig',
    description: '分页器配置',
    type: 'VTablePaginationConfig',
    default: "{ enabled: false, placement: 'right', total: 0, mode: 'server' }",
  },
  {
    key: '12',
    name: 'treeConfig',
    description: '树形结构配置',
    type: 'VTableTreeConfig',
    default: "{ enabled: false, childrenKey: 'children', indentSize: 16 }",
  },
  {
    key: '13',
    name: 'enableExpandRow',
    description: '是否启用展开行功能',
    type: 'boolean',
    default: 'false',
  },
  {
    key: '14',
    name: 'enableRowHover',
    description: '是否启用行 hover 高亮',
    type: 'boolean',
    default: 'true',
  },
  {
    key: '15',
    name: 'adaptiveColumnWidth',
    description: '自适应列宽的最小列宽',
    type: 'number',
    default: '120',
  },
  {
    key: '16',
    name: 'defaultExpandAllRows',
    description: '默认展开所有行（仅初始化生效）',
    type: 'boolean',
    default: 'false',
  },
  {
    key: '17',
    name: 'columnResizeMode',
    description: '列宽调整模式',
    type: "'onChange' | 'onEnd'",
    default: 'onChange',
  },
  {
    key: '18',
    name: 'fixedFooter',
    description: '是否固定表尾',
    type: 'boolean',
    default: 'false',
  },
  {
    key: '19',
    name: 'themeConfig',
    description: '自定义主题配置（可覆盖默认主题）',
    type: 'VTableThemeConfig',
    default: '{}',
  },
  {
    key: '20',
    name: 'defaultCheckboxColumnWidth',
    description: '默认 checkbox 列宽',
    type: 'number',
    default: '40',
  },
  {
    key: '21',
    name: 'defaultExpandColumnWidth',
    description: '默认展开列宽',
    type: 'number',
    default: '42',
  },
  {
    key: '22',
    name: 'customRowAttributes',
    description: '自定义数据行属性',
    type: '(row: TData, rowIndex: number) => HTMLAttributes',
    default: '() => ({})',
  },
  {
    key: '23',
    name: 'customHeaderCellAttributes',
    description: '自定义表头单元格属性',
    type: '(column: VTableColumn, colIndex: number) => ThHTMLAttributes',
    default: '() => ({})',
  },
  {
    key: '24',
    name: 'customCellAttributes',
    description: '自定义表体单元格属性（支持合并单元格）',
    type: '(row: TData, column: VTableColumn, rowIndex: number, colIndex: number) => TdHTMLAttributes | null',
    default: '() => ({})',
  },
]

// Events 表格配置
const eventsData = [
  {
    key: '1',
    name: 'onTableChange',
    description: '表格状态变化时触发（分页、排序、筛选）',
    params: '(state: VTableChangeState) => void',
  },
  {
    key: '2',
    name: 'onScrollToBottom',
    description: '滚动到底部时触发',
    params: '() => void',
  },
  {
    key: '3',
    name: 'onExpandedRowsChange',
    description: '展开行变化时触发',
    params: '(state: VTableExpandedState) => void',
  },
  {
    key: '4',
    name: 'onColumnSizingChange',
    description: '列宽调整时触发',
    params: '(state: VTableColumnSizingState) => void',
  },
]

// Events 表格配置
const eventsColumns = [
  { title: '事件名', dataIndex: 'name', key: 'name', width: 200 },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '回调参数', dataIndex: 'params', key: 'params', width: 250 },
]

// Slots 表格配置
const slotsColumns = [
  { title: '插槽名', dataIndex: 'name', key: 'name', width: 220 },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '参数', dataIndex: 'params', key: 'params', width: 250 },
]

const slotsData = [
  {
    key: '1',
    name: 'customHeader',
    description: '自定义整个表头',
    params: '{ columns, table }',
  },
  {
    key: '2',
    name: 'bodyCell',
    description: '自定义单元格内容',
    params: '{ columnKey, column, row, rowIndex }', // 补上 column
  },
  {
    key: '3',
    name: 'headerCell',
    description: '自定义表头单元格',
    params: '{ columnKey, column }', // 修正参数名
  },
  {
    key: '4',
    name: 'customFilterIcon',
    description: '自定义筛选图标',
    params: '{ columnKey, filtered, column }', // 补齐参数
  },
  {
    key: '5',
    name: 'customFilterDropdown',
    description: '自定义筛选下拉框',
    params: '{ confirm, reset, setFilterValue, column, filterModelValue }', // 补上 column
  },
  {
    key: '6',
    name: 'expandedRowRender',
    description: '自定义展开行内容',
    params: '{ row }',
  },
  {
    key: '7',
    name: 'customPopover',
    description: '自定义 Popover',
    params: '{ open, onOpenChange, trigger, content }', // 新增
  },
  {
    key: '8',
    name: 'customPagination',
    description: '自定义分页组件',
    params: '{ pageSize, pageIndex, total, onPageChange }',
  },
  {
    key: '9',
    name: 'customCheckbox',
    description: '自定义复选框',
    params: '{ checked, disabled, indeterminate, onCheckedChange }',
  },
  {
    key: '10',
    name: 'customEmpty',
    description: '自定义空状态',
    params: '-',
  },
  {
    key: '11',
    name: 'customLoadingIcon',
    description: '自定义加载图标',
    params: '-',
  },
  {
    key: '12',
    name: 'customLoadNoMore',
    description: '自定义加载完成提示',
    params: '-',
  },
  {
    key: '13',
    name: 'customFooter',
    description: '自定义表尾',
    params: '-',
  },
  {
    key: '14',
    name: 'customExpandIcon',
    description: '自定义展开图标',
    params: '{ expand, onExpandChange }',
  },
  {
    key: '15',
    name: 'customSorterIcon',
    description: '自定义排序图标',
    params: '{ sort }',
  },
]

// Methods 表格配置
const methodsColumns = [
  { title: '方法名', dataIndex: 'name', key: 'name', width: 200 },
  { title: '说明', dataIndex: 'description', key: 'description' },
  { title: '参数', dataIndex: 'params', key: 'params', width: 250 },
  { title: '返回值', dataIndex: 'return', key: 'return', width: 120 },
]

const methodsData = [
  {
    key: '1',
    name: 'scrollToIndex',
    description: '滚动到指定行索引',
    params: '(index: number, behavior?: ScrollBehavior)',
    return: 'void',
  },
  {
    key: '2',
    name: 'tanstackTable',
    description: '获取 TanStack Table 实例',
    params: '-',
    return: 'Table',
  },
]
</script>

<style scoped lang="less">
.api-doc-container {
  display: flex;
  background: #fff;
  padding: 24px;
  gap: 24px;
}

.api-doc-content {
  flex: 1;
  max-width: 1200px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.api-doc-anchor {
  width: 180px;
  position: sticky;
  top: 80px;
  height: fit-content;
  max-height: calc(100vh - 96px);
  overflow-y: auto;
}

.doc-section {
  margin-bottom: 64px;
  scroll-margin-top: 64px;

  &:last-child {
    margin-bottom: 0;
  }
}

.doc-title {
  font-size: 30px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin-bottom: 16px;
}

.doc-subtitle {
  font-size: 24px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
  margin: 32px 0 16px;
}

.doc-description {
  font-size: 14px;
  line-height: 1.8;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 24px;
}

.doc-list {
  padding-left: 20px;
  margin: 16px 0;

  li {
    font-size: 14px;
    line-height: 2;
    color: rgba(0, 0, 0, 0.65);
  }
}

.code-block {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  padding: 16px;
  margin: 16px 0;
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

.prop-name {
  color: #c41d7f;
  background: #fff0f6;
  border: 1px solid #ffadd2;
  padding: 2px 6px;
  border-radius: 2px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.text-gray {
  color: rgba(0, 0, 0, 0.25);
}

:deep(.ant-table) {
  font-size: 14px;

  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 16px;
  }
}

:deep(.ant-divider) {
  margin: 24px 0;
}
</style>
