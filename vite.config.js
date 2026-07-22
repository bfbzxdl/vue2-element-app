import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
  },
  server: {
    port: 3000,
    open: false,
  },
})
