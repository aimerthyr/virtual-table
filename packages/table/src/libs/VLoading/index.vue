<template>
  <div class="flex h-full items-center justify-center bg-[rgba(255,255,255,0.5)]">
    <slot>
      <div class="animate-custom-spin dot-container relative">
        <div
          v-for="i in 4"
          :key="i"
          class="dot-item animate-fade absolute origin-center scale-[0.75] rounded-full opacity-[0.3]"
        />
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { LoadingSize } from './directive'

defineOptions({ name: 'VLoading' })

const props = withDefaults(
  defineProps<{
    size?: LoadingSize
  }>(),
  {
    size: 'default',
  },
)

const sizeOptions = computed<{ containerSize: string; dotSize: string }>(() => {
  const sizeMap: Record<LoadingSize, { containerSize: string; dotSize: string }> = {
    default: {
      containerSize: '20px',
      dotSize: '9px',
    },
    small: {
      containerSize: '14px',
      dotSize: '6px',
    },
    large: {
      containerSize: '32px',
      dotSize: '14px',
    },
  }
  return sizeMap[props.size]
})
</script>

<style scoped lang="less">
@keyframes spin {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}

.animate-custom-spin {
  animation: spin 1.2s linear infinite;
}

@keyframes fade {
  100% {
    opacity: 1;
  }
}

.animate-fade {
  animation: fade 1s linear infinite alternate;
}

.dot-container {
  width: v-bind('sizeOptions.containerSize');
  height: v-bind('sizeOptions.containerSize');
}

.dot-item {
  width: v-bind('sizeOptions.dotSize');
  height: v-bind('sizeOptions.dotSize');
  background-color: var(--v-table-primary-color);

  &:nth-child(1) {
    top: 0;
    inset-inline-start: 0;
  }

  &:nth-child(2) {
    top: 0;
    inset-inline-end: 0;
    animation-delay: 0.4s;
  }

  &:nth-child(3) {
    inset-inline-end: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }

  &:nth-child(4) {
    bottom: 0;
    inset-inline-start: 0;
    animation-delay: 1.2s;
  }
}
</style>
