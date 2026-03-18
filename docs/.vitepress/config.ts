import { defineConfig } from 'vitepress'

const isDev = process.argv.includes('dev')

const sharedThemeConfig = {
  logo: '/logo.svg',
  outline: { level: 3 },
  socialLinks: [
    { icon: 'github', link: 'https://github.com/aimerthyr/virtual-table' },
    {
      icon: 'juejin',
      link: 'https://juejin.cn/post/7616654151096483883',
    },
  ],
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'VTable',
  base: isDev ? '/' : '/virtual-table/',
  outDir: './dist',
  description:
    'VTable 是一个基于 Vue 3 的高性能虚拟滚动表格组件，支持大数据量渲染、表头筛选、灵活配置，适用于后台管理与数据密集型业务场景。',
  themeConfig: sharedThemeConfig,
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      themeConfig: {
        outline: { level: 3, label: '大纲' },
        returnToTopLabel: '返回顶部',
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色主题',
        darkModeSwitchTitle: '切换到深色主题',
        sidebarMenuLabel: '菜单',
        docFooter: { prev: '上一页', next: '下一页' },
        nav: [
          { text: '指南', link: '/guide' },
          { text: '示例', link: '/examples/', activeMatch: '/examples/' },
          { text: '参考', link: '/api' },
        ],
        sidebar: {
          '/examples/': [
            { text: '基础示例', link: '/examples/' },
            { text: '综合示例', link: '/examples/comprehensive' },
          ],
        },
        lastUpdated: {
          text: '最后更新时间',
          formatOptions: {
            forceLocale: true,
          },
        },
      },
    },
    es: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/es/guide' },
          { text: 'Examples', link: '/es/examples/', activeMatch: '/es/examples/' },
          { text: 'Reference', link: '/es/api' },
        ],
        sidebar: {
          '/es/examples/': [
            { text: 'Basic Examples', link: '/es/examples/' },
            { text: 'Comprehensive Examples', link: '/es/examples/comprehensive' },
          ],
        },
        lastUpdated: {
          formatOptions: {
            forceLocale: true,
          },
        },
      },
    },
  },
  vite: {
    ssr: {
      noExternal: ['ant-design-vue', '@ant-design/icons-vue'],
    },
  },
  lastUpdated: true,
})
