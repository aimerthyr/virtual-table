<template>
  <div ref="referenceRef" class="popover-trigger" @click="props.onOpenChange(!props.open)">
    <slot />
  </div>

  <Teleport to="body">
    <Transition name="popover-fade">
      <div v-if="open" ref="floatingRef" :style="floatingStyles" class="popover-content">
        <slot name="content" />
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { VNode } from 'vue'
import { flip, offset, shift, useFloating, type Placement } from '@floating-ui/vue'

defineOptions({ name: 'VPopover' })

defineSlots<{
  default: () => VNode
  content: () => VNode
}>()

const props = withDefaults(
  defineProps<{ open?: boolean; onOpenChange?: (value: boolean) => void; placement?: Placement }>(),
  {
    open: false,
    placement: 'bottom-start',
    onOpenChange: () => {},
  },
)

const referenceRef = ref<HTMLElement | null>(null)
const floatingRef = ref<HTMLElement | null>(null)

const crossAxisOffset = computed(() => {
  const placement = props.placement
  if (placement.includes('-start')) return -12
  if (placement.includes('-end')) return 12
  return 0
})

const { floatingStyles } = useFloating(referenceRef, floatingRef, {
  placement: computed(() => props.placement),
  middleware: [
    offset({
      mainAxis: 12,
      crossAxis: crossAxisOffset.value,
    }),
    flip(),
    shift({ padding: 8 }),
  ],
})

const handleClickOutside = (e: MouseEvent) => {
  if (!props.open) return
  const target = e.target as Node
  if (
    referenceRef.value &&
    floatingRef.value &&
    !referenceRef.value.contains(target) &&
    !floatingRef.value.contains(target)
  ) {
    props.onOpenChange(false)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.popover-trigger {
  display: inline-block;
}

.popover-content {
  z-index: 1050;
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
