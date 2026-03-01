<template>
  <label :class="wrapperClasses">
    <span :class="checkboxClasses">
      <input
        type="checkbox"
        :checked="checked"
        :disabled="disabled"
        :indeterminate="indeterminate"
        class="checkbox-input"
        @change="handleChange"
      />
      <span class="checkbox-inner" />
    </span>
    <span v-if="$slots.default" class="checkbox-label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
defineOptions({ name: 'VCheckbox' })

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    indeterminate?: boolean // 半选状态
    onChange?: (e: Event) => void
  }>(),
  {
    disabled: false,
    indeterminate: false,
    onChange: () => {},
  },
)

const checked = defineModel<boolean>('checked')

const wrapperClasses = computed(() => ({
  'checkbox-wrapper': true,
  'checkbox-wrapper-checked': checked.value,
  'checkbox-wrapper-disabled': props.disabled,
}))

const checkboxClasses = computed(() => ({
  checkbox: true,
  'checkbox-checked': checked.value && !props.indeterminate,
  'checkbox-disabled': props.disabled,
  'checkbox-indeterminate': props.indeterminate,
}))

const handleChange = (e: Event) => {
  if (props.disabled) return
  const target = e.target as HTMLInputElement
  checked.value = target.checked
  props.onChange?.(e)
}
</script>

<style lang="less" scoped>
@checkbox-size: 16px;
@checkbox-border-width: 1px;
@checkbox-border-radius: 2px;

@primary-color: #1890ff;
@primary-color-hover: #40a9ff;
@primary-color-active: #096dd9;
@border-color-base: #d9d9d9;
@disabled-color: rgba(0, 0, 0, 0.25);
@disabled-bg: #f5f5f5;
@component-background: #fff;
@text-color: rgba(0, 0, 0, 0.85);

@animation-duration-slow: 0.3s;
@animation-duration-base: 0.2s;
@ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);

// ========== Checkbox 容器 ==========
.checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &:hover .checkbox-inner {
    border-color: @primary-color;
  }

  &-disabled {
    cursor: not-allowed;
  }
}

// ========== Checkbox 主体 ==========
.checkbox {
  position: relative;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  vertical-align: middle;
  outline: none;
  cursor: pointer;

  // 隐藏原生 input
  &-input {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }

  // Checkbox 内部方框
  &-inner {
    position: relative;
    display: block;
    width: @checkbox-size;
    height: @checkbox-size;
    background-color: @component-background;
    border: @checkbox-border-width solid @border-color-base;
    border-radius: @checkbox-border-radius;
    border-collapse: separate;
    transition: all @animation-duration-slow @ease-in-out;

    // 对勾
    &::after {
      position: absolute;
      top: 50%;
      left: 21.5%;
      display: table;
      width: (@checkbox-size / 14) * 5;
      height: (@checkbox-size / 14) * 8;
      border: 2px solid @component-background;
      border-top: 0;
      border-left: 0;
      transform: rotate(45deg) scale(0) translate(-50%, -50%);
      opacity: 0;
      transition: all @animation-duration-base @ease-in-out;
      content: ' ';
    }
  }

  // ========== 选中状态 ==========
  &-checked {
    .checkbox-inner {
      background-color: @primary-color;
      border-color: @primary-color;

      &::after {
        transform: rotate(45deg) scale(1) translate(-50%, -50%);
        opacity: 1;
        transition: all @animation-duration-base @ease-in-out;
      }
    }

    &:hover .checkbox-inner {
      background-color: @primary-color-hover;
      border-color: @primary-color-hover;
    }

    &:active .checkbox-inner {
      background-color: @primary-color-active;
      border-color: @primary-color-active;
    }
  }

  // ========== 半选状态 ==========
  &-indeterminate {
    .checkbox-inner {
      background-color: @component-background;
      border-color: @border-color-base;

      &::after {
        top: 50%;
        left: 50%;
        width: (@checkbox-size / 2);
        height: (@checkbox-size / 2);
        background-color: @primary-color;
        border: 0;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        content: ' ';
      }
    }

    &:hover .checkbox-inner {
      background-color: @component-background;
      border-color: @primary-color;
    }
  }

  // ========== 禁用状态 ==========
  &-disabled {
    cursor: not-allowed;

    .checkbox-input {
      cursor: not-allowed;
    }

    .checkbox-inner {
      background-color: @disabled-bg;
      border-color: @border-color-base !important;

      &::after {
        border-color: @disabled-color;
      }
    }

    &.checkbox-checked .checkbox-inner {
      background-color: @disabled-bg;

      &::after {
        border-color: @disabled-color;
      }
    }

    &.checkbox-indeterminate .checkbox-inner::after {
      background-color: @disabled-color;
    }

    & + .checkbox-label {
      color: @disabled-color;
      cursor: not-allowed;
    }
  }
}

// ========== 文本标签 ==========
.checkbox-label {
  padding-right: 8px;
  padding-left: 8px;
  color: @text-color;
  line-height: 1.5715;
}

// ========== 焦点状态 ==========
.checkbox-wrapper:not(.checkbox-wrapper-disabled) {
  .checkbox-input:focus-visible + .checkbox-inner {
    border-color: @primary-color;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.08);
  }
}
</style>
