import { defaultThemeConfig } from '../constant'
import type { VTableThemeConfig } from '../interface'

/** 主题配置 */
export function useTheme(config: VTableThemeConfig) {
  // 合并用户配置和默认配置
  const themeConfig = computed<VTableThemeConfig>(() => {
    return {
      primaryColor: config?.primaryColor || defaultThemeConfig.primaryColor,
      header: {
        ...defaultThemeConfig.header,
        ...config?.header,
      },
      body: {
        ...defaultThemeConfig.body,
        ...config?.body,
      },
      rowHoverColor: config?.rowHoverColor || defaultThemeConfig.rowHoverColor,
      border: {
        ...defaultThemeConfig.border,
        ...config?.border,
      },
    }
  })

  const cssVariables = computed(() => {
    const config = themeConfig.value

    return {
      // 主色
      '--v-table-primary-color': config.primaryColor,

      // 表头样式变量
      '--v-table-header-color': config.header?.color,
      '--v-table-header-bg': config.header?.backgroundColor,
      '--v-table-header-border-radius': `${config.header?.borderRadius}px`,
      '--v-table-header-split-color': config.header?.splitColor,
      '--v-table-header-padding': `${config.header?.padding}px`,
      '--v-table-header-icon-color': config.header?.headerIconColor,

      // 表体样式变量
      '--v-table-body-color': config.body?.color,
      '--v-table-body-bg': config.body?.backgroundColor,
      '--v-table-body-padding': `${config.body?.padding}px`,

      // 行 hover 颜色
      '--v-table-row-hover-color': config.rowHoverColor,

      // 边框样式变量
      '--v-table-border-style': config.border?.borderStyle,
      '--v-table-border-color': config.border?.borderColor,
    }
  })

  return {
    cssVariables,
  }
}
