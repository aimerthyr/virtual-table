<template>
  <Popover :open="open" placement="bottom" @open-change="handleOpenChange">
    <div ref="selectRef" :class="selectClasses">
      <div class="select-selector">
        <span class="select-selection-item">{{ selectedLabel }}</span>
        <span class="select-arrow">▼</span>
      </div>
    </div>

    <template #content>
      <div class="select-dropdown" :style="{ width: dropdownWidth }">
        <div class="select-dropdown-inner">
          <div
            v-for="option in props.options"
            :key="option.value"
            :class="['select-item', { 'select-item-selected': option.value === props.value }]"
            @click="handleSelect(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </template>
  </Popover>
</template>

<script setup lang="ts">
import Popover from './VPopover.vue'

defineOptions({ name: 'VSelect', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    value?: string | number
    options?: Array<{ label: string; value: string | number }>
    onSelectChange?: (value: string | number) => void
  }>(),
  {
    value: undefined,
    options: () => [],
    onSelectChange: () => {},
  },
)

const open = ref(false)
const selectRef = ref<HTMLElement | null>(null)
const dropdownWidth = ref('auto')

const selectClasses = computed(() => ({
  select: true,
  'select-open': open.value,
}))

const selectedLabel = computed(() => {
  const option = props.options.find((opt) => opt.value === props.value)
  return option?.label || ''
})

const handleOpenChange = (isOpen: boolean) => {
  open.value = isOpen
  if (isOpen && selectRef.value) {
    // 打开时获取触发器宽度
    dropdownWidth.value = `${selectRef.value.offsetWidth}px`
  }
}

const handleSelect = (option: { label: string; value: string | number }) => {
  props.onSelectChange?.(option.value)
  open.value = false
}
</script>

<style scoped>
.select {
  display: inline-block;
  min-width: 80px;
  cursor: pointer;
}

.select-selector {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 11px;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  transition: all 0.3s;
}

.select:not(.select-disabled):hover .select-selector {
  border-color: var(--v-table-primary-color);
}

.select-open .select-selector {
  border-color: var(--v-table-primary-color);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.select-selection-item {
  flex: 1;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
}

.select-arrow {
  margin-left: 8px;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.25);
  transition: transform 0.3s;
}

.select-open .select-arrow {
  transform: rotate(180deg);
}

.select-dropdown {
  max-height: 256px;
  overflow: hidden; /* 隐藏溢出，让圆角生效 */
  background: #fff;
  border-radius: 6px; /* 添加圆角 */
}

.select-dropdown-inner {
  max-height: 256px;
  padding: 4px;
  overflow-y: auto; /* 滚动条放在内层 */
}

.select-item {
  padding: 5px 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 22px;
  cursor: pointer;
  transition: background 0.3s;
  border-radius: 4px;
}

.select-item:hover {
  background-color: #f5f5f5;
}

.select-item-selected {
  font-weight: 600;
  background-color: #e6f7ff;
}
</style>
