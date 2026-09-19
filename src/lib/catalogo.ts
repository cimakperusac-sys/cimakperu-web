import { getMenu, getMeta } from './api';
import { navLinks } from '../data/navigation';
import { site } from '../data/site';
import type { WebFamilia, WebMenuFamilia, WebMeta, WebProductoCard, WebSubcategoria } from './types/web';

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

  let texto = plantilla
    ? reemplazarPlaceholders(plantilla, { nombre, familia, url: pageUrl })
    : mensajeCotizarPorDefecto(nombre, familia, pageUrl);

  // El link de la página va en el mensaje: se ve natural y el CRM detecta el origen por esa URL.
  texto = asegurarUrlEnMensaje(texto, pageUrl);

  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(texto)}`;
}

function asegurarUrlEnMensaje(texto: string, pageUrl: string): string {
  const limpio = texto.replace(/\n*cimak:(producto|familia|pagina):[a-z0-9_-]+\s*$/i, '').trim();
  if (!pageUrl) return limpio;
  if (limpio.includes(pageUrl)) return limpio;
  // Si ya hay otra URL de cimakperu, no duplicamos.
  if (/https?:\/\/(?:www\.)?cimakperu\.com\b/i.test(limpio)) return limpio;
  return `${limpio}\n${pageUrl}`;
}

function reemplazarPlaceholders(
  plantilla: string,
  vars: { nombre: string; familia: string; url: string },
): string {
  const nombre = vars.nombre.trim();
  const familia = vars.familia.trim() || nombre;
  const url = vars.url.trim();

  const texto = plantilla.replace(/\{\s*(nombre|producto|familia|url)\s*\}/gi, (_match, key: string) => {
    const k = key.toLowerCase();
    if (k === 'nombre' || k === 'producto') return nombre;
    if (k === 'familia') return familia;
    return url;
  });

  return texto.replace(/[ \t]{2,}/g, ' ').replace(/ +([.,])/g, '$1').trim();
}

function textoMensajeMeta(meta: WebMeta | null): string | null {
  const directo = String(meta?.mensaje_whatsapp || '').trim();
  if (directo) return directo;
  const extra = meta?.extra?.mensaje_whatsapp;
  return typeof extra === 'string' && extra.trim() ? extra.trim() : null;
}

/** Mensaje de la página. Si esa clave no tiene texto, usa el del inicio. */
export async function resolverMensajePagina(clave = 'home'): Promise<string | null> {
  const propio = textoMensajeMeta(await getMeta(clave));
  if (propio) return propio;
  if (clave === 'home') return null;
  return textoMensajeMeta(await getMeta('home'));
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
