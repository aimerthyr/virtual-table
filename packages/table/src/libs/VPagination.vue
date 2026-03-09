<template>
  <div class="pagination">
    <!-- 总数显示 -->
    <span class="pagination-total">共 {{ props.total }} 条</span>

    <!-- 页码列表 -->
    <ul class="pagination-list">
      <!-- 上一页 -->
      <li
        :class="[
          'pagination-item',
          'pagination-prev',
          { 'pagination-disabled': props.pageIndex === 1 },
        ]"
        @click="handlePrev"
      >
        <ArrowIcon direction="left" />
      </li>

      <!-- 页码 -->
      <li
        v-for="(page, index) in pageList"
        :key="index"
        :class="[
          'pagination-item',
          {
            'pagination-item-active': page === props.pageIndex,
            'pagination-ellipsis': page === '...',
          },
        ]"
        @click="page !== '...' && handlePageChange(page as number)"
      >
        {{ page }}
      </li>

      <!-- 下一页 -->
      <li
        :class="[
          'pagination-item',
          'pagination-next',
          { 'pagination-disabled': props.pageIndex === totalPages },
        ]"
        @click="handleNext"
      >
        <ArrowIcon direction="right" />
      </li>
    </ul>

    <!-- 每页条数选择器 -->
    <div class="pagination-size-changer">
      <VSelect
        :value="props.pageSize"
        :options="[
          { label: '10', value: 10 },
          { label: '20', value: 20 },
          { label: '50', value: 50 },
          { label: '100', value: 100 },
        ]"
        @select-change="(value) => props.onPageChange?.(1, value as number)"
      />
      <span class="pagination-size-text">条/页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowIcon from '../icons/ArrowIcon.vue'
import type { VTablePaginationProps } from '../interface'
import VSelect from './VSelect.vue'

defineOptions({ name: 'VPagination' })

const props = withDefaults(defineProps<VTablePaginationProps>(), {
  total: 0,
  pageSize: 10,
  pageIndex: 1,
  onPageChange: () => {},
})

// 总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 生成页码列表（最多显示 7 个页码）
const pageList = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = props.pageIndex

  if (total <= 7) {
    // 总页数小于等于 7，全部显示
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于 7，显示省略号
    if (current <= 4) {
      // 当前页靠前：1 2 3 4 5 ... 10
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页靠后：1 ... 6 7 8 9 10
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间：1 ... 4 5 6 ... 10
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 上一页
const handlePrev = () => {
  if (props.pageIndex > 1) {
    handlePageChange(props.pageIndex - 1)
  }
}

// 下一页
const handleNext = () => {
  if (props.pageIndex < totalPages.value) {
    handlePageChange(props.pageIndex + 1)
  }
}

// 切换页码
const handlePageChange = (page: number) => {
  if (page === props.pageIndex) return
  props.onPageChange?.(page, props.pageSize)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.pagination-total {
  margin-right: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.pagination-list {
  display: flex;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pagination-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 30px;
  text-align: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.pagination-item:hover:not(.pagination-disabled):not(.pagination-item-active) {
  border-color: var(--v-table-primary-color);
  color: var(--v-table-primary-color);
}

.pagination-item-active {
  font-weight: 600;
  color: #fff;
  background-color: var(--v-table-primary-color);
  border-color: var(--v-table-primary-color);
  cursor: default;
}

.pagination-disabled {
  color: rgba(0, 0, 0, 0.25);
  background-color: #f5f5f5;
  border-color: #d9d9d9;
  cursor: not-allowed;
}

.pagination-ellipsis {
  border-color: transparent;
  background-color: transparent;
  cursor: default;
  pointer-events: none;
}

.pagination-ellipsis:hover {
  border-color: transparent;
  background-color: transparent;
}

.pagination-prev,
.pagination-next {
  font-size: 12px;
}

.pagination-size-changer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
}

.pagination-size-text {
  color: rgba(0, 0, 0, 0.85);
}
</style>
