import DefaultTheme from 'vitepress/theme'
import './custom.css'
// 引入 Element Plus
import 'element-plus/dist/index.css'
// 引入 vxe Table
import 'vxe-table/lib/style.css'
import { VxeColgroup, VxeColumn, VxeGrid, VxeTable, VxeToolbar } from 'vxe-table'

function lazyVxeTable(app) {
  app.use(VxeTable)
  app.use(VxeColumn)
  app.use(VxeColgroup)
  app.use(VxeGrid)
  app.use(VxeToolbar)
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    lazyVxeTable(app)
  },
}
