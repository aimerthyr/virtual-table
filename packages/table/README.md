# @aimerthyr/virtual-table

[English](./README.en.md) | 简体中文

基于 Vue 3、TanStack Table 和 TanStack Virtual 的高性能虚拟滚动表格组件。

## 介绍

`@aimerthyr/virtual-table` 是一个面向中大数据量场景的 Vue 3 表格组件，支持行列虚拟滚动、排序、筛选、分页、树形数据、展开行、行选择、固定表头、固定列、列宽调整等常用能力，并提供完整的 TypeScript 类型支持与插槽扩展能力。

## 特性

- 基于虚拟滚动实现大数据量高性能渲染
- 支持排序、筛选、分页、树形数据、展开行、行选择
- 支持固定表头、固定列、列宽调整
- 支持自定义单元格、自定义筛选、自定义分页、自定义主题
- 基于 Vue 3 Composition API 与 TypeScript 构建
- 底层依赖 TanStack Table 与 TanStack Virtual，扩展能力强

## 官网

**在线地址：**
[https://aimerthyr.github.io/virtual-table/](https://aimerthyr.github.io/virtual-table/)

## 安装

```bash
# pnpm
pnpm add @aimerthyr/virtual-table

# npm
npm install @aimerthyr/virtual-table

# yarn
yarn add @aimerthyr/virtual-table
```

## 依赖要求

- `vue >= 3.5.0`

## 快速开始

```ts
// main.ts 中导入
import '@aimerthyr/virtual-table/virtual-table.css'
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import '@aimerthyr/virtual-table/virtual-table.css'

const data = ref([
  { id: 1, name: '张三', age: 28, address: '北京市朝阳区' },
  { id: 2, name: '李四', age: 32, address: '上海市浦东新区' },
  { id: 3, name: '王五', age: 25, address: '广州市天河区' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: '地址' },
]
</script>

<template>
  <!-- 建议设置 row-height，以获得更稳定的虚拟滚动体验 -->
  <VTable :data="data" :columns="columns" :row-height="44" bordered />
</template>
```

## 导入方式

```ts
import VTable from '@aimerthyr/virtual-table'
```

或：

```ts
import { VTable } from '@aimerthyr/virtual-table'
```

同时也支持按需导入类型：

```ts
import type {
  VTableChangeState,
  VTableColumn,
  VTableColumnSizingState,
  VTableData,
  VTableExpandedState,
  VTableInstance,
  VTablePaginationState,
  VTableProps,
} from '@aimerthyr/virtual-table'
```

## CDN 方式

支持通过 UMD 产物直接在浏览器中使用：

```html
<link rel="stylesheet" href="https://unpkg.com/@aimerthyr/virtual-table/dist/virtual-table.css" />
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/@aimerthyr/virtual-table/dist/index.umd.js"></script>
<script>
  // UMD 挂载名来自 vite lib.name = 'VirtualTable'
  const VTable = window.VirtualTable.default || window.VirtualTable
</script>
```

## 常见用法

### 1. 启用排序和筛选

```vue
<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import '@aimerthyr/virtual-table/virtual-table.css'

const data = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
]

const columns: VTableColumn[] = [
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 150,
    columnEnableSort: true,
    columnEnableFilter: true,
  },
  {
    columnKey: 'age',
    columnHeader: '年龄',
    columnWidth: 100,
    columnEnableSort: true,
  },
]
</script>

<template>
  <VTable :columns="columns" :data="data" />
</template>
```

### 2. 自定义单元格

```vue
<template>
  <VTable :columns="columns" :data="data">
    <template #bodyCell="{ columnKey, row }">
      <strong v-if="columnKey === 'name'">{{ row.name }}</strong>
      <template v-else>{{ row[columnKey] }}</template>
    </template>
  </VTable>
</template>
```

### 3. 分页

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VTable, {
  type VTableChangeState,
  type VTableColumn,
  type VTablePaginationState,
} from '@aimerthyr/virtual-table'

const loading = ref(false)
const totalCount = ref(200)

const pagination = ref<VTablePaginationState>({
  pageIndex: 1,
  pageSize: 10,
})

const tableData = ref<any[]>([])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100 },
]

const fetchData = async (page: number, pageSize: number) => {
  loading.value = true

  // 示例：实际项目中这里替换为你的接口请求
  await new Promise((resolve) => setTimeout(resolve, 300))

  const start = (page - 1) * pageSize
  tableData.value = Array.from({ length: pageSize }, (_, i) => ({
    id: start + i + 1,
    name: `用户${start + i + 1}`,
    age: 20 + ((start + i) % 20),
  }))

  loading.value = false
}

const handleTableChange = (state: VTableChangeState) => {
  const { pageIndex, pageSize } = state.pagination
  pagination.value = { pageIndex, pageSize }
  fetchData(pageIndex, pageSize)
}

fetchData(pagination.value.pageIndex, pagination.value.pageSize)
</script>

<template>
  <VTable
    v-model:default-pagination="pagination"
    :data="tableData"
    :columns="columns"
    :loading="loading"
    :pagination-config="{
      enabled: true,
      total: totalCount,
      placement: 'right',
    }"
    @table-change="handleTableChange"
  />
</template>
```

### 4. 列宽调整

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VTable, { type VTableColumn, type VTableColumnSizingState } from '@aimerthyr/virtual-table'

const columnSizing = ref<VTableColumnSizingState>({})

const data = [
  { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 32, email: 'lisi@example.com' },
]

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80, columnEnableResize: true },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 120, columnEnableResize: true },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100, columnEnableResize: true },
  { columnKey: 'email', columnHeader: '邮箱', columnEnableResize: true },
]

const handleColumnSizingChange = (state: VTableColumnSizingState) => {
  console.log('当前列宽状态:', state)
}
</script>

<template>
  <VTable
    v-model:default-column-sizing="columnSizing"
    :data="data"
    :columns="columns"
    column-resize-mode="onEnd"
    @column-sizing-change="handleColumnSizingChange"
  />
</template>
```

### 5. 行选择

```vue
<script setup lang="ts">
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'

const data = [
  { id: 1, name: '张三', age: 28 },
  { id: 2, name: '李四', age: 32 },
  { id: 3, name: '王五', age: 25 },
]

const columns: VTableColumn[] = [
  { columnKey: 'name', columnHeader: '姓名' },
  { columnKey: 'age', columnHeader: '年龄' },
]

const handleSelectionChange = (rows: any[]) => {
  console.log('选中的行:', rows)
}
</script>

<template>
  <VTable
    :data="data"
    :columns="columns"
    :row-selection-config="{
      enabled: true,
      onChange: handleSelectionChange,
    }"
  />
</template>
```

## Props

> 在 Vue 模板中请使用 `kebab-case`，例如 `rowHeight` 对应 `row-height`。

| 属性名                       | 类型                                                            | 默认值                                                             | 说明                                                              |
| ---------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `data`                       | `TData[]`                                                       | `[]`                                                               | 表格数据源                                                        |
| `columns`                    | `VTableColumn[]`                                                | `[]`                                                               | 列配置                                                            |
| `rowHeight`                  | `number`                                                        | `undefined`                                                        | 行高，建议设置以优化虚拟滚动表现                                  |
| `rowKey`                     | `string \| number \| ((row) => string \| number)`               | `undefined`                                                        | 行唯一标识                                                        |
| `loading`                    | `boolean`                                                       | `false`                                                            | 是否加载中                                                        |
| `fixedHeader`                | `boolean`                                                       | `true`                                                             | 是否固定表头                                                      |
| `enableSortingRemoval`       | `boolean`                                                       | `true`                                                             | 是否允许取消排序                                                  |
| `bordered`                   | `boolean`                                                       | `false`                                                            | 是否显示边框                                                      |
| `rowSelectionConfig`         | `VTableRowSelectionConfig<TData>`                               | `{ enabled: false }`                                               | 行选择配置                                                        |
| `loadMoreConfig`             | `VTableLoadMoreConfig`                                          | `{ showNoMore: false, noMoreText: '没有更多了' }`                  | 滚动加载更多配置                                                  |
| `paginationConfig`           | `VTablePaginationConfig`                                        | `{ enabled: false, placement: 'right', total: 0, mode: 'server' }` | 分页配置                                                          |
| `treeConfig`                 | `VTableTreeConfig`                                              | `{ enabled: false, childrenKey: 'children', indentSize: 16 }`      | 树形结构配置                                                      |
| `enableExpandRow`            | `boolean`                                                       | `false`                                                            | 是否启用展开行                                                    |
| `enableRowHover`             | `boolean`                                                       | `true`                                                             | 是否启用行 hover 高亮                                             |
| `adaptiveColumnWidth`        | `number`                                                        | `120`                                                              | 自适应列最小宽度                                                  |
| `defaultExpandAllRows`       | `boolean`                                                       | `false`                                                            | 是否默认展开所有行，仅初始化生效                                  |
| `columnResizeMode`           | `'onChange' \| 'onEnd'`                                         | `'onChange'`                                                       | 列宽调整模式                                                      |
| `fixedFooter`                | `boolean`                                                       | `false`                                                            | 是否固定表尾                                                      |
| `themeConfig`                | `VTableThemeConfig`                                             | `{}`                                                               | 自定义主题配置                                                    |
| `defaultCheckboxColumnWidth` | `number`                                                        | `40`                                                               | 默认 checkbox 列宽                                                |
| `defaultExpandColumnWidth`   | `number`                                                        | `42`                                                               | 默认展开列宽                                                      |
| `customRowAttributes`        | `(row, rowIndex) => HTMLAttributes`                             | `() => ({})`                                                       | 自定义行属性                                                      |
| `customHeaderCellAttributes` | `(column, colIndex) => ThHTMLAttributes`                        | `() => ({})`                                                       | 自定义表头单元格属性                                              |
| `customCellAttributes`       | `(row, column, rowIndex, colIndex) => TdHTMLAttributes \| null` | `() => ({})`                                                       | 自定义表体单元格属性，返回 `colspan` 或 `rowspan` 为 `0` 时不渲染 |

## 列配置 `VTableColumn`

| 属性名               | 类型                            | 说明                       |
| -------------------- | ------------------------------- | -------------------------- |
| `columnKey`          | `string`                        | 列唯一 key，同时对应字段名 |
| `columnHeader`       | `string \| VNode \| Function`   | 列头内容                   |
| `columnAlign`        | `'left' \| 'center' \| 'right'` | 列对齐方式                 |
| `columnWidth`        | `number \| string`              | 列宽，支持数字或百分比     |
| `columnEnableSort`   | `boolean`                       | 是否启用排序               |
| `columnEnableFilter` | `boolean`                       | 是否启用筛选               |
| `columnCell`         | `Function`                      | 单元格渲染函数             |
| `columnEnableResize` | `boolean`                       | 是否允许调整列宽           |
| `columnMaxWidth`     | `number`                        | 列最大宽度                 |
| `columnMinWidth`     | `number`                        | 列最小宽度，默认 `50`      |
| `columnChildren`     | `VTableColumn[]`                | 子列，用于表头分组         |

## Events

> 在 Vue 模板中，事件请使用 `kebab-case` 形式监听。

| 事件名                 | 回调参数                                   | 说明                                     |
| ---------------------- | ------------------------------------------ | ---------------------------------------- |
| `table-change`         | `(state: VTableChangeState) => void`       | 表格状态变化时触发，包括分页、排序、筛选 |
| `scroll-to-bottom`     | `() => void`                               | 滚动到底部时触发                         |
| `expanded-rows-change` | `(state: VTableExpandedState) => void`     | 展开行变化时触发                         |
| `column-sizing-change` | `(state: VTableColumnSizingState) => void` | 列宽调整时触发                           |

## Slots

| 插槽名                 | 参数                                                           | 说明                   |
| ---------------------- | -------------------------------------------------------------- | ---------------------- |
| `customHeader`         | `{ columns, table }`                                           | 自定义整个表头         |
| `bodyCell`             | `{ columnKey, column, row, rowIndex }`                         | 自定义单元格内容       |
| `headerCell`           | `{ columnKey, column }`                                        | 自定义表头单元格       |
| `customFilterIcon`     | `{ columnKey, filtered, column }`                              | 自定义筛选图标         |
| `customFilterDropdown` | `{ confirm, reset, setFilterValue, column, filterModelValue }` | 自定义筛选下拉内容     |
| `expandedRowRender`    | `{ row }`                                                      | 自定义展开行内容       |
| `customPopover`        | `{ open, onOpenChange, trigger, content }`                     | 自定义 Popover         |
| `customPagination`     | `{ pageSize, pageIndex, total, onPageChange }`                 | 自定义分页器           |
| `customCheckbox`       | `{ checked, disabled, indeterminate, onCheckedChange }`        | 自定义复选框           |
| `customEmpty`          | `-`                                                            | 自定义空状态           |
| `customLoadingIcon`    | `-`                                                            | 自定义 loading 图标    |
| `customLoadNoMore`     | `-`                                                            | 自定义“没有更多了”区域 |
| `customFooter`         | `-`                                                            | 自定义表尾             |
| `customExpandIcon`     | `{ expand, onExpandChange }`                                   | 自定义展开图标         |

## 实例方法

组件暴露了以下实例能力：

| 方法名            | 类型                                                                    | 说明                                                                                                             |
| ----------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `tanstackTable`   | `Table<TData>`                                                          | TanStack Table 实例                                                                                              |
| `scrollToIndex`   | `(index: number, behavior?: 'auto' \| 'smooth') => void`                | 滚动到指定行                                                                                                     |
| `setEditingState` | `(rowId: string \| number \| null, columnKey?: string \| null) => void` | 设置编辑状态（1. columnKey 为空，则为行编辑 2. columnKey 不为空，则为单元格编辑 3. rowId 传 null，清除编辑状态） |

使用示例：

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import VTable, { type VTableInstance } from '@aimerthyr/virtual-table'

const tableRef = ref<VTableInstance | null>(null)

onMounted(() => {
  tableRef.value?.scrollToIndex(20, 'smooth')
})
</script>

<template>
  <VTable ref="tableRef" :data="data" :columns="columns" />
</template>
```

## 主题配置

`themeConfig` 支持覆盖默认主题配置，主要结构如下：

```ts
type VTableThemeConfig = {
  primaryColor?: string
  header?: {
    color?: string
    backgroundColor?: string
    borderRadius?: number
    splitColor?: string
    headerIconColor?: string
    padding?: number
  }
  body?: {
    color?: string
    backgroundColor?: string
    padding?: number
  }
  border?: {
    borderStyle?: 'solid' | 'dashed'
    borderColor?: string
  }
  rowHoverColor?: string
  zIndex?: {
    pinnedColumn?: number
    fixedHeader?: number
    fixedFooter?: number
  }
}
```

示例：

```vue
<template>
  <VTable
    :data="data"
    :columns="columns"
    :theme-config="{
      primaryColor: '#1677ff',
      header: {
        backgroundColor: '#f5f7fa',
      },
      body: {
        backgroundColor: '#ffffff',
      },
      rowHoverColor: '#f5f7fa',
    }"
  />
</template>
```

## 使用建议

- 大数据量场景下建议始终设置 `row-height`
- 如果需要滚动加载，建议配合 `loading` 与 `scroll-to-bottom` 一起使用，避免重复触发
- 分页模式下，如果是服务端分页，建议在 `table-change` 中统一处理分页、排序、筛选参数
- 如果有树形数据，优先配置 `tree-config`
- 如果需要自定义展开内容，使用 `enable-expand-row` 配合 `expandedRowRender`
- 如果列很多并出现横向滚动，建议配置 `adaptive-column-width`

## 适用场景

- 后台管理系统数据表格
- 大数据量列表渲染
- 需要虚拟滚动优化的业务表格
- 需要可扩展插槽能力的 Vue 3 表格场景

## 开发

```bash
# 安装依赖
pnpm install

# 开发构建
pnpm dev

# 生产构建
pnpm build
```

## 相关链接

- [GitHub](https://github.com/aimerthyr/virtual-table)
- [TanStack Table](https://tanstack.com/table)
- [TanStack Virtual](https://tanstack.com/virtual)

## License

MIT
