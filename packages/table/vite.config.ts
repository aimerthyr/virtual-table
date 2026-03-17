import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue({
      // 优化Vue编译
      template: {
        compilerOptions: {
          // 启用生产优化
          hoistStatic: true,
          cacheHandlers: true,
        },
      },
    }),
    vueJsx(),
    AutoImport({
      imports: ['vue'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
      },
    }),
    dts({
      include: ['src/**/*'],
      outDir: 'dist',
      staticImport: true,
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
        compact: true,
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
    // 清空输出目录
    emptyOutDir: true,
    // 启用压缩
    minify: 'terser',
    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
})
