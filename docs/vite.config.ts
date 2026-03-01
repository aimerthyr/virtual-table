import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'

// 文档站点配置
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue API
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@aimerthyr/virtual-table': resolve(__dirname, '../packages/table/src/index.ts'),
    },
  },
  optimizeDeps: {
    // 排除本地包的预构建
    exclude: ['@aimerthyr/virtual-table'],
  },
})
