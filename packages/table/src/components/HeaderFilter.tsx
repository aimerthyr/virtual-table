import { computed, defineComponent, h, ref, type PropType } from 'vue'
import type { Header } from '@tanstack/vue-table'
import type { VTableSlots } from '..'
import FilterIcon from '../icons/FilterIcon.vue'
import VPopover from '../libs/VPopover.vue'

export default defineComponent({
  name: 'HeaderFilter',
  props: {
    header: {
      type: Object as PropType<Header<any, any>>,
      required: true,
    },
  },
  setup(props) {
    const slots = useSlots() as VTableSlots
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

    const trigger = () => (
      <div class="relative h-[22px] cursor-pointer">
        <div class="absolute left-1/2 top-1/2 flex h-[30px] w-[20px] translate-x-[-50%] translate-y-[-50%] items-center justify-center text-[#0000004a] hover:bg-[#0000000f] hover:text-[#00000073]">
          {slots.customFilterIcon?.({
            columnKey: column.value.id,
            filtered: column.value.getIsFiltered(),
            column: columnMeta.value,
          }) || <FilterIcon class={column.value.getIsFiltered() ? 'text-[#1677ff]' : ''} />}
        </div>
      </div>
    )

    const content = () =>
      slots.customFilterDropdown?.({
        confirm,
        reset,
        setFilterValue: (value) => (filterModelValue.value = value),
        column: columnMeta.value,
        filterModelValue: filterModelValue.value,
      }) || h('div', '我是默认下拉')

    return () => {
      const customPopover = slots?.customPopover?.({
        open: open.value,
        onOpenChange: (value) => (open.value = value),
        trigger: trigger,
        content: content,
      })

      return (
        customPopover ||
        h(
          VPopover,
          {
            open: open.value,
            onOpenChange: (value) => (open.value = value),
          },
          {
            default: trigger,
            content: content,
          },
        )
      )
    }
  },
})
