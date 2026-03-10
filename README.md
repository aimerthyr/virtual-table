# virtual-table

`virtual-table` 是一个基于 `pnpm workspace` 的 Vue 3 虚拟表格组件仓库，包含组件源码包与文档演示站点。

## 项目简介

仓库当前主要包含两部分：

- `packages/table`：可发布的表格组件包 `@aimerthyr/virtual-table`
- `docs`：基于 Vite 的文档与示例站点，用于本地调试和线上演示

组件包聚焦中大数据量场景，提供虚拟滚动、排序、筛选、分页、树形数据、展开行、固定表头、固定列、列宽调整、自定义插槽、主题配置等能力。

## 在线文档

- 文档地址：[https://aimerthyr.github.io/virtual-table/](https://aimerthyr.github.io/virtual-table/)
- 组件包说明：[`packages/table/README.md`](./packages/table/README.md)

## 仓库结构

```text
virtual-table
├─ packages
│  └─ table                # 组件源码、构建配置、发包内容
├─ docs                    # 文档站、示例页、API 展示
├─ package.json            # 根脚本与工程级依赖
├─ pnpm-workspace.yaml     # workspace 配置
└─ eslint.config.js        # 代码规范配置
```

## 技术栈

| 模块     | 技术                                 |
| -------- | ------------------------------------ |
| 组件开发 | Vue 3、TypeScript                    |
| 表格能力 | TanStack Table                       |
| 虚拟滚动 | TanStack Virtual                     |
| 构建工具 | Vite                                 |
| 文档站   | Vue 3 + Vite                         |
| 代码规范 | ESLint、Prettier、Husky、lint-staged |

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动文档站

```bash
pnpm dev
```
