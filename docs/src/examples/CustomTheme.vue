<template>
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
    name: `用户${i + 1}`,
    age: 20 + (i % 30),
    email: `user${i + 1}@example.com`,
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
</script>

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
</style>
