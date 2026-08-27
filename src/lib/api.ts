import type {
  ApiEnvelope,
  WebFamilia,
  WebHome,
  WebMenuFamilia,
  WebMeta,
  WebProducto,
} from './types/web';

const DEFAULT_API = 'https://crm-api.cimakperu.com/';

function baseUrl(): string {
  const raw = import.meta.env.PUBLIC_CRM_API_URL || DEFAULT_API;
  return String(raw).replace(/\/$/, '');
}

/** En build (SSG) las mismas rutas se piden muchas veces; en dev siempre se refresca. */
const cache = new Map<string, unknown>();

async function crmGet<T>(path: string): Promise<T | null> {
  if (import.meta.env.PROD && cache.has(path)) {
    return cache.get(path) as T | null;
  }

  const url = `${baseUrl()}/v1/public/web${path}`;
  let data: T | null = null;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn(`[crm] ${url} → ${res.status}`);
    } else {
      const json = (await res.json()) as ApiEnvelope<T>;
      if (!json?.success) {
        console.warn(`[crm] ${url} success=false`, json?.error);
      } else {
        data = (json.data ?? null) as T | null;
      }
    }
  } catch (err) {
    console.warn(`[crm] fallo ${url}`, err);
  }

  if (import.meta.env.PROD) cache.set(path, data);
  return data;
}

export async function getHome(): Promise<WebHome | null> {
  return crmGet<WebHome>('/home');
}

export async function getMenu(): Promise<WebMenuFamilia[]> {
  return (await crmGet<WebMenuFamilia[]>('/menu')) ?? [];
}

export type GetFamiliasOptions = {
  conProductos?: boolean;
  limiteProductos?: number;
};

export async function getFamilias(opts: GetFamiliasOptions = {}): Promise<WebFamilia[]> {
  const params = new URLSearchParams();
  if (opts.conProductos) params.set('con_productos', '1');
  if (opts.limiteProductos && opts.limiteProductos > 0) {
    params.set('limite_productos', String(opts.limiteProductos));
  }

  const query = params.toString();
  return (await crmGet<WebFamilia[]>(`/familias${query ? `?${query}` : ''}`)) ?? [];
}

export async function getFamilia(slug: string): Promise<WebFamilia | null> {
  return crmGet<WebFamilia>(`/familias/${encodeURIComponent(slug)}`);
}

export async function getProducto(slug: string): Promise<WebProducto | null> {
  return crmGet<WebProducto>(`/productos/${encodeURIComponent(slug)}`);
}

export async function getMeta(clave: string): Promise<WebMeta | null> {
  return crmGet<WebMeta>(`/meta/${encodeURIComponent(clave)}`);
}

export { baseUrl as crmApiBaseUrl };
