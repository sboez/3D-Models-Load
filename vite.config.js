import { defineConfig } from 'vite';

export default defineConfig({
   root: '.',
   publicDir: 'public',
   base: './',
   server: {
      open: true,
   },
   build: {
      outDir: 'dist',
      emptyOutDir: true,
   },
});
