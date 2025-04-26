import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use VITE_API_URL from .env if available, otherwise default to localhost
  const apiTarget = env.VITE_API_URL;

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API requests to your FastAPI server during development
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  };
});