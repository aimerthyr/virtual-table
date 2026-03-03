import type { ColumnDef } from '@tanstack/vue-table'
import { isNumber } from 'lodash-es'
import { EXPAND_ROW_DATA_INDEX, EXPAND_ROW_KEY } from '../constant'
import type { VTableColumn, VTableRowKey } from '../interface'

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
    meta: col,
  }))
}

/** 给 data 添加组件内部属性 */
export function buildData<T>(data: T[]) {
  return data.map((v) => ({
    ...v,
    [EXPAND_ROW_DATA_INDEX]: [{ ...v, [EXPAND_ROW_KEY]: true }],
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

/** 遍历对象的 key 生成 hash */
export function simpleHash(obj: any): string {
  let str = ''
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str += `${key}:${obj[key]};`
    }
  }
  return str
}

/** 将 size 转换为实际像素值 */
export function convertSizeToPixels(
  size: number | string | undefined,
  containerWidth: number,
): number {
  if (!size) return 0
  if (isNumber(size)) return size
  // 处理百分比：'20%' -> 实际像素
  if (typeof size === 'string' && size.endsWith('%')) {
    const percentage = parseFloat(size)
    // 使用 Math.round 避免小数精度问题
    return Math.round((containerWidth * percentage) / 100)
  }
  // 处理 px 字符串：'100px' -> 100
  if (typeof size === 'string' && size.endsWith('px')) {
    return Math.round(parseFloat(size))
  }
  return 0
}
