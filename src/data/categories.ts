import aluzinc from '../assets/categories/aluzinc.svg';
import upvc from '../assets/categories/upvc.svg';
import termoPaneles from '../assets/categories/termo-paneles.svg';
import policarbonato from '../assets/categories/policarbonato.svg';
import fibraVidrio from '../assets/categories/fibra-vidrio.svg';
import placasColaborantes from '../assets/categories/placas-colaborantes.svg';

/** Fallback Figma (6 categorías) si el CRM aún no tiene familias con mostrar_web=1 */
export const categoriesFallback = [
  {
    title: 'Techos de ALUZINC',
    href: '/familias/aluzinc',
    image: aluzinc,
  },
  {
    title: 'Techos de UPVC',
    href: '/familias/upvc',
    image: upvc,
  },
  {
    title: 'TERMO PANELES',
    href: '/familias/termo-paneles',
    image: termoPaneles,
  },
  {
    title: 'Techos de POLICARBONATO',
    href: '/familias/policarbonato',
    image: policarbonato,
  },
  {
    title: 'Techos de FIBRA DE VIDRIO',
    href: '/familias/fibra-vidrio',
    image: fibraVidrio,
  },
  {
    title: 'PLACAS COLABORANTES',
    href: '/familias/placas-colaborantes',
    image: placasColaborantes,
  },
] as const;
