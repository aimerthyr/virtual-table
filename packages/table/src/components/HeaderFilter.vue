<template>
  <VPopover v-model:open="open" placement="bottom-start" :arrow="false">
    <div class="relative h-[22px] cursor-pointer">
      <div
        class="absolute left-1/2 top-1/2 flex h-[30px] w-[20px] translate-x-[-50%] translate-y-[-50%] items-center justify-center text-[#0000004a] hover:bg-[#0000000f] hover:text-[#00000073]"
      >
        <slot
          name="customFilterIcon"
          :column-key="column.id"
          :filtered="column.getIsFiltered()"
          :column="columnMeta"
        >
          <FilterIcon :class="[column.getIsFiltered() ? 'text-[#1677ff]' : '']" />
        </slot>
      </div>
    </div>

    <template #content>
      <slot
        name="customFilterDropdown"
        :confirm="confirm"
        :reset="reset"
        :set-filter-value="(value) => (filterModelValue = value)"
        :column="columnMeta"
        :filter-model-value="filterModelValue"
      />
    </template>
  </VPopover>
</template>

<script setup lang="ts">
import type { Header } from '@tanstack/vue-table'
import FilterIcon from '../icons/FilterIcon.vue'
import type { VTableSlots } from '../interface'
import VPopover from '../libs/VPopover.vue'

defineOptions({ name: 'HeaderFilter' })

defineSlots<VTableSlots>()

const props = defineProps<{
  header: Header<any, any>
}>()

const column = computed(() => props.header.column)
const columnMeta = computed(() => column.value.columnDef.meta!)

const open = ref(false)

const _filterModelValue = ref<any>()
const filterModelValue = computed<any>({
  get() {
    return column.value.getFilterValue()
  },
  set(value) {
    _filterModelValue.value = value
  },
})

const confirm = () => {
  column.value.setFilterValue(_filterModelValue.value)
  open.value = false
}

const reset = () => {
  _filterModelValue.value = null
  column.value.setFilterValue(_filterModelValue.value)
  open.value = false
}
</script>
