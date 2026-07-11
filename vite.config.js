import { defineConfig } from 'vite';

export default defineConfig({
   root: '.',
   publicDir: 'public',
   base: './',
   resolve: {
      alias: [
         { find: /^three$/, replacement: 'three/webgpu' },
      ],
   },
   server: {
      open: true,
   },
   build: {
      outDir: 'dist',
      emptyOutDir: true,
   },
});
