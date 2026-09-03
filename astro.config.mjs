// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cimakperu.com',
  // SSR: cada visita lee el CRM en vivo. Solo hay que reconstruir al cambiar el código.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // La salida debe vivir dentro del proyecto: el entry.mjs de Node resuelve
  // node_modules subiendo desde su propia carpeta, y fuera del repo no los encuentra.
  outDir: './dist',
  image: {
    // Todos los assets son SVG, así que no hay nada que optimizar con Sharp,
    // que además no puede cargarse en el servidor de producción.
    service: { entrypoint: 'astro/assets/services/noop' }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
