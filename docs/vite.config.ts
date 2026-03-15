import AutoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/virtual-table/' : '/',
  plugins: [
    // 自动导入 Vue API
    AutoImport({
      imports: ['vue'],
      dts: 'auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
    }),
    Components({
      globs: ['components/**/*.vue'],
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
}))
