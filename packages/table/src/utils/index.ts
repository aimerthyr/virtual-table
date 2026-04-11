import type { VNode } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { VTableColumn, VTableRowKey, VTableSummaryType } from '../interface'

export function convertToColumnDefList<T>(
  columns: VTableColumn[],
  containerWidth: number = 0,
): ColumnDef<T>[] {
  return columns.map((col) => ({
    id: col.columnKey,
    accessorKey: col.columnKey,
    // 将百分比转换为像素值
    size: col.columnWidth ? convertSizeToPixels(col.columnWidth, containerWidth) : undefined,
    header: col.columnHeader,
    cell: col.columnCell,
    enableSorting: col.columnEnableSort,
    enableColumnFilter: col.columnEnableFilter,
    sortDescFirst: true,
    enableResizing: col.columnEnableResize ?? false,
    minSize: col.columnMinWidth ?? 50,
    maxSize: col.columnMaxWidth,
    columns: convertToColumnDefList<T>(col.columnChildren || [], containerWidth),
    meta: col,
  }))
}

/** 获取所有行的 key */
export function getAllRowKeys<TData>(
  data: TData[],
  rowKey: VTableRowKey<TData>,
  childrenKey: string = 'children',
): string[] {
  const keys: string[] = []
  function traverse(items: TData[]) {
    items.forEach((item) => {
      const key = rowKey
        ? typeof rowKey === 'function'
          ? rowKey(item)
          : item[rowKey as keyof TData]
        : (item as any).id
      keys.push(String(key))
      const children = (item as any)[childrenKey]
      if (children?.length) traverse(children)
    })
  }
  traverse(data)
  return keys
}

/** 将 size 转换为实际像素值 */
export function convertSizeToPixels(
  size: number | string | undefined,
  containerWidth: number,
): number {
  if (!size) return 0
  if (isNumeric(size)) return Number(size)
  // 处理百分比：'20%' -> 实际像素
  if (typeof size === 'string' && size.endsWith('%')) {
    const percentage = parseFloat(size)
    return Math.round((containerWidth * percentage) / 100)
  }
  // 处理 px 字符串：'100px' -> 100
  if (typeof size === 'string' && size.endsWith('px')) {
    return Math.round(parseFloat(size))
  }
  return 0
}

export function isNumeric(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false
  }
  const num = Number(value)
  return Number.isFinite(num)
}

/**
 * 是否外部传递了插槽 （仅用于判断透传插槽）
 * 由于存在透传，所以不能单纯直接判断是否有插槽，还需要判断是否有子节点 */
export function hasPassSlot(vNode?: VNode): boolean {
  if (!vNode) return false
  return (
    Array.isArray(vNode.children) && vNode.children.some((child) => child && (child as VNode).type)
  )
}

/**
 * 计算汇总值
 */
export function calculateSummary<TData = any>(
  data: TData[],
  column: VTableColumn,
  summaryType?: VTableSummaryType<TData>,
): any {
  if (!summaryType) return ''
  const columnKey = column.columnKey
  if (typeof summaryType === 'function') {
    return summaryType(data, column)
  }
  switch (summaryType) {
    case 'count':
      return data.length
    case 'sum': {
      const sum = data.reduce((acc, row) => {
        const value = (row as any)[columnKey]
        return acc + (isNumeric(value) ? Number(value) : 0)
      }, 0)
      return sum
    }
    case 'avg': {
      const sum = data.reduce((acc, row) => {
        const value = (row as any)[columnKey]
        return acc + (isNumeric(value) ? Number(value) : 0)
      }, 0)
      return data.length > 0 ? (sum / data.length).toFixed(2) : 0
    }
    case 'max': {
      const values = data
        .map((row) => (row as any)[columnKey])
        .filter((v) => isNumeric(v))
        .map(Number)
      return values.length > 0 ? Math.max(...values) : ''
    }
    case 'min': {
      const values = data
        .map((row) => (row as any)[columnKey])
        .filter((v) => isNumeric(v))
        .map(Number)
      return values.length > 0 ? Math.min(...values) : ''
    }
    default:
      return ''
  }
}
