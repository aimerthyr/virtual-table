import type { VNode } from 'vue'

/**
 * Checkbox 自定义组件接口定义
 */
export interface VTableCheckboxProps {
  /** 是否选中 */
  checked: boolean
  /** 是否禁用 */
  disabled: boolean
  /** 是否半选状态 */
  indeterminate: boolean
  /** 选中状态变化回调（需要直接拿到事件对象） */
  onCheckedChange: (e: Event) => void
}

/**
 * Popover 自定义组件接口定义
 */
export interface VTablePopoverProps {
  /** 是否显示 */
  open: boolean
  /** 显示状态变化回调 */
  onOpenChange: (value: boolean) => void
  /** 触发区域 */
  trigger: () => VNode
  /** 下拉内容 */
  content: () => VNode
}

/**
 * Pagination 自定义组件接口定义
 */
export interface VTablePaginationProps {
  /** 每页条数 */
  pageSize: number
  /** 当前页码 */
  pageIndex: number
  /** 总条数 */
  total: number
  /** 页码变化回调 */
  onPageChange: (pageIndex: number, pageSize: number) => void
}

/** 展开图标自定义组件接口定义 */
export interface VTableExpandIconProps {
  expand: boolean
  onExpandChange: () => void
}
