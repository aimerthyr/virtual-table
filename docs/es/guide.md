---
title: Guide
---

# VTable Virtual Table

A high-performance virtual scrolling table component built with TanStack Table and TanStack Virtual, supporting large data volume rendering, sorting, filtering, pagination, column resizing by drag, tree structure, expandable, and selectable features.

### Features

🚀 Virtual scrolling - Support million-level data smooth rendering<br/>
📊 Rich features - Sorting, filtering, pagination, row selection, column fixed<br/>
🌲 Tree structure - Support tree data display and custom expandable rows<br/>
🎨 Highly customizable - Support custom cells, headers, theme configuration, and built-in checkboxes, paginators can be replaced<br/>
📱 Responsive - Adaptive column width, support column drag adjustment<br/>
🔧 TypeScript - Complete type definition<br/>

### Installation

First step

```bash
npm install @aimerthyr/virtual-table
```

Second step

```ts
// Import the style file in main.ts
import '@aimerthyr/virtual-table/virtual-table.css'
```

### Quick Start

```vue
<template>
  <VTable :data="data" :columns="columns" />
</template>

<script setup lang="ts">
import VTable from '@aimerthyr/virtual-table'

const data = ref([
  { id: 1, name: 'John Doe', age: 28, address: 'Beijing Chaoyang District' },
  { id: 2, name: 'Jane Smith', age: 32, address: 'Shanghai Pudong New Area' },
  { id: 3, name: 'Mike Johnson', age: 25, address: 'Guangzhou Tianhe District' },
])

const columns: VTableColumn[] = [
  { columnKey: 'id', columnHeader: 'ID', columnWidth: 80 },
  { columnKey: 'name', columnHeader: 'Name', columnWidth: 120 },
  { columnKey: 'age', columnHeader: 'Age', columnWidth: 100, columnAlign: 'center' },
  { columnKey: 'address', columnHeader: 'Address' },
]
</script>
```

### Register global components

**First way (recommended)**

```bash
npm install -D unplugin-vue-components
```

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      // ...other configurations
      resolvers: [
        (name: string) => {
          if (name === 'VTable') {
            return {
              name: 'VTable',
              from: '@aimerthyr/virtual-table',
            }
          }
        },
      ],
    }),
  ],
})
```

Second way

```ts
// main.ts
import VTable from '@aimerthyr/virtual-table'

const app = createApp(App)
app.component('VTable', VTable)
```

```ts
// Create a components.d.ts file in the root directory
export {}
declare module 'vue' {
  export interface GlobalComponents {
    // ...other global components
    VTable: (typeof import('@aimerthyr/virtual-table'))['VTable']
  }
}
```
