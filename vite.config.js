import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use VITE_API_URL from .env if available, otherwise default to localhost
  const apiTarget = env.VITE_API_URL || 'http://localhost:8000';
  const deepfakeTarget = env.VITE_DEEPFAKE_API_URL || 'http://localhost:8001';
  const ttsTarget = env.VITE_TTS || 'http://localhost:8002';

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
        },
        // Add proxy for deepfake API
        '/deepfake-api': {
          target: deepfakeTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/deepfake-api/, '/api')
        },
        // Add proxy for speech API
        '/speech-api': {
          target: ttsTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/speech-api/, '/api')
        }
      }
    },
    // Add this section to improve HTTPS handling
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020'
      }
    },
    build: {
      target: 'es2020',
      // Enable source maps for easier debugging
      sourcemap: mode !== 'production'
    }
  };
});