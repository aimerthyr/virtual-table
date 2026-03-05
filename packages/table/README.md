# @aimerthyr/virtual-table

高性能 Vue 3 虚拟滚动表格组件，基于 TanStack Table 和 TanStack Virtual 构建。

## 特性

- ✨ 虚拟滚动，支持大数据量渲染
- 🎯 完整的表格功能：排序、筛选、分页、树结构、可展开、可选择、固定列、拖拽列等
- 🎨 灵活的样式定制
- 📦 TypeScript 支持
- 🚀 高性能，基于 TanStack 生态

## 安装

```bash
# pnpm
pnpm add @aimerthyr/virtual-table

# npm
npm install @aimerthyr/virtual-table

# yarn
yarn add @aimerthyr/virtual-table
```

### 基础用法

```vue
<script setup lang="ts">
import { VirtualTable } from '@aimerthyr/virtual-table'
import '@aimerthyr/virtual-table/virtual-table.css'

const columns = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: '姓名', columnWidth: 150 },
  { columnKey: 'age', columnHeader: '年龄', columnWidth: 100 },
]

const data = [
  { id: 1, name: '张三', age: 25 },
  { id: 2, name: '李四', age: 30 },
  // ... 更多数据
]
</script>

<template>
  <VirtualTable :columns="columns" :data="data" />
</template>
```

### 启用排序和筛选

```vue
<script setup lang="ts">
const columns = [
  {
    columnKey: 'name',
    columnHeader: '姓名',
    columnWidth: 150,
    columnEnableSort: true,
    columnEnableFilter: true,
  },
  // ...
]
</script>

<template>
  <VirtualTable :columns="columns" :data="data" />
</template>
```

### 自定义单元格

```vue
<template>
  <VirtualTable :columns="columns" :data="data">
    <template #cell-name="{ row }">
      <strong>{{ row.original.name }}</strong>
    </template>
  </VirtualTable>
</template>
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## License

MIT © [aimerthyr](https://github.com/aimerthyr)

## 相关链接

- [GitHub](https://github.com/aimerthyr/virtual-table)
- [TanStack Table](https://tanstack.com/table)
- [TanStack Virtual](https://tanstack.com/virtual)
