import type { InjectionKey } from 'vue'
import type { VTableProps } from '../interface'

export interface VTableContext {
  tableProps: VTableProps
}

const VTableContextKey: InjectionKey<VTableContext> = Symbol('vTableContextKey')

export const useProvideVTableContext = (context: VTableContext) => {
  provide(VTableContextKey, context)
}

export const useInjectVTableContext = (): VTableContext => {
  const context = inject<VTableContext>(VTableContextKey)
  if (!context) {
    throw new Error('useInjectVTableContext 必须使用在子组件！')
  }
  return context
}
