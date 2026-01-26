import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  // Path for GitHub Pages deployment
  // base: '/financial-portfolio-dashboard/',
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
});
