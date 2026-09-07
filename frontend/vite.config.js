import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../eLearning/static/react_public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'src/pages/home/main.jsx'),
        courses: resolve(__dirname, 'src/pages/courses/main.jsx'),
        about: resolve(__dirname, 'src/pages/about/main.jsx'),
        contact: resolve(__dirname, 'src/pages/contact/main.jsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: 'assets/[name][extname]',
        // Nav/Footer/api.js sont partagés par les 4 entrées : on fige le nom
        // du chunk commun pour que les templates Django puissent le référencer
        // sans lire un manifest.json.
        manualChunks: {
          shared: [
            resolve(__dirname, 'src/shared/api.js'),
            resolve(__dirname, 'src/shared/Nav.jsx'),
            resolve(__dirname, 'src/shared/Footer.jsx'),
          ],
        },
      },
    },
  },
})
