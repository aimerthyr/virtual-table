import { createApp } from 'vue'
import './style.css'
import 'ant-design-vue/dist/reset.css'
import 'highlight.js/styles/github.css'
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import App from './App.vue'
import router from './router'
import 'highlight.js/styles/github.css'

const languageRegistry = {
  bash,
  sh: bash,
  shell: bash,
  zsh: bash,
  ts: typescript,
  typescript,
  vue: xml,
} as const

Object.entries(languageRegistry).forEach(([name, grammar]) => {
  if (!hljs.getLanguage(name)) {
    hljs.registerLanguage(name, grammar)
  }
})

createApp(App).use(router).mount('#app')
