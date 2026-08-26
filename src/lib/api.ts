import type {
  ApiEnvelope,
  WebFamilia,
  WebHome,
  WebMeta,
  WebProducto,
} from './types/web';

const DEFAULT_API = 'http://localhost/api-crm/public';

function baseUrl(): string {
  const raw = import.meta.env.PUBLIC_CRM_API_URL || DEFAULT_API;
  return String(raw).replace(/\/$/, '');
}

async function crmGet<T>(path: string): Promise<T | null> {
  const url = `${baseUrl()}/v1/public/web${path}`;

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      console.warn(`[crm] ${url} → ${res.status}`);
      return null;
    }

    const json = (await res.json()) as ApiEnvelope<T>;
    if (!json?.success) {
      console.warn(`[crm] ${url} success=false`, json?.error);
      return null;
    }

    return (json.data ?? null) as T | null;
  } catch (err) {
    console.warn(`[crm] fallo ${url}`, err);
    return null;
  }
}

export async function getHome(): Promise<WebHome | null> {
  return crmGet<WebHome>('/home');
}

export async function getFamilias(): Promise<WebFamilia[]> {
  return (await crmGet<WebFamilia[]>('/familias')) ?? [];
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
