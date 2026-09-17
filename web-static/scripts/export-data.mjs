// Exporta el contenido del backend a ficheros estáticos para GitHub Pages.
//
// Uso (con el backend arrancado):
//   npm run export-data
//   API_URL=http://otra-ip:8000 npm run export-data
//
// Genera:
//   public/data/<recurso>.json       → listado
//   public/data/<recurso>/<id>.json  → detalle
//   public/media/...                 → imágenes referenciadas en los datos

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const API_URL = (process.env.API_URL ?? "http://localhost:8000").replace(/\/$/, "");
const RECURSOS = ["categorias", "noticias", "negocios", "servicios", "anuncios"];
const PAGE_SIZE = 100;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const DATA_DIR = join(ROOT, "data");
const MEDIA_DIR = join(ROOT, "media");

const getJson = async (path) => {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) throw new Error(`HTTP ${response.status} en ${path}`);
  return response.json();
};

const listarTodo = async (recurso) => {
  const filas = [];
  for (let skip = 0; ; skip += PAGE_SIZE) {
    const pagina = await getJson(`/${recurso}/?skip=${skip}&limit=${PAGE_SIZE}`);
    filas.push(...pagina);
    if (pagina.length < PAGE_SIZE) return filas;
  }
};

const writeJson = async (path, data) => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data));
};

const recogerMedia = (valor, rutas) => {
  if (typeof valor === "string" && valor.startsWith("/media/")) rutas.add(valor);
  else if (valor && typeof valor === "object") {
    Object.values(valor).forEach((v) => recogerMedia(v, rutas));
  }
};

try {
  await getJson("/health");
} catch {
  console.error(`No se puede conectar con el backend en ${API_URL}. ¿Está arrancado?`);
  process.exit(1);
}

await rm(DATA_DIR, { recursive: true, force: true });
await rm(MEDIA_DIR, { recursive: true, force: true });

const rutasMedia = new Set();

for (const recurso of RECURSOS) {
  const filas = await listarTodo(recurso);
  await writeJson(join(DATA_DIR, `${recurso}.json`), filas);
  recogerMedia(filas, rutasMedia);

  for (const { id } of filas) {
    const detalle = await getJson(`/${recurso}/${id}`);
    await writeJson(join(DATA_DIR, recurso, `${id}.json`), detalle);
    recogerMedia(detalle, rutasMedia);
  }
  console.log(`${recurso}: ${filas.length}`);
}

for (const ruta of rutasMedia) {
  const response = await fetch(`${API_URL}${ruta}`);
  if (!response.ok) {
    console.warn(`  ⚠ imagen no encontrada: ${ruta}`);
    continue;
  }
  const destino = join(ROOT, ruta);
  await mkdir(dirname(destino), { recursive: true });
  await writeFile(destino, Buffer.from(await response.arrayBuffer()));
}
console.log(`imágenes: ${rutasMedia.size}`);
