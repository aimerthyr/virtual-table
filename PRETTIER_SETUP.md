# Prettier 自动格式化配置指南

## 问题诊断

如果 Prettier 不自动格式化，按以下步骤排查：

## 解决方案

### 1. 安装必需的 VSCode 插件

打开 VSCode 扩展面板，安装以下插件：

| 插件                          | ID                          | 用途              |
| ----------------------------- | --------------------------- | ----------------- |
| **Prettier**                  | `esbenp.prettier-vscode`    | 代码格式化        |
| **ESLint**                    | `dbaeumer.vscode-eslint`    | 代码检查          |
| **Vue - Official**            | `vue.volar`                 | Vue 3 语言支持    |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwind 智能提示 |

### 2. VSCode 配置说明

已在 `.vscode/settings.json` 中配置：

```json
{
  // 全局默认格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,

  // Vue 文件专用配置
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },

  // 保存时自动修复 ESLint 错误
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 3. Prettier 配置文件

`.prettierrc` 配置：

```json
{
  "semi": false, // 不使用分号
  "singleQuote": true, // 使用单引号
  "printWidth": 100, // 每行最大字符数
  "plugins": ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  "importOrder": ["^vue$", "<THIRD_PARTY_MODULES>", "<BUILTIN_MODULES>", "^[.]"]
}
```

### 4. 格式化流程

```
保存文件 (Ctrl/Cmd + S)
    ↓
VSCode 检测到保存事件
    ↓
执行 formatOnSave
    ↓
调用 Prettier 格式化
    ├─ 应用 .prettierrc 规则
    ├─ 排序 import 语句
    └─ 排序 Tailwind 类名
    ↓
执行 codeActionsOnSave
    └─ ESLint 自动修复
    ↓
文件保存完成
```

## 手动格式化

### 方式一：快捷键

| 操作系统          | 快捷键               |
| ----------------- | -------------------- |
| **macOS**         | `Shift + Option + F` |
| **Windows/Linux** | `Shift + Alt + F`    |

### 方式二：命令面板

1. 按 `Cmd/Ctrl + Shift + P`
2. 输入 `Format Document`
3. 回车执行

### 方式三：右键菜单

右键点击编辑器 → 选择 `格式化文档`

## 命令行格式化

### 格式化所有文件

```bash
# 格式化整个项目
pnpm format

# 等同于
prettier --write .
```

### 检查格式（不修改）

```bash
pnpm format:check

# 等同于
prettier --check .
```

### 格式化指定文件

```bash
# 格式化单个文件
prettier --write packages/table/src/Table.vue

# 格式化指定目录
prettier --write "packages/table/src/**/*.{vue,ts,js}"
```

## 常见问题排查

### 问题 1：保存后没有格式化

**检查步骤：**

1. 确认已安装 Prettier 插件

   ```bash
   # VSCode 扩展面板搜索 "Prettier"
   ```

2. 检查 VSCode 输出面板
   - 打开：`View` → `Output`
   - 选择：`Prettier`
   - 查看错误信息

3. 检查文件是否在 `.prettierignore` 中

   ```bash
   cat .prettierignore
   ```

4. 重启 VSCode
   ```bash
   # 命令面板
   Developer: Reload Window
   ```

### 问题 2：格式化后又被 ESLint 改回

**原因：** Prettier 和 ESLint 规则冲突

**解决：** 已安装 `eslint-config-prettier` 禁用冲突规则

```javascript
// eslint.config.js
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  // ...其他配置
  eslintConfigPrettier, // 必须放在最后
]
```

### 问题 3：Vue 文件格式化异常

**检查 Vue 插件：**

1. 卸载旧版 Vetur（如果安装了）
2. 安装 Vue - Official (Volar)
3. 重启 VSCode

### 问题 4：Tailwind 类名没有排序

**检查插件安装：**

```bash
pnpm list prettier-plugin-tailwindcss
```

**确认配置：**

```json
{
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## Git Hooks 自动格式化

项目已配置 Husky + lint-staged，提交代码时自动格式化：

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

### 提交流程

```
git add .
    ↓
git commit -m "message"
    ↓
Husky 触发 pre-commit 钩子
    ↓
lint-staged 处理暂存文件
    ├─ 运行 ESLint 修复
    └─ 运行 Prettier 格式化
    ↓
自动添加修改到暂存区
    ↓
提交成功
```

## 配置验证

### 测试 Prettier 是否工作

创建测试文件：

```vue
<!-- test.vue -->
<template>
  <div class="flex items-center"><span>测试</span></div>
</template>
<script setup>
const test = 1
const name = 'test'
</script>
```

保存后应自动格式化为：

```vue
<template>
  <div class="flex items-center">
    <span>测试</span>
  </div>
</template>

<script setup>
const test = 1
const name = 'test'
</script>
```

## 团队协作建议

### 1. 统一编辑器配置

确保团队成员都使用相同的配置：

```bash
# 提交 .vscode 配置到 Git
git add .vscode/settings.json
git add .vscode/extensions.json
```

### 2. CI/CD 检查

在 GitHub Actions 中添加格式检查：

```yaml
- name: Check code format
  run: pnpm format:check
```

### 3. 文档说明

在 README.md 中添加：

```markdown
## 开发规范

本项目使用 Prettier 进行代码格式化，请确保：

1. 安装推荐的 VSCode 插件
2. 启用保存时自动格式化
3. 提交前运行 `pnpm format`
```

## 总结

| 配置项            | 文件路径                  | 说明             |
| ----------------- | ------------------------- | ---------------- |
| **VSCode 配置**   | `.vscode/settings.json`   | 编辑器格式化设置 |
| **推荐插件**      | `.vscode/extensions.json` | 团队统一插件     |
| **Prettier 规则** | `.prettierrc`             | 格式化规则       |
| **忽略文件**      | `.prettierignore`         | 不格式化的文件   |
| **Git 钩子**      | `.husky/pre-commit`       | 提交前自动格式化 |

配置完成后，保存任何 `.vue` 文件都会自动格式化。
