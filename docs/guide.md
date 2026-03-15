---
title: 指南
---

# VTable 虚拟表格

基于 TanStack Table 和 TanStack Virtual 构建的高性能虚拟滚动表格组件，支持大数据量渲染、排序、筛选、分页、拖拽、树形结构、可展开、可选择等功能。

### 特性

🚀 虚拟滚动 - 支持百万级数据流畅渲染<br/>
📊 丰富功能 - 排序、筛选、分页、行选择、列固定<br/>
🌲 树形结构 - 支持树形数据展示和自定义展开行<br/>
🎨 高度定制 - 支持自定义单元格、表头、主题配置、以及内置的复选框、分页器均可替换<br/>
📱 响应式 - 自适应列宽，支持列拖拽调整<br/>
🔧 TypeScript - 完整的类型定义<br/>

### 安装

第一步

```bash
npm install @aimerthyr/virtual-table
```

第二步

```ts
// 在 main.ts 中引入样式文件
import '@aimerthyr/virtual-table/virtual-table.css'
```

### 快速开始

```vue
<template>
  <VTable :data="data" :columns="columns" />
</template>

<script setup lang="ts">
import VTable from '@aimerthyr/virtual-table'

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
```
