import { h, render, type Directive, type VNode } from 'vue'
import VLoadingComponent from './index.vue'

export type LoadingSize = 'small' | 'default' | 'large'

export type LoadingDirectiveOptions =
  | boolean
  | {
      spinning: boolean
      size?: LoadingSize
      /** 自定义 loading 图标 */
      indicator?: VNode[]
      bottom?: number
    }

type LoadingNode = {
  vNode: VNode | null
  element: HTMLElement | null
}

type LoadingElement = HTMLElement & {
  _loadingNode?: LoadingNode
  _loadingOptions?: LoadingDirectiveOptions
}

/** 创建 Loading 模板 */
const createLoadingTpl = (el: LoadingElement, options: LoadingDirectiveOptions = true) => {
  // 如果已存在并未变化，直接返回
  if (el._loadingNode && JSON.stringify(el._loadingOptions) === JSON.stringify(options)) return

  destroyLoadingTpl(el)

  // 创建容器
  const container = document.createElement('div')
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  container.style.right = '0'
  container.style.bottom = typeof options === 'boolean' ? '0' : `${options.bottom || 0}px`
  container.style.zIndex = '1000'

  // 创建 VNode
  const props = typeof options === 'boolean' ? {} : { size: options.size }
  const indicator = typeof options !== 'boolean' ? options.indicator : undefined

  const vNode = indicator
    ? h(VLoadingComponent, props, () => indicator)
    : h(VLoadingComponent, props)

  render(vNode, container)

  // 确保父元素有定位
  const currentPosition = getComputedStyle(el).position
  if (!['relative', 'absolute', 'fixed'].includes(currentPosition)) {
    el.style.position = 'relative'
  }

  el.appendChild(container)
  el._loadingNode = { vNode, element: container }
  el._loadingOptions = options
}

/** 销毁 Loading 组件 */
const destroyLoadingTpl = (el: LoadingElement) => {
  const loadingNode = el._loadingNode
  if (loadingNode) {
    render(null, loadingNode.element!)
    if (el.contains(loadingNode.element!)) {
      el.removeChild(loadingNode.element!)
    }
    delete el._loadingNode
    delete el._loadingOptions
  }
}

/** 判断是否应该显示 loading */
const shouldShowLoading = (value: LoadingDirectiveOptions): boolean => {
  return typeof value === 'boolean' ? value : value.spinning
}

/** v-loading 指令 */
const vLoading: Directive<LoadingElement, LoadingDirectiveOptions> = {
  mounted(el, binding) {
    if (shouldShowLoading(binding.value)) {
      createLoadingTpl(el, binding.value)
    }
  },
  updated(el, binding) {
    if (shouldShowLoading(binding.value)) {
      createLoadingTpl(el, binding.value)
    } else {
      destroyLoadingTpl(el)
    }
  },
  unmounted(el) {
    destroyLoadingTpl(el)
  },
}

export default vLoading
