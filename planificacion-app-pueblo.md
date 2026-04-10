# Portal de Novedades del Pueblo — Planificación del Proyecto

## 1. Visión General

**Nombre provisional:** PuebloApp (personalizable con el nombre de tu pueblo)

**Objetivo:** Aplicación Android que sirva como portal de información local donde los vecinos puedan consultar noticias, novedades y promociones de los negocios del pueblo.

**Usuarios:**
- **Vecinos** → Consultan noticias, ven promociones, filtran por categoría
- **Maintainer (Administrador)** → Publica y gestiona noticias, modera contenido
- **Negocios locales** → Publican promociones y anuncios de sus establecimientos

---

## 2. Stack Tecnológico Recomendado

### 2.1 App Android — Kotlin + Jetpack Compose

| Aspecto | Decisión | Motivo |
|---|---|---|
| **Lenguaje** | Kotlin | Lenguaje oficial de Android, moderno y conciso |
| **UI** | Jetpack Compose | Framework declarativo de Google, más rápido de desarrollar que XML |
| **IDE** | Android Studio | Herramienta oficial, gratuita, con emulador integrado |
| **Mínimo Android** | API 26 (Android 8.0) | Cubre ~95% de dispositivos activos |

> **¿Por qué Kotlin y no Flutter o React Native?** Al ser una app solo para Android (de momento), usar el framework nativo te da mejor rendimiento, acceso directo a todas las APIs de Android y la documentación oficial está pensada para Kotlin. Además, Claude Code trabaja muy bien con Kotlin.

### 2.2 Backend (Servidor) — Python + FastAPI

| Aspecto | Decisión | Motivo |
|---|---|---|
| **Lenguaje** | Python 3.11+ | Probablemente ya lo conoces, curva de aprendizaje mínima |
| **Framework** | FastAPI | Rápido, moderno, genera documentación automática (Swagger) |
| **Base de datos** | SQLite (POC) → PostgreSQL (producción) | SQLite no requiere instalación; PostgreSQL escala mejor |
| **ORM** | SQLAlchemy + Alembic | Gestión de BD y migraciones sin escribir SQL a mano |
| **Autenticación** | JWT (JSON Web Tokens) | Estándar ligero para apps móviles |
| **Almacenamiento de imágenes** | Sistema de archivos local (POC) → S3/Cloudflare R2 (producción) | Simplifica la POC |

### 2.3 Hosting para la POC (tu PC)

| Componente | Herramienta |
|---|---|
| **Servidor backend** | Tu PC ejecutando FastAPI con `uvicorn` |
| **Exponer a red local** | Tu IP local (ej: `192.168.1.XX:8000`) |
| **Exponer a Internet (opcional)** | Cloudflare Tunnel (gratis) o ngrok |
| **Base de datos** | SQLite, un solo archivo en tu disco |

### 2.4 Hosting futuro (producción, bajo coste)

| Opción | Coste aprox. | Ideal para |
|---|---|---|
| **Oracle Cloud Free Tier** | Gratis permanente | Servidor VPS con 1GB RAM, suficiente para <1.000 usuarios |
| **Railway / Render** | Gratis con límites / ~5€/mes | Deploy fácil desde GitHub |
| **VPS básico (Hetzner/Contabo)** | ~4-6€/mes | Control total, más potencia |
| **Firebase (Google)** | Gratis con cuota generosa | Si prefieres backend-as-a-service |

---

## 3. Arquitectura del Sistema

```
┌─────────────────┐         HTTPS/JSON          ┌─────────────────────┐
│                  │  ◄─────────────────────►   │                     │
│   App Android    │                             │   Backend FastAPI   │
│   (Kotlin +      │    GET /noticias            │                     │
│    Compose)      │    GET /categorias           │   ┌───────────┐    │
│                  │    GET /promociones          │   │  SQLite /  │    │
│                  │    POST /login               │   │ PostgreSQL │    │
│                  │    POST /noticias (admin)    │   └───────────┘    │
│                  │    POST /promociones (nego)  │                     │
└─────────────────┘                              │   ┌───────────┐    │
                                                  │   │  Imágenes  │    │
┌─────────────────┐         HTTPS/JSON           │   │  (local)   │    │
│  Panel Web Admin │  ◄─────────────────────►   │   └───────────┘    │
│  (opcional,      │                             │                     │
│   futuro)        │                             └─────────────────────┘
└─────────────────┘
```

---

## 4. Modelo de Datos (Entidades Principales)

### Usuarios
- `id`, `nombre`, `email`, `password_hash`, `rol` (vecino | negocio | admin), `fecha_registro`

### Categorías
- `id`, `nombre` (ej: Cultura, Deportes, Obras, Fiestas, Avisos), `icono`, `color`

### Noticias
- `id`, `titulo`, `contenido`, `imagen_url`, `categoria_id`, `autor_id`, `fecha_publicacion`, `destacada` (bool), `activa` (bool)

### Negocios
- `id`, `nombre`, `descripcion`, `direccion`, `telefono`, `logo_url`, `usuario_id`

### Promociones
- `id`, `negocio_id`, `titulo`, `descripcion`, `imagen_url`, `fecha_inicio`, `fecha_fin`, `activa` (bool)

---

## 5. Fases de Desarrollo

### FASE 0 — Preparación del Entorno ✅ COMPLETADA
> **Objetivo:** Tener todo instalado y listo para codear.

- [x] Instalar Android Studio en tu PC
- [x] Instalar Python 3.11+ y crear un entorno virtual
- [x] Crear la estructura de carpetas del proyecto (`backend/` + `android/`)
- [x] Configurar Git para control de versiones
- [x] Verificar que el emulador de Android funciona

---

### FASE 1 — Backend: API Básica de Noticias ✅ COMPLETADA
> **Objetivo:** Tener una API funcional que sirva noticias por categoría.

- [x] Modelos de BD: Categoría y Noticia (+ Usuario, Negocio, Promoción ya definidos)
- [x] Migraciones con Alembic (`alembic/versions/029202671dda_tablas_iniciales.py`)
- [x] Endpoints CRUD de categorías (`GET`, `POST`, `PUT`, `DELETE`)
- [x] Endpoints CRUD de noticias con filtros: categoría, búsqueda por título, destacadas, paginación (`skip`/`limit`)
- [x] Seed de datos de ejemplo (`scripts/seed.py`)
- [x] Subida de imágenes para noticias (`POST /noticias/{id}/imagen`, servidas en `/media`)
- [x] Documentación automática en `/docs` (Swagger)
- [x] Health check en `/health`

> **Nota:** Los endpoints de escritura aceptan `autor_id=1` de forma provisional hasta implementar la autenticación en Fase 3.

**Entregable:** ✅ API corriendo en `localhost:8000` con datos de prueba.

---

### FASE 2 — App Android: Pantalla de Noticias ✅ COMPLETADA
> **Objetivo:** App que muestre las noticias del backend.

- [x] Proyecto Android con Kotlin + Jetpack Compose
- [x] Configurar Retrofit para llamadas HTTP al backend (`RetrofitClient`, `VenialboApiService`)
- [x] DTOs para Noticia y Categoría (`NoticiaDto`, `CategoriaDto`)
- [x] Repositorio de datos (`NoticiaRepository`)
- [x] ViewModels con `StateFlow` (`ListaNoticiasViewModel`, `DetalleNoticiaViewModel`)
- [x] Pantalla principal: lista de noticias con imagen, título y fecha (`ListaNoticiasScreen`)
- [x] Pantalla de detalle de noticia con imagen completa y contenido (`DetalleNoticiaScreen`)
- [x] Filtro por categorías (chips horizontales desplazables)
- [x] Barra de búsqueda por texto en tiempo real _(extra respecto al plan)_
- [x] Paginación infinita: carga más noticias al llegar al final de la lista _(extra)_
- [x] Botón de compartir noticia vía Intent del sistema _(extra)_
- [x] Splash screen de bienvenida (`SplashScreen`)
- [x] Navegación con Navigation Compose (`NavGraph`)
- [x] Manejo de estados: cargando, error con botón de reintento, lista vacía
- [x] Diseño con Material 3 (tema de colores, tipografía personalizada)

**Entregable:** ✅ App funcional que lee noticias del backend en tu PC.

---

### FASE 3 — Autenticación con Google y Control de Roles (~2 sesiones)
> **Objetivo:** Que cada tipo de usuario entre con su cuenta de Google y tenga su nivel de acceso.

**Backend:**
- [ ] Añadir dependencia `google-auth` a `requirements.txt`
- [ ] Crear endpoint `POST /auth/google` que recibe el ID Token de Google, lo verifica contra Google y devuelve un JWT propio de sesión
- [ ] Completar el módulo `app/auth/` con: verificación del token Google, generación de JWT de sesión, y dependency de FastAPI para proteger rutas (`get_current_user`)
- [ ] Middleware de autorización por rol (`require_admin`, `require_negocio`)
- [ ] Proteger endpoints de escritura (noticias y categorías: solo admin)
- [ ] Seed inicial: registrar tu email de Google con `rol = admin` en `scripts/seed.py`

**App Android:**
- [ ] Configurar proyecto en Firebase Console y descargar `google-services.json`
- [ ] Añadir dependencias: Firebase Auth + Credential Manager (Google Sign-In)
- [ ] Pantalla de login con botón "Entrar con Google"
- [ ] Al hacer login, enviar el ID Token al backend y guardar el JWT de sesión de forma segura (`EncryptedSharedPreferences`)
- [ ] Cerrar sesión (borrar token almacenado)
- [ ] Mostrar u ocultar opciones de la UI según el rol recibido del backend

> **Nota sobre roles:** El primer login con una cuenta desconocida crea automáticamente un usuario con `rol = vecino`. El admin cambia roles manualmente (en BD o vía endpoint protegido) hasta que haya panel de administración (Fase futura).

**Entregable:** Login con Google funcional; los endpoints de escritura quedan protegidos y solo accesibles para admin.

---

### FASE 4 — Módulo de Negocios y Promociones (~2-3 sesiones)
> **Objetivo:** Los negocios pueden publicar sus promociones.

- [ ] Modelos de BD: Negocio y Promoción
- [ ] Endpoints CRUD de negocios y promociones
- [ ] Pantalla en la app: sección "Negocios del Pueblo"
- [ ] Ficha de cada negocio con sus datos y promociones activas
- [ ] Pantalla para que el negocio publique/edite sus promociones
- [ ] Fecha de caducidad automática de promociones

**Entregable:** Sección completa de negocios con promociones visibles.

---

### FASE 5 — Notificaciones Push (~1-2 sesiones)
> **Objetivo:** Avisar a los vecinos cuando haya noticias importantes.

- [ ] Integrar Firebase Cloud Messaging (FCM) — gratuito
- [ ] Registro del dispositivo para recibir notificaciones
- [ ] El admin puede enviar notificación al publicar noticia destacada
- [ ] Notificaciones por categoría (suscripción por temas)

**Entregable:** Los vecinos reciben notificaciones de noticias destacadas.

---

### FASE 6 — Pulido y Preparación para Producción (~2 sesiones)
> **Objetivo:** App lista para que la use gente real.

- [ ] Diseño final: logo, colores del pueblo, splash screen
- [ ] Manejo de errores y mensajes al usuario
- [ ] Caché offline (leer noticias sin conexión)
- [ ] Migrar backend a servidor externo (Oracle Free / VPS)
- [ ] Migrar BD de SQLite a PostgreSQL
- [ ] Configurar HTTPS con certificado SSL
- [ ] Pruebas con 5-10 vecinos beta
- [ ] Publicar en Google Play Store (~25$ pago único)

**Entregable:** App publicada y backend en servidor accesible.

---

## 6. Fases Futuras (Post-lanzamiento)

Estas fases son opcionales y se pueden abordar según las necesidades del pueblo:

- **Panel web de administración** — Para que el admin gestione contenido desde el navegador sin necesidad de la app
- **Calendario de eventos** — Fiestas, mercadillos, reuniones vecinales
- **Sección de avisos municipales** — Cortes de agua, obras, censos
- **Versión iOS** — Si hay demanda, considerar migrar a multiplataforma (Kotlin Multiplatform o Flutter)
- **Sistema de comentarios** — Los vecinos pueden opinar en las noticias
- **Directorio de servicios** — Fontaneros, electricistas, farmacias, etc.
- **Alertas meteorológicas** — Integración con AEMET
- **Multi-idioma** — Si el pueblo tiene lengua cooficial

---

## 7. Herramientas y Recursos

| Recurso | Enlace / Descripción |
|---|---|
| **Android Studio** | https://developer.android.com/studio — IDE oficial |
| **Kotlin Docs** | https://kotlinlang.org/docs/home.html |
| **Jetpack Compose** | https://developer.android.com/jetpack/compose |
| **FastAPI** | https://fastapi.tiangolo.com |
| **Material 3** | https://m3.material.io — Sistema de diseño de Google |
| **Firebase (FCM)** | https://firebase.google.com/docs/cloud-messaging |
| **Google Play Console** | https://play.google.com/console — Para publicar la app |

---

## 8. Flujo de Trabajo con Claude Code

Cada fase se traduce en 1-3 sesiones con Claude Code. El flujo recomendado es:

1. **Copiar el bloque de tareas** de la fase correspondiente
2. **Pedir a Claude Code** que genere el código paso a paso
3. **Probar** en tu entorno local (emulador + backend en tu PC)
4. **Iterar** pidiendo correcciones o mejoras
5. **Commitear** en Git antes de pasar a la siguiente fase

> **Consejo:** No intentes hacer todo de golpe. Cada fase es independiente y funcional por sí sola. Así puedes probar y validar antes de avanzar.

---

## 9. Resumen de Tiempos Estimados

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Preparación del entorno | ✅ Completada |
| 1 | Backend: API de noticias | ✅ Completada |
| 2 | App Android: pantalla de noticias | ✅ Completada |
| 3 | Autenticación y roles | ⬜ Pendiente |
| 4 | Negocios y promociones | ⬜ Pendiente |
| 5 | Notificaciones push | ⬜ Pendiente |
| 6 | Pulido y producción | ⬜ Pendiente |

> **POC funcional (fases 0-2): completada.** Siguiente hito: Fase 3 (autenticación JWT).
