import { terser } from 'rollup-plugin-terser'

export default {
  input: './wc-slider.js',
  output: {
    file: 'dist/wc-slider.min.js',
    format: 'iife',
    sourcemap: 'inline',
  },
  plugins: [terser()],
}
