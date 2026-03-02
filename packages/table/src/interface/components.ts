import type { Component } from 'vue'

/**
 * Checkbox 组件接口定义
 */
export interface VTableCheckboxProps {
  /** 是否选中 */
  checked?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 是否半选状态 */
  indeterminate?: boolean
  /** 选中状态变化回调（需要直接拿到事件对象） */
  onCheckedChange?: (e: Event) => void
}

/**
 * Popover 组件接口定义
 */
export interface VTablePopoverProps {
  /** 是否显示 */
  open?: boolean
  /** 显示状态变化回调 */
  onOpenChange?: (value: boolean) => void
}

/**
 * Pagination 组件接口定义
 */
export interface VTablePaginationProps {
  /** 每页条数 */
  pageSize?: number
  /** 当前页码 */
  pageIndex?: number
  /** 总条数 */
  total: number
  /** 页码变化回调 */
  onPageChange?: (pageIndex: number, pageSize: number) => void
}

/**
 * 自定义组件配置
 */
export interface VTableCustomComponentsConfig {
  /** 自定义 Checkbox 组件 */
  Checkbox?: Component<VTableCheckboxProps>
  /** 自定义 Popover 组件 */
  Popover?: Component<VTablePopoverProps>
  /** 自定义 Pagination 组件 */
  Pagination?: Component<VTablePaginationProps>
}
