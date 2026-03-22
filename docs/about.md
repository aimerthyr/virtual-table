---
title: 关于
---

# 关于 VTable

### 常见问题

**1. 表格状态异常，例如展开或者选择异常？**
请检查是否配置了 rowKey 属性，如果配置了，请确保 rowKey 的值是唯一的，否则可能会出现表格状态异常的情况。

**2. 滚动到某一行位置不精确或者表格滚动异常？**

请检查是否设置了 `rowHeight` 属性，如果设置了，请确保 `rowHeight` 的值是正确的，否则可能会出现滚动到某一行位置不精确的情况。

**3. 优先推荐使用 `bodyCell` 插槽，而不是 `column` 中 `customCell` 函数**

原因是 bodyCell 内部做了缓存处理，可以避免不必要的单元格重绘，而 customCell 函数则会每次都重新调用。

**4. 滚动加载多次触发的问题**

你需要传入 `loading` 状态，用于控制频繁触发的问题

**5. 表格无法显示分页器？**

分页器的显示与否，取决于两个值 `paginationConfig.enabled` 和 `paginationConfig.total`，二者同时设置才会显示

**6. 设置分页状态时，务必两个属性均要传入**

```vue
// 错误传递 ❌
<VTable :default-pagination="{ pageSize: 5 }"></VTable>

// 正确传递 ✅
<VTable :default-pagination="{ pageSize: 5, pageIndex: 1 }"></VTable>
```

**6. 如何自定义 `checkbox` `pagination` 等内置组件做二次封装？**

下面代码是笔者公司内部的二次封装（做了简化处理，不过大致逻辑已经够了）

```vue
<template>
  <VirtualTable :ref="componentRef" class="custom-table" v-bind="computedProps">
    <template v-for="(_, name) in slots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps" />
    </template>

    <template #customPopover="{ open, onOpenChange, trigger, content }">
      <component
        :is="
          h(
            Popover,
            {
              open,
              onOpenChange,
              placement: 'bottomLeft',
              trigger: 'click',
              overlayInnerStyle: { padding: 0 },
              arrow: false,
            },
            { default: trigger, content },
          )
        "
      />
    </template>
    <template #customCheckbox="{ checked, indeterminate, disabled, onCheckedChange }">
      <a-checkbox
        :checked="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        @change="onCheckedChange($event as any)"
        @click.stop
      />
    </template>
    <template #customPagination="{ pageIndex, pageSize, total, onPageChange }">
      <a-pagination
        class="pr-24"
        :current="pageIndex"
        :page-size="pageSize"
        :total="total"
        v-bind="props.paginationConfig.paginationExtraProps"
        @change="onPageChange"
      />
    </template>
    <template #customEmpty>
      <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" />
    </template>
    <template #customSorterIcon="{ sort }">
      <SorterIcon :sort="sort" />
    </template>
  </VirtualTable>
</template>

<script setup lang="ts" generic="TData extends VTableData">
import { h } from 'vue'
import { commonThemeRGB } from '@/const/theme'
import { deepAssign } from '@/utils/object'
import VirtualTable, {
  vTableDefaultProps,
  type VTableData,
  type VTableInstance,
  type VTableProps,
  type VTableSlots,
} from '@aimerthyr/virtual-table'
import { Empty, Popover } from 'ant-design-vue'

defineOptions({
  name: 'VTable',
})

// #region 属性定义
// eslint-disable-next-line vue/no-unused-properties, vue/prop-name-casing
const props = withDefaults(defineProps<VTableProps<TData>>(), {
  ...vTableDefaultProps,
})
const computedProps = computed<VTableProps<TData>>(() => {
  return {
    ...props,
    themeConfig: deepAssign(
      {
        primaryColor: `rgb(${commonThemeRGB.colorPrimaryRGB})`,
        header: {
          backgroundColor: '#fff',
        },
      },
      props.themeConfig as any,
    ),
  }
})
// #endregion

// #region 插槽定义
const slots = defineSlots<VTableSlots<TData>>()
// #endregion

// #region 实例定义
const vm = getCurrentInstance()
const componentRef = (instance: any) => {
  vm!.exposeProxy = vm!.exposed = instance || {}
}
defineExpose({} as VTableInstance)
// #endregion
</script>

<style lang="less" scoped>
.custom-table {
  :deep(.v-table-header tr) {
    th.checkbox-col {
      padding-right: 0;
      text-align: right !important;
    }
    th:last-child {
      padding-right: 24px;
    }
  }
  :deep(.v-table-body tr) {
    td.checkbox-col {
      padding-right: 0;
      text-align: right !important;
    }
    td:last-child {
      padding-right: 24px;
    }
  }
}
</style>
```
