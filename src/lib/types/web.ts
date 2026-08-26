export type WebBloque = {
  clave: string;
  titulo?: string | null;
  subtitulo?: string | null;
  contenido?: string | null;
  cta_texto?: string | null;
  cta_url?: string | null;
  extra?: Record<string, unknown> | null;
  orden?: number;
  url?: string | null;
};

export type WebTestimonio = {
  nombre: string;
  comentario?: string | null;
  rating?: number;
  fuente?: string | null;
  avatar_url?: string | null;
  orden?: number;
};

export type WebMeta = {
  clave: string;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  og_image?: string | null;
  canonical?: string | null;
  extra?: Record<string, unknown> | null;
};

export type WebFamilia = {
  id: number;
  nombre: string;
  slug?: string | null;
  descripcion?: string | null;
  descripcion_web?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  color?: string | null;
  url?: string | null;
};

export type WebProducto = {
  id: number;
  nombre: string;
  slug?: string | null;
  descripcion?: string | null;
  descripcion_web?: string | null;
  especificaciones_web?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  url?: string | null;
  familia?: { id: number; nombre: string; slug?: string | null } | null;
  galeria?: Array<{ titulo?: string | null; alt?: string | null; url?: string | null; orden?: number }>;
};

export type WebHome = {
  meta: WebMeta | null;
  bloques: Record<string, WebBloque>;
  familias: WebFamilia[];
  testimonios: WebTestimonio[];
};

export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
