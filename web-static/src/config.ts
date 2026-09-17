// Versión estática: los datos y las imágenes se sirven desde public/ (ver scripts/export-data.mjs)
export const BASE_URL = import.meta.env.BASE_URL;

export const imgUrl = (path?: string | null): string | undefined =>
  path ? `${BASE_URL}${path.replace(/^\//, "")}` : undefined;

export const formatFecha = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
