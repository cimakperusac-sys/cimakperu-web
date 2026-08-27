import { getMenu } from './api';
import { navLinks } from '../data/navigation';
import { site } from '../data/site';
import type { WebMenuFamilia } from './types/web';

/** Menú del CRM; si la API no responde se usa la navegación hardcodeada. */
export async function getMenuConFallback(): Promise<WebMenuFamilia[]> {
  const menu = await getMenu();
  if (menu.length > 0) return menu;

  return navLinks.map((link, index) => {
    const slug = link.href.replace(/^\/familias\//, '');
    return {
      id: -(index + 1),
      nombre: link.label,
      slug,
      href: link.href,
      total_productos: 0,
      subcategorias: [],
    };
  });
}

export function familiaHref(familia: { href?: string | null; slug?: string | null }): string {
  if (familia.href) return familia.href;
  return familia.slug ? `/familias/${familia.slug}` : '/#productos-categoria';
}

export function productoHref(producto: { href?: string | null; slug?: string | null }): string | null {
  if (producto.href) return producto.href;
  return producto.slug ? `/productos/${producto.slug}` : null;
}

export function cotizarHref(nombre?: string | null): string {
  const texto = nombre
    ? `Hola, quiero cotizar ${nombre}.`
    : 'Hola, quiero cotizar coberturas CIMAK.';
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}
