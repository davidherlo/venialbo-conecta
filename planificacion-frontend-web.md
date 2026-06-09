# Planificación — Frontend web con Refine + FastAPI

> Frontend web para VenialboConecta que reutiliza el backend FastAPI existente.
> Objetivo: panel de administración modular para añadir contenido fácilmente,
> con zona pública de solo lectura accesible sin login.

---

## 0. Requisitos no funcionales

- **Responsive / mobile-first.** La mayoría de los vecinos accederán desde el móvil, así que la zona pública debe diseñarse pensando primero en pantallas pequeñas (≤ 480 px) y escalar hacia tablet/desktop. El panel `/admin` también debe ser usable desde móvil aunque sin ser prioritario.
- **Breakpoints de referencia:** móvil < 768 px, tablet 768–1024 px, desktop > 1024 px (los que usa Ant Design por defecto).
- **Pruebas obligatorias** en cada pantalla pública: vista móvil (Chrome DevTools, perfil iPhone SE / Pixel) antes de darla por terminada.

---

## 1. Decisiones técnicas

| Decisión | Elección | Versión instalada | Por qué |
|---|---|---|---|
| Build tool | **Vite** | 8.0.10 | Más simple que Next.js; SEO no es crítico para un pueblo |
| Lenguaje | **TypeScript** | 6.0.x | Plantilla `react-ts` de Vite |
| Runtime UI | **React** | 19.2.5 | La última estable; soportada por Refine v5/v6 |
| UI Kit | **Ant Design** (`@refinedev/antd`) | antd 5.29 / `@refinedev/antd` 6.0 | Integración profunda con Refine + sistema responsive (`Grid`/`Row`/`Col` con `xs/sm/md/lg`) ya integrado |
| Data provider | `@refinedev/simple-rest` adaptado | 6.0.1 | FastAPI usa `skip`/`limit`, hay que personalizarlo ligeramente |
| Routing | `@refinedev/react-router` + `react-router` | 2.0.4 / 7.14.2 | **Importante:** ya no se usa `react-router-dom`; en v7 todo viene de `react-router` |
| Auth (POC) | JWT vía `/auth/dev-login` | — | Sin Google de momento — el resto de la web es pública |
| i18n | `antd/locale/es_ES` | — | Configurado en `ConfigProvider` desde el scaffold |

---

## 2. Modelo de acceso

| Zona | Auth | Refine resources |
|---|---|---|
| **Pública** (`/`, `/noticias`, `/negocios`, `/servicios`, `/tablon`) | ❌ No | Solo `list` + `show` |
| **Admin** (`/admin/*`) | ✅ JWT (rol admin) | `list`, `create`, `edit`, `delete` |

Refine permite **un mismo recurso con dos modos**: las páginas públicas usan los hooks de lectura sin token; las páginas `/admin` envuelven en `<Authenticated>` y añaden el `Authorization: Bearer …`.

---

## 3. Estructura de carpetas propuesta

Marcado con ✅ lo que ya existe; sin marcar lo que aún hay que crear.

```
web/
├── ✅ index.html                 # lang="es", title VenialboConecta, viewport-fit=cover
├── ✅ package.json
├── ✅ vite.config.ts
├── ✅ .env                       # VITE_API_URL=http://localhost:8000  (ignorado en git)
├── ✅ .env.example               # plantilla versionada
└── src/
    ├── ✅ App.tsx                # <Refine> + ConfigProvider(esES) + ruta "/" placeholder
    ├── ✅ main.tsx               # createRoot + StrictMode
    ├── providers/
    │   ├── dataProvider.ts       # FastAPI (skip/limit, slash final)  ← paso 3
    │   └── authProvider.ts       # login/logout/check con dev-login   ← paso 4
    ├── resources.ts              # Definición central de recursos
    ├── public/
    │   ├── layout/PublicLayout.tsx
    │   └── pages/
    │       ├── Home.tsx
    │       ├── noticias/{List,Show}.tsx
    │       ├── negocios/{List,Show}.tsx
    │       ├── servicios/{List,Show}.tsx
    │       └── anuncios/{List,Show}.tsx
    ├── admin/
    │   ├── layout/AdminLayout.tsx          # Sidebar Refine clásico
    │   ├── LoginPage.tsx                   # Form simple → /auth/dev-login
    │   └── pages/
    │       ├── noticias/{List,Create,Edit}.tsx
    │       ├── negocios/{List,Create,Edit}.tsx
    │       ├── servicios/{List,Create,Edit}.tsx
    │       ├── anuncios/{List,Create,Edit}.tsx
    │       └── categorias/{List,Create,Edit}.tsx
    └── components/
        ├── ImageUploader.tsx     # POST /{recurso}/{id}/imagen
        └── CategoriaSelect.tsx
```

---

## 4. Adaptaciones al data provider

FastAPI no sigue 1:1 las convenciones por defecto de `simple-rest`:

| Convención simple-rest | Backend actual | Adaptación |
|---|---|---|
| `?_start=0&_end=10` | `?skip=0&limit=10` | Override `getList` |
| `X-Total-Count` header | (sin paginación total) | Calcular o devolver `length` |
| `/recurso` sin slash | `/recurso/` con slash | Añadir slash en URLs |
| Filtros `?campo=valor` | Iguales (`categoria_id`, `tipo`...) | Sin cambio |

Esto se resuelve extendiendo `simple-rest` (~30 líneas de `dataProvider.ts`).

---

## 5. Auth provider (mínimo, sin Google)

```
authProvider = {
  login        → POST /auth/dev-login → guarda JWT en localStorage
  logout       → borra token
  check        → ¿hay token? + ¿no expirado?
  getIdentity  → decode del JWT (rol, email)
}
```

El `dataProvider` lee el token de localStorage e inyecta `Authorization: Bearer <jwt>` en todas las peticiones. Para zona pública el header simplemente no estorba (los GET son públicos).

**Migración futura a Google:** se cambia solo el método `login` para llamar a `/auth/google` con el ID token; el resto del flujo no cambia.

---

## 6. Recursos Refine (vista central)

```ts
resources = [
  { name: "noticias",   list, show, create, edit, meta: { canDelete: true } },
  { name: "negocios",   list, show, create, edit },
  { name: "servicios",  list, show, create, edit },
  { name: "anuncios",   list, show, create, edit },
  { name: "categorias", list, create, edit },  // solo admin
]
```

Refine genera automáticamente: tablas paginadas con filtros, formularios con validación, breadcrumbs y navegación lateral. **Para añadir un recurso nuevo solo hay que crear 3 archivos** (List/Create/Edit) y añadirlo al array.

---

## 7. Cambios necesarios en el backend

1. **CORS** ✅ Hecho. Implementado en `backend/app/main.py` + `backend/app/config.py`:
   - Nueva opción `cors_origins: list[str]` en `Settings` con `http://localhost:5173` y `http://localhost:3000` por defecto (configurable por `.env`).
   - `app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])`.
   - Verificado con `curl`: orígenes permitidos reciben los headers correctos; preflight OPTIONS responde con `access-control-allow-methods` y `access-control-allow-headers`.
2. **Endpoint de categorías de negocios** — Ya existe (`GET /negocios/categorias`) ✅
3. *(Opcional, futuro)* devolver header `X-Total-Count` en listados para paginación servidor.

---

## 8. Subida de imágenes (flujo en 2 pasos)

La API ya lo hace así (POST recurso → POST /{id}/imagen). En el formulario de creación:
1. Refine `useForm` crea la entidad → recibe `id`
2. Componente `<ImageUploader>` sube el fichero a `/{recurso}/{id}/imagen`
3. Redirige a edit/list

---

## 9. Pasos de implementación (en orden)

- [x] **1.** Backend: añadir middleware CORS y verificar que arranca ✅
- [x] **2.** Scaffold Vite + Refine + Ant Design en `web/` ✅
- [x] **3.** Configurar `dataProvider` adaptado (skip/limit + slash final) ✅
- [x] **4.** Configurar `authProvider` con dev-login ✅
- [ ] **5.** Zona pública: `Home` + listas/detalles de los 4 recursos (solo lectura, sin sidebar) — **diseñar mobile-first**, menú hamburguesa en móvil
- [ ] **6.** `/admin/login` + `AdminLayout` con sidebar (colapsable en móvil)
- [ ] **7.** CRUD de **Noticias** (el más completo) como referencia
- [ ] **8.** Replicar para Negocios, Servicios, Anuncios, Categorías
- [ ] **9.** Componente `ImageUploader` reutilizable
- [ ] **10.** Pulido visual + deploy

Cada paso es independiente; podemos parar en el 7 para validar la experiencia antes de replicar.

---

## 10. Notas y descubrimientos durante la implementación

- **Refine v6 + React 19** — la combinación funciona sin avisos de peer deps. `useNotificationProvider` se exporta desde `@refinedev/antd` y se pasa como valor (no se llama) al prop `notificationProvider` de `<Refine>`.
- **`react-router` v7** — ya no existe `react-router-dom`; todo (`BrowserRouter`, `Route`, `Routes`) viene de `react-router`. Importante recordarlo en futuras dependencias.
- **WSL2 + filesystem `/mnt/c`** — `npm install` tarda ~1 min para 368 paquetes; aceptable. Si crece mucho, considerar mover el repo a `~/` (filesystem nativo de WSL2) para 5–10× de velocidad.
- **WSL2 + HMR de Vite** — el watcher inotify no detecta cambios en `/mnt/c` porque Windows no propaga eventos de filesystem a Linux. **Solución obligada:** `server.watch.usePolling: true` en `vite.config.ts` (ya configurado, intervalo 500 ms). Sin esto, los cambios en `src/` no se reflejan en el navegador hasta reiniciar el dev server.
- **Vulnerabilidades npm audit (3 high)** — todas en deps transitivas de tooling. Revisar y aplicar `npm audit fix` en el paso 10 (pulido), no bloquea desarrollo.
- **Variable `VITE_API_URL`** — en WSL2, `http://localhost:8000` funciona desde el navegador de Windows gracias al port forwarding automático; no hace falta usar la IP de WSL2 para desarrollo local.
- **Estilos AntD** — se importa `antd/dist/reset.css` en `App.tsx`; sustituye al CSS reset propio de Vite (que ya borramos junto con `App.css`/`index.css`).
- **`disableTelemetry: true`** activado en `<Refine>` para que no envíe métricas anónimas a Refine Cloud.

---

## Estado

- [x] Plan revisado y aprobado
- [x] Implementación iniciada (paso 2/10 completado)

| Paso | Estado |
|---|---|
| 1. CORS backend | ✅ Completado |
| 2. Scaffold Refine | ✅ Completado |
| 3. dataProvider FastAPI | ✅ Completado |
| 4. authProvider dev-login | ✅ Completado |
| 5. Zona pública mobile-first | ✅ Completado |
| 6. Login admin + AdminLayout | ✅ Completado |
| 7. CRUD Noticias | ✅ Completado |
| 8. CRUD Negocios/Servicios/Anuncios/Categorías | ⬜ Siguiente |
| 9. ImageUploader | ✅ Completado |
| 10. Pulido + deploy | ⬜ |

> Última actualización: 2026-06-09 — pasos 7 y 9 completados
