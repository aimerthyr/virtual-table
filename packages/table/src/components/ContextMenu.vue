<template>
  <Teleport to="body">
    <Transition name="context-menu-fade">
      <div v-if="visible" class="v-table-context-menu-overlay">
        <div ref="floatingRef" class="v-table-context-menu" :style="floatingStyles">
          <slot :context="context" :close="handleClose">
            <div class="v-table-context-menu-empty">No Content</div>
          </slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { computePosition, flip, offset, shift } from '@floating-ui/vue'
import type { VTableContextMenuContext } from '../interface/contextMenu'

defineOptions({ name: 'ContextMenu' })

const props = defineProps<{
  visible: boolean
  x: number
  y: number
  context: VTableContextMenuContext
}>()

const emit = defineEmits<{
  close: []
}>()

const floatingRef = ref<HTMLElement | null>(null)
const floatingStyles = ref({
  position: 'fixed' as const,
  top: '0px',
  left: '0px',
})

const getVirtualElement = () => ({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    x: props.x,
    y: props.y,
    top: props.y,
    left: props.x,
    right: props.x,
    bottom: props.y,
  }),
})

// 更新菜单位置
const updatePosition = async () => {
  if (!floatingRef.value) return
  const virtualElement = getVirtualElement()
  const { x, y } = await computePosition(virtualElement, floatingRef.value, {
    placement: 'bottom-start',
    strategy: 'fixed',
    middleware: [
      offset(2),
      flip({
        fallbackPlacements: ['bottom-start', 'top-start', 'right-start', 'left-start'],
        padding: 8,
      }),
      shift({ padding: 8 }),
    ],
  })

  floatingStyles.value = {
    position: 'fixed',
    top: `${y}px`,
    left: `${x}px`,
  }
}

// 关闭菜单
const handleClose = () => {
  emit('close')
}

// 点击外部关闭菜单
const handleClickOutside = (e: MouseEvent) => {
  if (props.visible && floatingRef.value && !floatingRef.value.contains(e.target as Node)) {
    emit('close')
  }
}

// 监听 ESC 键关闭菜单
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.visible) {
    emit('close')
  }
}

// 阻止滚动事件
const preventScroll = (e: WheelEvent | TouchEvent) => {
  // 检查事件目标是否在菜单内部
  if (floatingRef.value && floatingRef.value.contains(e.target as Node)) {
    // 如果在菜单内部，允许菜单自身滚动
    return
  }
  // 否则阻止滚动
  e.preventDefault()
}

// 监听 visible 变化，控制滚动锁定
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
    } else {
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
    }
  },
)

// 监听位置变化
watch([() => props.visible, () => props.x, () => props.y], async ([visible]) => {
  if (visible) {
    await nextTick()
    updatePosition()
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('wheel', preventScroll)
  document.removeEventListener('touchmove', preventScroll)
})
</script>

<style scoped>
.v-table-context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background-color: transparent;
  overflow: hidden;
  pointer-events: none;
}

.v-table-context-menu {
  position: fixed;
  z-index: 9999;
  min-width: 160px;
  pointer-events: auto;
}

.v-table-context-menu-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 160px;
}

/* 过渡动画 */
.context-menu-fade-enter-active,
.context-menu-fade-leave-active {
  transition: opacity 0.15s ease;
}

.context-menu-fade-enter-from,
.context-menu-fade-leave-to {
  opacity: 0;
}
</style>
