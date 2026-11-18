import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset paths relative, so the built folder works from any URL path.
export default defineConfig({
  base: './',
  plugins: [react()],
});
