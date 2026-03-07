/** 表头样式配置 */
export interface VTableHeaderStyle {
  /** 表头字体颜色 */
  color: string
  /** 表头背景颜色 */
  backgroundColor: string
  /** 表头圆角大小 */
  borderRadius: number
  /** 表头分割线颜色 */
  splitColor: string
  /** 表头图标颜色 */
  headerIconColor: string
  /** 表头内边距 */
  padding: number
}

/** 表体样式配置 */
export interface VTableBodyStyle {
  /** 表体字体颜色 */
  color: string
  /** 表体背景颜色 */
  backgroundColor: string
  /** 表体内边距 */
  padding: number
}

/** 边框样式配置 */
export interface VTableBorderStyle {
  /** 边框样式 */
  borderStyle: 'solid' | 'dashed'
  /** 边框颜色 */
  borderColor: string
}

/** 表格主题配置 */
export interface VTableThemeConfig {
  /** 主色 */
  primaryColor?: string
  /** 表头样式 */
  header?: Partial<VTableHeaderStyle>
  /** 表体样式 */
  body?: Partial<VTableBodyStyle>
  /** 边框样式 */
  border?: Partial<VTableBorderStyle>
  /** 行 hover 颜色 */
  rowHoverColor?: string
}
