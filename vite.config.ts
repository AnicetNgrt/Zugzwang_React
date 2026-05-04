import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite config for the renderer (browser/Electron) bundle.
// The Electron main process entry (electron-start.js) is not bundled — it runs in Node.
export default defineConfig({
  plugins: [react()],
  // Use relative paths so the built index.html works when loaded via file:// in Electron.
  base: './',
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      // Preserve the project's "baseUrl: ./src" import style (e.g. `Client/...`, `Shared/...`).
      Client: path.resolve(__dirname, 'src/Client'),
      Shared: path.resolve(__dirname, 'src/Shared'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
  },
  build: {
    outDir: 'build',
    emptyOutDir: true,
    sourcemap: true,
  },
  // Electron renderer can use Node APIs when nodeIntegration is on.
  optimizeDeps: {
    exclude: ['electron'],
  },
});
