import { getMenu } from './api';
import { navLinks } from '../data/navigation';
import { site } from '../data/site';
import type { WebFamilia, WebMenuFamilia, WebProductoCard, WebSubcategoria } from './types/web';

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

/** Secciones de productos para grilla (subcategorías CRM o lista plana). */
export function seccionesFromFamilia(familia: WebFamilia): WebSubcategoria[] {
  const productos: WebProductoCard[] = Array.isArray(familia.productos) ? familia.productos : [];
  const subcategorias = (familia.subcategorias ?? []).filter((s) => s.productos?.length);

  if (subcategorias.length > 0) return subcategorias;
  if (productos.length > 0) return [{ nombre: 'Modelos', productos }];
  return [];
}

export function normalizeBusqueda(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function textoBusquedaProducto(
  producto: WebProductoCard,
  familiaNombre?: string | null,
): string {
  return normalizeBusqueda(
    [producto.nombre, producto.subcategoria, producto.descripcion, familiaNombre]
      .filter(Boolean)
      .join(' '),
  );
}

export function familiaHref(familia: { href?: string | null; slug?: string | null }): string {
  if (familia.href) return familia.href;
  return familia.slug ? `/familias/${familia.slug}` : '/#productos-categoria';
}

export function productoHref(producto: { href?: string | null; slug?: string | null }): string | null {
  if (producto.href) return producto.href;
  return producto.slug ? `/productos/${producto.slug}` : null;
}

export function cotizarHref(options?: {
  nombre?: string | null;
  familia?: string | null;
  mensaje?: string | null;
  mensajeFamilia?: string | null;
  url?: string | null;
} | string | null): string {
  const opts =
    typeof options === 'string' || options == null
      ? { nombre: options }
      : options;

  const nombre = String(opts.nombre || '').trim();
  const familia = String(opts.familia || '').trim();
  const pageUrl = String(opts.url || '').trim();
  const plantilla =
    String(opts.mensaje || '').trim() ||
    String(opts.mensajeFamilia || '').trim();

  const texto = plantilla
    ? reemplazarPlaceholders(plantilla, { nombre, familia, url: pageUrl })
    : mensajeCotizarPorDefecto(nombre, familia, pageUrl);

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

function reemplazarPlaceholders(
  plantilla: string,
  vars: { nombre: string; familia: string; url: string },
): string {
  return plantilla
    .replaceAll('{nombre}', vars.nombre || 'sus productos')
    .replaceAll('{familia}', vars.familia || vars.nombre || 'CIMAK')
    .replaceAll('{url}', vars.url);
}

function mensajeCotizarPorDefecto(nombre: string, familia: string, url: string): string {
  const foco = nombre
    ? familia
      ? `sus coberturas de ${familia} "${nombre}"`
      : `"${nombre}"`
    : 'sus coberturas';

  const lineas = [
    `👋 ¡Hola! Vi su página web, estoy interesado(a) en ${foco}. Me gustaría recibir información y una cotización.`,
  ];
  if (url) lineas.push(url);
  return lineas.join('\n');
}
