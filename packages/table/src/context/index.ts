import type { InjectionKey } from 'vue'

// 暂时用不着，后续可能会用， 所以先留着
//  eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface VTableContext {}

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
