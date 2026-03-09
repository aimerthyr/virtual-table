<template>
  <div class="code-block">
    <pre><code ref="codeRef" :class="`language-${language || 'bash'}`"><slot/></code></pre>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import dedent from 'dedent'
import hljs from 'highlight.js/lib/core'

defineOptions({
  name: 'CodeBlock',
})

defineProps<{
  language?: string
}>()

const slots = useSlots()
const codeRef = ref<HTMLElement>()

onMounted(() => {
  if (codeRef.value) {
    const raw = (slots.default?.()[0]?.children as string) || ''
    const code = dedent(raw)
    codeRef.value.textContent = code
    hljs.highlightElement(codeRef.value)
  }
})
</script>

<style scoped>
pre {
  margin: 0 !important;
}

.code-block {
  white-space: pre;
  padding: 0 !important;
  background: transparent !important;
}
</style>
