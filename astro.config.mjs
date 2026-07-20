// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Build directo a www/html (carpeta hermana de cimakperu-web)
  outDir: '../html',
  vite: {
    plugins: [tailwindcss()]
  }
});
