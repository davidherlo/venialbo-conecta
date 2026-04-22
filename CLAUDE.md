# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Normas de commits

- **Nunca** incluir `Co-Authored-By: Claude` ni ninguna referencia a Claude en los mensajes de commit.

## Descripción del proyecto

**VenialboConecta** — Portal de novedades Android para un pueblo. Dos roles de usuario:
- **Vecinos** — Consultan noticias, directorios (negocios, servicios), tablón de anuncios, información turística, etc. Pueden publicar anuncios vecinales (según fase). Rol por defecto tras login con Google.
- **Admin (Maintainer)** — Único rol con permisos de escritura sobre el contenido principal (noticias, negocios, servicios, encuestas, moderación del tablón).

> **Nota:** El rol "Negocio" fue eliminado. Los negocios aparecen como fichas de directorio (información + enlaces a web/redes), pero no publican contenido por sí mismos.

El plan completo está en `planificacion-app-pueblo.md`.

---

## Stack tecnológico

### App Android
- **Lenguaje:** Kotlin
- **UI:** Jetpack Compose + Material 3
- **HTTP:** Retrofit
- **SDK mínimo:** API 26 (Android 8.0)

### Backend
- **Lenguaje:** Python 3.11+
- **Framework:** FastAPI
- **ORM:** SQLAlchemy + Alembic (migraciones)
- **Autenticación:** JWT (JSON Web Tokens)
- **BD (POC):** SQLite → PostgreSQL (producción)
- **Imágenes (POC):** Sistema de archivos local → S3/Cloudflare R2 (producción)
- **Servidor:** uvicorn

### Infraestructura (POC)
- El backend corre en local; se expone a la red local mediante IP (`192.168.1.XX:8000`) o a internet con Cloudflare Tunnel/ngrok.

---

## Comandos

### Backend
```bash
# Preparación del entorno
cd backend/
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Arrancar servidor de desarrollo
# IMPORTANTE: el venv tiene Python 3.10 y 3.11 mezclados; los paquetes están en 3.11.
# Siempre usar python3.11 explícito y matar procesos previos primero.
pkill -f uvicorn 2>/dev/null; true
.venv/bin/python3.11 -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

# Parar el servidor: Ctrl+C

# Ejecutar migraciones
.venv/bin/alembic upgrade head

# Cargar datos de ejemplo
.venv/bin/python scripts/seed.py

# Ejecutar tests
.venv/bin/pytest
```

Con el servidor en marcha, acceder desde el navegador de Windows a:
- `http://<IP-WSL2>:8000/docs` — Swagger UI (prueba de endpoints interactiva)
- `http://<IP-WSL2>:8000/redoc` — Documentación alternativa
- `http://<IP-WSL2>:8000/health` — Health check

> La IP de WSL2 puede cambiar en cada reinicio. Obtenerla con: `hostname -I | awk '{print $1}'`

### Endpoints disponibles (Fase 1)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/categorias/` | Listar todas las categorías |
| GET | `/categorias/{id}` | Detalle de una categoría |
| POST | `/categorias/` | Crear categoría |
| PUT | `/categorias/{id}` | Actualizar categoría |
| DELETE | `/categorias/{id}` | Eliminar categoría |
| GET | `/noticias/` | Listar noticias activas (filtros: `categoria_id`, `destacadas`, `skip`, `limit`) |
| GET | `/noticias/{id}` | Detalle completo de una noticia |
| POST | `/noticias/` | Crear noticia |
| PUT | `/noticias/{id}` | Actualizar noticia |
| DELETE | `/noticias/{id}` | Eliminar noticia |
| POST | `/noticias/{id}/imagen` | Subir imagen para una noticia |

### App Android
```bash
# Compilar desde la línea de comandos (en el directorio android/)
./gradlew assembleDebug

# Ejecutar tests
./gradlew test
./gradlew connectedAndroidTest   # requiere emulador o dispositivo conectado

# Instalar en dispositivo/emulador
./gradlew installDebug
```

---

## Arquitectura

```
venialbo-app/
├── backend/          # Backend Python con FastAPI
│   ├── app/
│   │   ├── main.py          # Punto de entrada, registro de routers
│   │   ├── models/          # Modelos ORM de SQLAlchemy
│   │   ├── schemas/         # Esquemas Pydantic para peticiones y respuestas
│   │   ├── routers/         # Grupos de endpoints (noticias, categorias, negocios, auth)
│   │   ├── crud/            # Capa de acceso a la base de datos
│   │   ├── auth/            # Lógica JWT y hashing de contraseñas
│   │   └── config.py        # Configuración (URL de BD, clave secreta, etc.)
│   ├── alembic/             # Migraciones de base de datos
│   ├── scripts/seed.py      # Cargador de datos de prueba
│   └── requirements.txt
└── android/          # App Android con Kotlin + Jetpack Compose
    └── app/src/main/
        ├── data/
        │   ├── api/         # Interfaces Retrofit y DTOs
        │   └── repository/  # Fuentes de datos (remota/local)
        ├── ui/
        │   ├── screens/     # Pantallas Compose (ListaNoticias, DetalleNoticia, Login, ...)
        │   └── components/  # Composables reutilizables
        └── viewmodel/       # ViewModels por pantalla
```

---

## Modelo de datos

| Entidad | Campos principales |
|---|---|
| **Usuario** | id, nombre, email, rol (vecino\|admin), fecha_registro. Sin `password_hash` (login con Google). |
| **Categoria** | id, nombre, icono, color |
| **Noticia** | id, titulo, contenido, imagen_url, categoria_id, autor_id, fecha_publicacion, destacada, activa |
| **Negocio** | id, nombre, descripcion, direccion, telefono, email, web_url, redes_sociales (JSON), logo_url, horario, categoria_negocio |
| **Servicio** | id, nombre, tipo (médico\|comedor\|bibliobús\|venta_ambulante\|otro), descripcion, direccion, telefono, horario, informacion_adicional |
| **Anuncio** | id, tipo (mascota_perdida\|compra_venta\|objeto_perdido\|otro), titulo, descripcion, imagen_url, contacto, autor_id, fecha_publicacion, activo, fecha_caducidad |
| **Encuesta** | id, pregunta, opciones (JSON), fecha_inicio, fecha_fin, activa |
| **Voto** | id, encuesta_id, usuario_id, opcion_elegida |
| **PuntoTuristico** | id, nombre, descripcion, tipo (ruta\|edificio\|lugar_interes), imagen_url, coordenadas, enlace_externo, codigo_qr |

> **Entidades actuales en BD (Fase 3):** solo `Usuario`, `Categoria` y `Noticia`. El resto se irán añadiendo en fases posteriores según el roadmap.
>
> **Eliminada:** la entidad `Promocion` — los negocios ya no publican promociones.

### Categorías de noticias (11 previstas tras Fase 4)
Cultura, Deportes, Obras, Fiestas, Avisos urgentes, Medio Ambiente, Ayuntamiento, Religión, Infantil/Colegio, Curiosidades, Asociaciones.

---

## Fases de desarrollo

| Fase | Objetivo | Estado |
|---|---|---|
| 0 | Preparación del entorno | ✅ |
| 1 | API REST del backend para noticias (CRUD + subida de imágenes + Swagger) | ✅ |
| 2 | App Android: lista de noticias + detalle + filtro por categoría | ✅ |
| 3 | Autenticación con Google + JWT + control de acceso por rol | ✅ |
| 4 | Ampliar categorías + refactor del modelo (eliminar rol negocio y entidad Promocion) | ✅ |
| 5 | Directorio de negocios (solo consulta, enlaces a web/redes) | ✅ |
| 6 | Directorio de servicios (médicos, comedor, bibliobús, venta ambulante) | ✅ |
| 7 | Tablón de anuncios vecinales | 🔄 (backend hecho, Android pendiente) |
| 8 | Notificaciones push con Firebase Cloud Messaging (FCM) | ⬜ |
| 9 | Información turística + códigos QR | ⬜ |
| 10 | Cuestionarios / encuestas vecinales | ⬜ |
| 11 | Pulido + despliegue en producción (PostgreSQL, HTTPS, Play Store) | ⬜ |

Fases aplazadas (post-lanzamiento): webcam de eventos, BlaBlaCar local, Sección Senior, panel web de administración.
