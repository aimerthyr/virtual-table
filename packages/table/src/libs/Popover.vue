<template>
  <div
    ref="referenceRef"
    class="popover-trigger"
    @click="handleTriggerClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
  </div>

  <Teleport to="body">
    <Transition name="popover-fade">
      <div
        v-if="open"
        ref="floatingRef"
        :style="floatingStyles"
        class="popover-content"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div v-if="arrow" ref="arrowRef" :style="arrowStyle" class="popover-arrow" />
        <slot name="content" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import {
  arrow as floatingArrow,
  offset,
  shift,
  useFloating,
  type Placement,
} from '@floating-ui/vue'

defineOptions({ name: 'Popover' })

const props = withDefaults(
  defineProps<{
    open?: boolean
    trigger?: 'click' | 'hover'
    placement?: Placement
    arrow?: boolean
  }>(),
  {
    open: false,
    trigger: 'click',
    placement: 'bottom',
    arrow: true,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const referenceRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)
const arrowRef = ref<HTMLElement | null>(null)

const crossAxisOffset = computed(() => {
  const placement = props.placement
  if (placement.includes('-start')) return -12
  if (placement.includes('-end')) return 12
  return 0
})

const { floatingStyles, middlewareData } = useFloating(referenceRef, floatingRef, {
  placement: computed(() => props.placement),
  middleware: [
    offset({
      mainAxis: props.arrow ? 8 : 12, // 主轴距离（垂直方向）
      crossAxis: crossAxisOffset.value, // 横向偏移（根据对齐方式动态计算）
    }),
    shift({ padding: 8 }),
    ...(props.arrow ? [floatingArrow({ element: arrowRef, padding: 16 })] : []),
  ],
})

// 箭头样式
const arrowStyle = computed(() => {
  const { x, y } = middlewareData.value.arrow || {}
  const side = props.placement.split('-')[0] as 'top' | 'right' | 'bottom' | 'left'
  const staticSide: Record<string, string> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  }

  return {
    left: x != null ? `${x}px` : '',
    top: y != null ? `${y}px` : '',
    [staticSide[side] as string]: '-4px',
  }
})

const handleTriggerClick = () => {
  if (props.trigger === 'click') {
    emit('update:open', !props.open)
  }
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null
const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    if (hoverTimer) clearTimeout(hoverTimer)
    emit('update:open', true)
  }
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    hoverTimer = setTimeout(() => {
      emit('update:open', false)
    }, 100)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!props.open || props.trigger !== 'click') return
  const target = e.target as Node
  if (
    referenceRef.value &&
    floatingRef.value &&
    !referenceRef.value.contains(target) &&
    !floatingRef.value.contains(target)
  ) {
    emit('update:open', false)
  }
}

onMounted(() => {
  if (props.trigger === 'click') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (props.trigger === 'click') {
    document.removeEventListener('click', handleClickOutside)
  }
  if (hoverTimer) clearTimeout(hoverTimer)
})
</script>

<style scoped>
.popover-trigger {
  display: inline-block;
}

.popover-content {
  z-index: 1050;
  min-width: 120px;
  padding: 12px;
  background: #fff;
  border-radius: 6px;
  box-shadow:
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.popover-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  transform: rotate(45deg);
}

/* 淡入淡出动画 */
.popover-fade-enter-active {
  transition: opacity 0.15s ease;
}

.popover-fade-leave-active {
  transition: opacity 0.1s ease;
}

.popover-fade-enter-from,
.popover-fade-leave-to {
  opacity: 0;
}
</style>
