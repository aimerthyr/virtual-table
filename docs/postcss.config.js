import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import { postcssIsolateStyles } from 'vitepress'

export default {
  plugins: [
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/, /base\.css/],
    }),
    tailwindcss(),
    autoprefixer(),
  ],
}
