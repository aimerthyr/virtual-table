<template>
  <div class="pagination">
    <!-- 总数显示 -->
    <span v-if="showTotal" class="pagination-total">共 {{ total }} 条</span>

    <!-- 页码列表 -->
    <ul class="pagination-list">
      <!-- 上一页 -->
      <li
        :class="['pagination-item', 'pagination-prev', { 'pagination-disabled': current === 1 }]"
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
            'pagination-item-active': page === current,
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
          { 'pagination-disabled': current === totalPages },
        ]"
        @click="handleNext"
      >
        <ArrowIcon direction="right" />
      </li>
    </ul>

    <!-- 每页条数选择器 -->
    <div v-if="showSizeChanger" class="pagination-size-changer">
      <VSelect v-model="currentPageSize" :options="pageSizeOptions" />
      <span class="pagination-size-text">条/页</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArrowIcon from '../icons/ArrowIcon.vue'
import VSelect from './VSelect.vue'

defineOptions({ name: 'Pagination' })

const props = withDefaults(
  defineProps<{
    total: number // 总条数
    pageSize?: number // 每页条数
    current?: number // 当前页码
    showTotal?: boolean // 是否显示总数
    showSizeChanger?: boolean // 是否显示每页条数选择器
    pageSizeOptions?: number[] // 每页条数选项
    onChange?: (page: number, pageSize: number) => void
  }>(),
  {
    pageSize: 10,
    current: 1,
    showTotal: true,
    showSizeChanger: true,
    pageSizeOptions: () => [10, 20, 50, 100],
    onChange: () => {},
  },
)

const emit = defineEmits<{
  'update:current': [value: number]
  'update:pageSize': [value: number]
  change: [page: number, pageSize: number]
}>()

const currentPage = computed({
  get: () => props.current,
  set: (val) => emit('update:current', val),
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val) => {
    emit('update:pageSize', val as number)
    // 切换 pageSize 时回到第一页
    currentPage.value = 1
    emit('change', 1, val as number)
    props.onChange?.(1, val as number)
  },
})

// 总页数
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

// 生成页码列表（最多显示 7 个页码）
const pageList = computed(() => {
  const pages: (number | string)[] = []
  const total = totalPages.value
  const current = currentPage.value

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

// 每页条数选项
const pageSizeOptions = computed(() =>
  props.pageSizeOptions.map((size) => ({
    label: `${size}`,
    value: size,
  })),
)

// 上一页
const handlePrev = () => {
  if (currentPage.value > 1) {
    handlePageChange(currentPage.value - 1)
  }
}

// 下一页
const handleNext = () => {
  if (currentPage.value < totalPages.value) {
    handlePageChange(currentPage.value + 1)
  }
}

// 切换页码
const handlePageChange = (page: number) => {
  if (page === currentPage.value) return
  currentPage.value = page
  emit('change', page, props.pageSize)
  props.onChange?.(page, props.pageSize)
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
  border-color: #40a9ff;
  color: #40a9ff;
}

.pagination-item-active {
  font-weight: 600;
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
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
