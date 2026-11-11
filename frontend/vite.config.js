import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables from the shared root .env file, local env, and process.env
  const rootEnv = loadEnv(mode, path.resolve(__dirname, '..'), '')
  const localEnv = loadEnv(mode, process.cwd(), '')
  const env = { ...rootEnv, ...localEnv, ...process.env }

  const projectName = env.PROJECT_NAME || 'fullstack'
  const frontendPort = parseInt(env.FRONTEND_PORT || '5173', 10)
  const backendPort = parseInt(env.BACKEND_PORT || '3000', 10)

  return {
    envDir: '../',
    define: {
      'import.meta.env.PROJECT_NAME': JSON.stringify(projectName),
      'import.meta.env.BACKEND_PORT': JSON.stringify(backendPort),
      'import.meta.env.FRONTEND_PORT': JSON.stringify(frontendPort),
    },
    server: {
      port: frontendPort,
      host: true,
      proxy: {
        // Automatically proxies /api requests to Express backend port
        '/api': {
          target: `http://localhost:${backendPort}`,
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
