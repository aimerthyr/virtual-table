<template>
  <div class="sorter-icon inline-flex flex-col items-center">
    <svg
      class="sorter-up h-[12px] w-[12px]"
      :class="{ 'text-[#1677ff]': sort === 'asc' }"
      viewBox="0 0 1024 1024"
      version="1.1"
      fill="currentcolor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M76.3 632.8l405.1-489.1c16.9-18.9 46.5-18.9 63.4 0l403.1 489.1c24.4 27.4 5 70.8-31.7 70.8H107.9c-36.6 0-56.1-43.4-31.6-70.8z"
      ></path>
    </svg>
    <svg
      class="sorter-down h-[12px] w-[12px]"
      :class="{ 'text-[#1677ff]': sort === 'desc' }"
      viewBox="0 0 1024 1024"
      version="1.1"
      fill="currentcolor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M76.3 392.3l403.1 489.1c16.9 18.9 46.5 18.9 63.4 0l405.1-489.1c24.4-27.4 5-70.8-31.7-70.8H108.1c-36.8 0-56.3 43.4-31.8 70.8z"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'SorterIcon',
})

defineProps<{
  sort?: 'asc' | 'desc' | null
}>()
</script>

<style lang="less" scoped>
.sorter-icon {
  color: rgb(0 0 0 / 0.29);
}
.sorter-down {
  margin-top: -0.3em;
}
</style>
