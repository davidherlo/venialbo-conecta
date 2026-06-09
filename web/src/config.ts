if (!import.meta.env.VITE_API_URL) {
  console.warn("VITE_API_URL no definida — usando http://localhost:8000 (solo para desarrollo)");
}
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const imgUrl = (path?: string | null): string | undefined =>
  path ? `${API_URL}${path}` : undefined;

export const formatFecha = (iso: string): string =>
  new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
