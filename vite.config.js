import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // 👇 This is what fixes the white page on refresh or direct route access
    historyApiFallback: true
  }
})
