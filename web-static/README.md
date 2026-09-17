# web-static — prueba de VenialboConecta en GitHub Pages

Copia de `web/` solo con la zona pública, sin backend. Los datos se leen de JSON
exportados en `public/data/` y las imágenes de `public/media/`.

## Actualizar contenido

```bash
# 1. Arrancar el backend (ver /backend) y editar el contenido desde web/ (panel admin)
# 2. Exportar los datos
npm run export-data            # o API_URL=http://<ip>:8000 npm run export-data
# 3. Compilar y probar
npm run build
npm run preview                # http://localhost:4173/venialbo-conecta/
```

## Publicar

```bash
npm run deploy                 # sube dist/ a la rama gh-pages del repo
```

En GitHub: Settings → Pages → Source: rama `gh-pages`, carpeta `/`.

La ruta base es `/venialbo-conecta/`. Con dominio propio: `BASE_PATH=/ npm run build`.

## Descartar la prueba

Borrar esta carpeta (y la rama `gh-pages` si se llegó a publicar).
