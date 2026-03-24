# @aimerthyr/virtual-table

English | [简体中文](./README.md)

A high-performance virtualized table component for Vue 3, built on TanStack Table and TanStack Virtual.

## Overview

`@aimerthyr/virtual-table` is a Vue 3 table component designed for medium-to-large datasets. It provides virtual scrolling, sorting, filtering, pagination, tree data, expandable rows, row selection, sticky header, pinned columns, column resizing, and rich TypeScript types & slots for extensibility.

## Features

- Virtual scrolling for large datasets
- Sorting / filtering / pagination
- Tree data / expandable rows / row selection
- Sticky header / pinned columns / column resizing
- Custom cell / filter / pagination / theme via slots and props
- Built with Vue 3 Composition API + TypeScript
- Powered by TanStack Table + TanStack Virtual

## Website

Online demo: [https://aimerthyr.github.io/virtual-table/](https://aimerthyr.github.io/virtual-table/)

## Install

```bash
# pnpm
pnpm add @aimerthyr/virtual-table

# npm
npm install @aimerthyr/virtual-table

# yarn
yarn add @aimerthyr/virtual-table
```

## Requirements

- `vue >= 3.5.0`

## Quick Start

```ts
// Import styles in main.ts
import '@aimerthyr/virtual-table/virtual-table.css'
```

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VTable, { type VTableColumn } from '@aimerthyr/virtual-table'
import '@aimerthyr/virtual-table/virtual-table.css'

const data = ref([
  { id: 1, name: 'Alice', age: 28, address: 'Beijing' },
  { id: 2, name: 'Bob', age: 32, address: 'Shanghai' },
  { id: 3, name: 'Carol', age: 25, address: 'Guangzhou' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: 'Name', columnWidth: 120 },
  { columnKey: 'age', columnHeader: 'Age', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: 'Address' },
]
</script>

<template>
  <!-- Recommended: set row-height for more stable virtualization -->
  <VTable :data="data" :columns="columns" :row-height="44" bordered />
</template>
```

## Import

```ts
import VTable from '@aimerthyr/virtual-table'
```

Or:

```ts
import { VTable } from '@aimerthyr/virtual-table'
```

## CDN Usage

You can also use the UMD build directly in the browser:

```html
<link rel="stylesheet" href="https://unpkg.com/@aimerthyr/virtual-table/dist/virtual-table.css" />
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/@aimerthyr/virtual-table/dist/index.umd.js"></script>
<script>
  // UMD global name comes from vite lib.name = 'VirtualTable'
  const VTable = window.VirtualTable.default || window.VirtualTable
</script>
```

## Documentation

For the complete API (props / slots / examples), please refer to:

- Website: `https://aimerthyr.github.io/virtual-table/`
- Chinese README: [`./README.md`](./README.md)
