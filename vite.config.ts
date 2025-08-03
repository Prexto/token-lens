import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for CoinGecko API
      '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
      },
      // Proxy for GNews API
      '/api/gnews': {
        target: 'https://gnews.io/api/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gnews/, ''),
      },
    },
  },
});