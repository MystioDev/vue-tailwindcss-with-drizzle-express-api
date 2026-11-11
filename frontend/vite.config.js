import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from the root shared .env file
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '')

  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10)
  const backendPort = parseInt(env.BACKEND_PORT || env.PORT || '3000', 10)
  const backendUrl = env.VITE_API_URL || `http://localhost:${backendPort}`

  return {
    envDir: '../',
    define: {
      'import.meta.env.BACKEND_PORT': JSON.stringify(backendPort),
      'import.meta.env.FRONTEND_PORT': JSON.stringify(frontendPort),
      'import.meta.env.VITE_API_URL': JSON.stringify(backendUrl),
    },
    server: {
      port: frontendPort,
      host: true,
      proxy: {
        // Automatically proxies all /api calls to the Express backend port
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [
      vue(),
      tailwindcss(),
    ],
  }
})

