export type WebTipoMedia = 'video' | 'image' | 'none';

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
  mime_type?: string | null;
  tipo_media?: WebTipoMedia | null;
  url_mobile?: string | null;
  mime_type_mobile?: string | null;
  tipo_media_mobile?: WebTipoMedia | null;
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

export type WebProductoCard = {
  id: number;
  nombre: string;
  slug?: string | null;
  descripcion?: string | null;
  descripcion_web?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  subcategoria?: string | null;
  subcategoria_orden?: number | null;
  oferta?: 0 | 1 | number;
  oferta_texto?: string | null;
  url?: string | null;
  prioridad?: number | null;
};

export type WebSubcategoria = {
  nombre: string;
  productos: WebProductoCard[];
};

export type WebMenuProducto = {
  nombre: string;
  slug?: string | null;
  href?: string | null;
};

export type WebMenuSubcategoria = {
  nombre: string;
  total?: number;
  productos: WebMenuProducto[];
};

export type WebMenuFamilia = {
  id: number;
  nombre: string;
  slug?: string | null;
  href?: string | null;
  total_productos?: number;
  subcategorias: WebMenuSubcategoria[];
  /** Lista plana cuando la familia no usa subcategorías. */
  productos?: WebMenuProducto[];
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
  prioridad?: number | null;
  url?: string | null;
  total_productos?: number;
  productos?: WebProductoCard[];
  /** Solo en `/familias/{slug}`; vacío si la familia no usa subcategorías. */
  subcategorias?: WebSubcategoria[];
  menu?: WebMenuFamilia[];
};

export type WebColor = {
  nombre?: string | null;
  codigo?: string | null;
  hex?: string | null;
  url?: string | null;
};

export type WebAtributo = {
  label?: string | null;
  valor?: string | null;
};

export type WebGaleriaItem = {
  titulo?: string | null;
  alt?: string | null;
  url?: string | null;
  orden?: number;
};

export type WebProducto = {
  id: number;
  nombre: string;
  slug?: string | null;
  descripcion?: string | null;
  descripcion_web?: string | null;
  especificaciones_tecnicas?: string | null;
  especificaciones_web?: string | null;
  caracteristicas_web?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  subcategoria?: string | null;
  oferta?: 0 | 1 | number;
  oferta_texto?: string | null;
  colores?: WebColor[];
  atributos?: WebAtributo[];
  color?: string | null;
  url?: string | null;
  hero_url?: string | null;
  hero_url_mobile?: string | null;
  ficha_url?: string | null;
  familia?: {
    id: number;
    nombre: string;
    slug?: string | null;
    descripcion_web?: string | null;
    url?: string | null;
  } | null;
  galeria?: WebGaleriaItem[];
  relacionados?: WebProductoCard[];
  menu?: WebMenuFamilia[];
};

export type WebHome = {
  meta: WebMeta | null;
  bloques: Record<string, WebBloque>;
  familias: WebFamilia[];
  menu?: WebMenuFamilia[];
  testimonios: WebTestimonio[];
};

export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
