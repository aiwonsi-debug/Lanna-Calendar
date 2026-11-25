import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Build เฉพาะสาขา dispatch-design: base แบบสัมพัทธ์ (./) เพื่อเปิดจาก CDN ของสาขาได้
// entry คือ dispatch.html (ตอนประกอบคอมมิตจะเปลี่ยนชื่อเป็น docs/index.html)
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist-dispatch',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'dispatch.html'),
    },
  },
})
