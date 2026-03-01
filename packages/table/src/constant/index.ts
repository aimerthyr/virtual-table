import type { CSSProperties } from 'vue'

/** checkbox 选择列 */
export const CHECKBOX_COLUMN_KEY = 'CHECKBOX_COLUMN_KEY'
/** 展开列 */
export const EXPAND_COLUMN_KEY = 'EXPAND_COLUMN_KEY'
/** 是否是展开行 */
export const EXPAND_ROW_KEY = '_isExpandRow'
/** data 中 展开子行的数据属性 */
export const EXPAND_ROW_DATA_INDEX = '_expandChildren'

export const TABLE_DEFAULT_STYLE: CSSProperties = {
  padding: '12px',
  minWidth: '0px',
}
