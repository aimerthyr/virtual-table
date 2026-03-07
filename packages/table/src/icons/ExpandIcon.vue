<template>
  <button type="button" :class="classNames" @click="onClick" />
</template>

<script setup lang="ts">
defineOptions({ name: 'ExpandIcon' })

const props = withDefaults(
  defineProps<{
    expand: boolean // 展开
    expandable?: boolean // 是否可展开
    onExpand?: (value: boolean, e: MouseEvent) => void
  }>(),
  {
    expandable: true,
    onExpand: () => {},
  },
)

const classNames = computed(() => {
  return {
    [`row-expand-icon`]: true,
    [`row-expand-icon-spaced`]: !props.expandable,
    [`row-expand-icon-expanded`]: props.expandable && props.expand,
    [`row-expand-icon-collapsed`]: props.expandable && !props.expand,
  }
})

const onClick = (e: MouseEvent) => {
  if (!props.expandable) return
  props.onExpand?.(props.expand, e)
  e.stopPropagation()
}
</script>

<style lang="less" scoped>
// 变量定义
@line-width: 1px;
@checkbox-size: 16px;
@line-type: solid;
@table-border-color: #f0f0f0;
@padding-xxs: 4px;
@border-radius: 2px;
@motion-duration-slow: 0.3s;
@table-expand-icon-bg: #fff;

// 计算变量
@half-inner-size: (@checkbox-size / 2) - @line-width;
@expand-icon-size: @half-inner-size * 2 + @line-width * 3;
@table-border: @line-width @line-type @table-border-color;
@expand-icon-line-offset: @padding-xxs - @line-width;
@scale-ratio: (unit(@checkbox-size) / unit(@expand-icon-size));

// 展开图标样式
.row-expand-icon {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: @expand-icon-size;
  height: @expand-icon-size;
  padding: 0;
  color: inherit;
  line-height: @expand-icon-size;
  background: @table-expand-icon-bg;
  border: @table-border;
  border-radius: @border-radius;
  transform: scale(@scale-ratio);
  transition: all @motion-duration-slow;
  cursor: pointer;
  user-select: none;

  &:focus,
  &:hover,
  &:active {
    border-color: currentcolor;
    color: var(--v-table-primary-color);
  }

  &::before,
  &::after {
    position: absolute;
    background: currentcolor;
    transition: transform @motion-duration-slow ease-out;
    content: '';
  }

  // 水平线
  &::before {
    top: @half-inner-size;
    right: @expand-icon-line-offset;
    left: @expand-icon-line-offset;
    height: @line-width;
  }

  // 垂直线
  &::after {
    top: @expand-icon-line-offset;
    bottom: @expand-icon-line-offset;
    left: @half-inner-size;
    width: @line-width;
    transform: rotate(90deg);
  }
}

// 收起状态（显示 + 号）
.row-expand-icon-collapsed {
  &::before {
    transform: rotate(-180deg);
  }

  &::after {
    transform: rotate(0deg);
  }
}

// 展开状态（显示 - 号）
.row-expand-icon-expanded {
  &::before {
    transform: rotate(0deg);
  }

  &::after {
    transform: rotate(90deg);
    opacity: 0;
  }
}

// 占位状态（不显示图标，但保持空间）
.row-expand-icon-spaced {
  &::before,
  &::after {
    display: none;
    content: none;
  }

  background: transparent;
  border: 0;
  visibility: hidden;
}
</style>
