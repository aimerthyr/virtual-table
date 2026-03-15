---
title: 基础示例
---

# VTable 示例

展示 VTable 组件的各种使用场景和功能特性，每个示例都可以独立运行和复制。

<script setup>
import BasicExample from '../components/BasicExample.vue'
import CellMergeExample from '../components/CellMergeExample.vue'
import ColumnResizeExample from '../components/ColumnResizeExample.vue'
import CustomSlotExample from '../components/CustomSlotExample.vue'
import CustomTheme from '../components/CustomTheme.vue'
import ExpandableExample from '../components/ExpandableExample.vue'
import FixedColumnsExample from '../components/FixedColumnsExample.vue'
import FixedHeaderExample from '../components/FixedHeaderExample.vue'
import PaginationExample from '../components/PaginationExample.vue'
import RowSelectionExample from '../components/RowSelectionExample.vue'
import SortFilterExample from '../components/SortFilterExample.vue'
import TreeDataExample from '../components/TreeDataExample.vue'
</script>

### 基础用法

最简单的表格用法，展示基本的数据渲染。

::: raw
<BasicExample />
:::

### 固定表头/表体

表头固定，内容区域可滚动，适合数据量较大的场景。

::: raw
<FixedHeaderExample  />
:::

### 行选择

支持多选、单选、禁用选择等功能。

::: raw
<RowSelectionExample  />
:::

### 排序和筛选

支持列排序和自定义筛选功能。

::: raw
<SortFilterExample />
:::

### 分页

支持分页功能，可以设置分页器的位置、模式等。

::: raw
<PaginationExample />
:::

### 树形数据

支持树形数据展示和自定义展开行。

::: raw
<TreeDataExample />
:::

### 可展开行

支持可展开行功能，可以设置展开行的折叠状态。

::: raw
<ExpandableExample />
:::

### 固定列

支持固定列功能，可以设置固定列的位置、模式等。

::: raw
<FixedColumnsExample />
:::

### 列宽调整

支持列宽调整功能，可以设置列宽的调整模式等。

::: raw
<ColumnResizeExample />
:::

### 单元格合并

支持单元格合并功能，可以设置单元格的合并模式等。

::: raw
<CellMergeExample />
:::

### 自定义 Slot

支持自定义 Slot 功能，可以设置自定义 Slot 的渲染方式等。

::: raw
<CustomSlotExample />
:::

### 自定义主题

支持自定义主题功能，可以设置主题的样式等。

::: raw
<CustomTheme />
:::
