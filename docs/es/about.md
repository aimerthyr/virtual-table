---
title: About
---

# About VTable

### Common Issues

**1. The table state is abnormal, such as the expansion or selection is abnormal?**

Please check if the `rowKey` property is configured, if configured, please ensure that the value of `rowKey` is unique, otherwise the table state may be abnormal.

**2. The position of a row is not accurate or the table scrolls abnormally?**

Please check if the `rowHeight` property is set, if set, please ensure that the value of `rowHeight` is correct, otherwise the position of a row may not be accurate. <span style="color:#ff4d4f;">Important: Do not set line height if your lines are not fixed (e.g., text that can wrap to the next line)</span>

**3. It is recommended to use the `bodyCell` slot instead of the `customCell` function in the `column`**

The reason is that bodyCell internally does caching processing, which can avoid unnecessary cell redrawing, while the customCell function will be called repeatedly.

**4. How to set the content width of the table to adapt**

You can set the `maxTableWidth` property to `max-content` , so that the content of each column will adapt to its own column width, without wrapping. (in other cases, the table will wrap the display of each column).

**5. The problem of multiple triggers of scroll loading**

You need to pass in the `loading` state, which is used to control the problem of frequent triggers.

**6. The pagination component cannot be displayed?**

The display of the pagination component depends on two values `paginationConfig.enabled` and `paginationConfig.total`, both must be set to display.

**7. When setting the pagination state, both properties must be passed in**

```vue
// Incorrect passing ❌
<VTable :default-pagination="{ pageSize: 5 }"></VTable>

// Correct passing ✅
<VTable :default-pagination="{ pageSize: 5, pageIndex: 1 }"></VTable>
```

**8. How to customize the secondary encapsulation of the built-in components such as `checkbox` `pagination`?**

The following code is a secondary encapsulation inside the company (simplified processing, but the basic logic is enough)

```vue
<template>
  <VirtualTable :ref="componentRef" class="custom-table" v-bind="computedProps">
    <template v-for="(_, name) in computedSlots" #[name]="slotProps">
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
const computedSlots = computed<VTableSlots<TData>>(() => {
  const {
    /* eslint-disable */
    customFilterDropdown,
    customFilterIcon,
    customPopover,
    customCheckbox,
    customPagination,
    customEmpty,
    customSorterIcon,
    /* eslint-enable */
    ...rest
  } = slots
  return rest
})
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
