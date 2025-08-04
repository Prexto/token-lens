import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for GNews API (this was working)
      '/api/gnews': {
        target: 'https://gnews.io/api/v4',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gnews/, ''),
      },
      // Simple proxy for CoinGecko - direct to API
      '/api/coingecko': {
        target: 'https://api.coingecko.com/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/coingecko/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Add headers to avoid blocks
            proxyReq.setHeader('User-Agent', 'TokenLens/1.0');
            proxyReq.setHeader('Accept', 'application/json');
          });
        },
      },
    },
  },
});
