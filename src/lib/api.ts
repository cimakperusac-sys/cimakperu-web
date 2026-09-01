import type {
  ApiEnvelope,
  WebBlog,
  WebBlogCard,
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

export async function getBlogs(limite?: number): Promise<WebBlogCard[]> {
  const q = limite && limite > 0 ? `?limite=${limite}` : '';
  return (await crmGet<WebBlogCard[]>(`/blogs${q}`)) ?? [];
}

export async function getBlog(slug: string): Promise<WebBlog | null> {
  return crmGet<WebBlog>(`/blogs/${encodeURIComponent(slug)}`);
}

export { baseUrl as crmApiBaseUrl };

export type LibroReclamacionPayload = {
  nombre_completo: string;
  tipo_documento: 'DNI' | 'CE' | 'RUC';
  numero_documento: string;
  telefono: string;
  email: string;
  direccion: string;
  tipo_bien: 'producto' | 'servicio';
  monto_reclamado?: string;
  numero_comprobante?: string;
  descripcion_bien?: string;
  tipo_reclamo: 'reclamo' | 'queja';
  detalle: string;
  pedido_consumidor: string;
  acepta_declaracion: boolean;
  acepta_privacidad: boolean;
};

export async function enviarLibroReclamacion(
  payload: LibroReclamacionPayload,
): Promise<{ success: boolean; data?: { id: number; codigo: string; mensaje?: string }; error?: string }> {
  const url = `${baseUrl()}/v1/public/web/libro-reclamaciones`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const json = (await res.json()) as ApiEnvelope<{ id: number; codigo: string; mensaje?: string }> & {
      error?: string;
    };

    if (!res.ok || !json?.success) {
      return { success: false, error: json?.error || 'No se pudo enviar la reclamación.' };
    }

    return { success: true, data: json.data ?? undefined };
  } catch {
    return { success: false, error: 'Error de conexión. Intente nuevamente.' };
  }
}
