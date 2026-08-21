// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cimak.com',
  // Build directo a www/html (carpeta hermana de cimakperu-web)
  outDir: '../html',
  image: {
    // Todos los assets son SVG, así que no hay nada que optimizar con Sharp,
    // que además no puede cargarse en el servidor de producción.
    service: { entrypoint: 'astro/assets/services/noop' }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
