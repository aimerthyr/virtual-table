import js from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'
// 导入自动生成的全局变量配置
import docsAutoImportGlobals from './docs/.eslintrc-auto-import.json' with { type: 'json' }
import tableAutoImportGlobals from './packages/table/.eslintrc-auto-import.json' with { type: 'json' }

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.vite/**',
      '**/.vite-temp/**',
      '**/pnpm-lock.yaml',
      // 忽略自动生成的文件
      '**/auto-imports.d.ts',
      '**/.eslintrc-auto-import.json',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettier,
  // 自定义规则
  {
    name: 'custom-rules',
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...docsAutoImportGlobals.globals,
        ...tableAutoImportGlobals.globals,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
          svg: 'never',
          math: 'always',
        },
      ],
    },
  },
)
