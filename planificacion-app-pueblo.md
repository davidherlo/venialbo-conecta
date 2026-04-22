# Portal de Novedades del Pueblo — Planificación del Proyecto

## 1. Visión General

**Nombre provisional:** VenialboConecta

**Objetivo:** Aplicación Android que sirva como portal de información local del pueblo. Centraliza noticias, avisos, información turística, directorios de servicios y utilidades para la vida en comunidad.

**Usuarios (roles simplificados):**
- **Vecinos** → Consultan toda la información del pueblo. Es el rol por defecto al registrarse con Google.
- **Admin (Maintainer)** → Único rol con permisos de escritura. Publica y modera todo el contenido (noticias, negocios, directorios, tablón, etc.).

> **Cambio importante respecto a la versión anterior:** Se elimina el rol de "Negocio". Los negocios ya no publican contenido por sí mismos. El admin mantiene su ficha (información de contacto, horario, enlaces a web/redes) y los vecinos la consultan como un directorio.

---

## 2. Estructura de contenido: Categorías vs. Módulos

La app organiza la información en **dos niveles**:

### 2.1 Categorías de noticias
Etiquetas que clasifican las noticias publicadas por el admin. Todas comparten el mismo modelo de datos (`Noticia`) y aparecen en la misma pantalla con filtro por chips.

| Categoría | Icono | Descripción |
|---|---|---|
| Cultura | 🎭 | Exposiciones, conciertos, teatro, eventos culturales |
| Deportes | ⚽ | Competiciones, actividades deportivas, clubes |
| Obras | 🏗️ | Obras municipales, arreglos, mejoras urbanas |
| Fiestas | 🎉 | Fiestas patronales, verbenas, eventos lúdicos |
| Avisos urgentes | 📢 | Cortes de agua, luz, carretera, alertas meteorológicas |
| Medio Ambiente | 🌿 | Reciclaje, limpieza, temas medioambientales |
| Ayuntamiento | 🏛️ | Plenos, bandos municipales, notificaciones oficiales |
| Religión | ⛪ | Misas, fallecimientos, eventos parroquiales |
| Infantil / Colegio | 🎒 | Actividades del colegio, extraescolares públicas |
| Curiosidades | 📖 | Recetas locales, dichos, refranes, historia, nombres de pagos |
| Asociaciones | 🤝 | AVAE, Coro y otras actividades comunitarias |

### 2.2 Módulos / Secciones propias
Funcionalidades con su propio modelo de datos y pantallas. No son noticias, son información persistente o herramientas interactivas.

| Módulo | Descripción | Fase |
|---|---|---|
| **Directorio de negocios** | Ficha por negocio con contacto, horario y enlaces a web/redes sociales | 4 |
| **Directorio de servicios** | Servicios médicos, comedor social, bibliobús, venta ambulante (fichas con horarios y contacto) | 5 |
| **Información turística** | Rutas, puntos de interés, QR con enlaces a blogs/webs/visitas virtuales | 6 |
| **Tablón de anuncios** | Clasificados vecinales: mascotas perdidas, compra/venta, objetos perdidos | 7 |
| **Cuestionarios / encuestas** | Participación vecinal en decisiones comunitarias | 8 |
| **Webcam de eventos** | Retransmisión puntual de eventos (probablemente embed a YouTube Live) | Futuro |
| **BlaBlaCar local** | Coche compartido entre vecinos | Futuro (riesgo legal/responsabilidad) |
| **Sección Senior** | Acompañamiento a personas mayores. Requiere análisis previo de privacidad y LOPD | Futuro |

---

## 3. Stack Tecnológico

### 3.1 App Android — Kotlin + Jetpack Compose

| Aspecto | Decisión | Motivo |
|---|---|---|
| **Lenguaje** | Kotlin | Lenguaje oficial de Android, moderno y conciso |
| **UI** | Jetpack Compose | Framework declarativo de Google |
| **IDE** | Android Studio | Herramienta oficial, gratuita, con emulador integrado |
| **Mínimo Android** | API 26 (Android 8.0) | Cubre ~95% de dispositivos activos |

### 3.2 Backend — Python + FastAPI

| Aspecto | Decisión | Motivo |
|---|---|---|
| **Lenguaje** | Python 3.11+ | Curva de aprendizaje mínima |
| **Framework** | FastAPI | Rápido, moderno, Swagger automático |
| **Base de datos** | SQLite (POC) → PostgreSQL (producción) | SQLite no requiere instalación; PostgreSQL escala mejor |
| **ORM** | SQLAlchemy + Alembic | Migraciones sin escribir SQL a mano |
| **Autenticación** | Google OAuth2 + JWT de sesión | Sin gestionar contraseñas |
| **Almacenamiento de imágenes** | Sistema de archivos local (POC) → S3/Cloudflare R2 (producción) | Simplifica la POC |

### 3.3 Hosting

**POC:** Backend en el PC local con `uvicorn`, expuesto por IP local (`192.168.1.XX:8000`) o con Cloudflare Tunnel/ngrok.

**Producción (opciones):** Oracle Cloud Free Tier (gratis), Railway/Render (~5€/mes), VPS Hetzner/Contabo (~4-6€/mes).

---

## 4. Arquitectura del Sistema

```
┌─────────────────┐         HTTPS/JSON          ┌─────────────────────┐
│                 │  ◄─────────────────────►   │                     │
│   App Android   │                             │   Backend FastAPI   │
│   (Kotlin +     │    GET /noticias            │                     │
│    Compose)     │    GET /categorias          │   ┌───────────┐    │
│                 │    GET /negocios            │   │  SQLite /  │    │
│                 │    GET /servicios           │   │ PostgreSQL │    │
│                 │    GET /tablon              │   └───────────┘    │
│                 │    POST /auth/google        │                     │
│                 │    POST /* (sólo admin)     │   ┌───────────┐    │
└─────────────────┘                             │   │  Imágenes  │    │
                                                 │   │  (local)   │    │
                                                 │   └───────────┘    │
                                                 └─────────────────────┘
```

---

## 5. Modelo de Datos (Entidades Principales)

### Usuarios
- `id`, `nombre`, `email`, `rol` (**vecino** | **admin**), `fecha_registro`
- Sin `password_hash` (autenticación delegada a Google)
- **Se elimina el rol `negocio`**

### Categorías
- `id`, `nombre`, `icono`, `color`

### Noticias
- `id`, `titulo`, `contenido`, `imagen_url`, `categoria_id`, `autor_id`, `fecha_publicacion`, `destacada` (bool), `activa` (bool)

### Negocios (simplificado — solo ficha informativa)
- `id`, `nombre`, `descripcion`, `direccion`, `telefono`, `email`, `web_url`, `redes_sociales` (JSON: `{facebook, instagram, ...}`), `logo_url`, `horario` (texto libre), `categoria_negocio` (ej: bar, tienda, peluquería)
- **Sin `usuario_id`** (ya no hay propietario que publique)

### Servicios (directorio municipal)
- `id`, `nombre`, `tipo` (médico | comedor | bibliobús | venta_ambulante | otro), `descripcion`, `direccion`, `telefono`, `horario`, `informacion_adicional`

### Anuncios (tablón vecinal)
- `id`, `tipo` (mascota_perdida | compra_venta | objeto_perdido | otro), `titulo`, `descripcion`, `imagen_url`, `contacto`, `autor_id`, `fecha_publicacion`, `activo`, `fecha_caducidad`

### Encuestas (cuestionarios vecinales)
- `id`, `pregunta`, `opciones` (JSON), `fecha_inicio`, `fecha_fin`, `activa`
- `Voto`: `id`, `encuesta_id`, `usuario_id`, `opcion_elegida`

### Puntos turísticos
- `id`, `nombre`, `descripcion`, `tipo` (ruta | edificio | lugar_interes), `imagen_url`, `coordenadas`, `enlace_externo`, `codigo_qr`

> **Se elimina la entidad `Promocion`** — los negocios ya no publican promociones.

---

## 6. Fases de Desarrollo

### FASE 0 — Preparación del Entorno ✅ COMPLETADA

- [x] Android Studio, Python 3.11+, estructura de carpetas, Git

---

### FASE 1 — Backend: API Básica de Noticias ✅ COMPLETADA

- [x] Modelos BD: Categoría y Noticia
- [x] Migraciones con Alembic
- [x] Endpoints CRUD de categorías y noticias (con filtros y paginación)
- [x] Seed de datos de ejemplo
- [x] Subida de imágenes
- [x] Swagger en `/docs`, health check en `/health`

---

### FASE 2 — App Android: Pantalla de Noticias ✅ COMPLETADA

- [x] Proyecto Android con Kotlin + Jetpack Compose
- [x] Retrofit + DTOs + Repository + ViewModels con `StateFlow`
- [x] Lista de noticias, detalle, filtro por categorías, búsqueda, paginación infinita, compartir, splash screen, navegación, Material 3

---

### FASE 3 — Autenticación con Google y Control de Roles ✅ COMPLETADA

- [x] Login con Google (Firebase Auth + Credential Manager)
- [x] Verificación del ID Token en backend (`google-auth`)
- [x] JWT de sesión propio (HS256) con `sub` y `rol`
- [x] `EncryptedSharedPreferences` (AES256-GCM) para el token
- [x] Endpoints de escritura protegidos con `require_admin`
- [x] Registro automático como `vecino` al primer login

---

### FASE 4 — Ampliar categorías y refactor del modelo de datos (~1-2 sesiones) ✅ COMPLETADA
> **Objetivo:** Alinear el modelo de datos con la nueva visión antes de seguir añadiendo funcionalidad.

- [x] Migración: añadir 5 categorías nuevas (Ayuntamiento, Religión, Infantil/Colegio, Curiosidades, Asociaciones)
- [x] Renombrar categoría "Avisos" → "Avisos urgentes"
- [x] Migración: eliminar rol `negocio` de `Usuario` (reasignado a `vecino`)
- [x] Migración: eliminar entidad `Promocion` y sus referencias
- [x] Actualizar seed con las nuevas categorías (11 en total)
- [x] Chips de categorías en Android: dinámicos desde la API, sin cambios necesarios

**Entregable:** Modelo de datos limpio y alineado con la nueva visión.

---

### FASE 5 — Directorio de Negocios (~2 sesiones) ✅ COMPLETADA
> **Objetivo:** Sección de negocios como directorio de consulta (sin publicación por parte del negocio).

- [x] Modelo `Negocio`: `web_url`, `redes_sociales`, `horario`, `categoria_negocio`; sin `usuario_id`
- [x] Endpoints CRUD de negocios (escritura solo admin)
- [x] Pantalla "Negocios del Pueblo" con lista + filtro por tipo
- [x] Ficha de negocio: información completa + botones para llamar / abrir web / abrir redes sociales

**Entregable:** Directorio de negocios navegable.

---

### FASE 6 — Directorio de Servicios (~1-2 sesiones) ✅ COMPLETADA
> **Objetivo:** Información práctica sobre servicios del pueblo.

- [ ] Modelo `Servicio` con tipos: médico, comedor social, bibliobús, venta ambulante, otro
- [ ] Endpoints CRUD
- [ ] Pantalla con tabs o agrupación por tipo
- [ ] Ficha con horario, contacto, información adicional (ej. menú del comedor)

**Entregable:** Los vecinos consultan horarios y contactos de todos los servicios desde la app.

---

### FASE 7 — Tablón de Anuncios Vecinales (~2 sesiones) 🔄 EN PROGRESO
> **Objetivo:** Permitir a los vecinos publicar anuncios sencillos (mascotas perdidas, compra/venta, objetos perdidos).

- [ ] Modelo `Anuncio` con tipo, imagen opcional, contacto, caducidad
- [ ] Endpoints: vecinos pueden crear anuncios; admin puede moderar/eliminar
- [ ] Pantalla de listado con filtro por tipo
- [ ] Formulario de publicación
- [ ] Caducidad automática (por defecto 30 días)

> **Decisión pendiente:** ¿moderación previa (el admin aprueba) o reactiva (se publica y el admin retira si procede)? Reactiva es más ágil para MVP.

**Entregable:** Tablón vecinal funcionando con moderación del admin.

---

### FASE 8 — Notificaciones Push (~1-2 sesiones) ⬜ PENDIENTE
> **Objetivo:** Avisar a los vecinos cuando haya noticias o avisos urgentes.

- [ ] Integrar Firebase Cloud Messaging (FCM)
- [ ] Registro del dispositivo al hacer login
- [ ] El admin puede enviar notificación al publicar noticia destacada
- [ ] Suscripción por temas (categorías), con prioridad automática para "Avisos urgentes"

**Entregable:** Los vecinos reciben notificaciones relevantes.

---

### FASE 9 — Información Turística (~2-3 sesiones) ⬜ PENDIENTE
> **Objetivo:** Rutas, edificios y lugares de interés con enlaces externos.

- [ ] Modelo `PuntoTuristico` con coordenadas y enlaces
- [ ] Generación de códigos QR por punto (se imprimen y colocan in situ)
- [ ] Pantalla con mapa (Google Maps o alternativa OSM) y fichas
- [ ] Integración con escáner QR en la app (opcional)

**Entregable:** Guía turística básica con QR.

---

### FASE 10 — Cuestionarios / Encuestas Vecinales (~1-2 sesiones) ⬜ PENDIENTE
> **Objetivo:** Participación de los vecinos en decisiones comunitarias.

- [ ] Modelo `Encuesta` y `Voto` (un voto por usuario por encuesta)
- [ ] Endpoints para crear (admin) y votar (vecinos autenticados)
- [ ] Pantalla de encuestas activas con resultados tras votar
- [ ] Notificación push al abrir una encuesta nueva

**Entregable:** Vecinos pueden participar en votaciones no vinculantes desde la app.

---

### FASE 11 — Pulido y Preparación para Producción (~2 sesiones) ⬜ PENDIENTE
> **Objetivo:** App lista para que la use gente real.

- [ ] Diseño final: logo, colores, splash screen
- [ ] Caché offline
- [ ] Migrar backend a servidor externo (Oracle Free / VPS)
- [ ] Migrar BD a PostgreSQL
- [ ] HTTPS con certificado SSL
- [ ] Pruebas con vecinos beta
- [ ] Publicar en Google Play Store (~25$ pago único)

**Entregable:** App publicada y backend en servidor accesible.

---

## 7. Fases Futuras (Post-lanzamiento)

Funcionalidades aplazadas por complejidad, coste o riesgo legal:

- **Webcam de eventos** — Mejor resuelto con un enlace a YouTube Live durante el evento, que desarrollar streaming propio.
- **BlaBlaCar local** — Requiere análisis de responsabilidad civil y cobertura de seguros. No es trivial legalmente.
- **Sección Senior** — Funcionalidad social sensible (personas que viven solas, acompañamientos). Necesita análisis de privacidad, LOPD y protocolo con servicios sociales antes de implementar.
- **Panel web de administración** — Para gestionar contenido desde el navegador sin la app.
- **Calendario unificado** — Vista agregada de fiestas, eventos, plenos.
- **Sistema de comentarios** en noticias.
- **Alertas meteorológicas** automáticas (integración AEMET).
- **Multi-idioma**.
- **Versión iOS** (Kotlin Multiplatform o Flutter).

---

## 8. Herramientas y Recursos

| Recurso | Enlace |
|---|---|
| Android Studio | https://developer.android.com/studio |
| Kotlin Docs | https://kotlinlang.org/docs/home.html |
| Jetpack Compose | https://developer.android.com/jetpack/compose |
| FastAPI | https://fastapi.tiangolo.com |
| Material 3 | https://m3.material.io |
| Firebase (FCM) | https://firebase.google.com/docs/cloud-messaging |
| Google Play Console | https://play.google.com/console |

---

## 9. Resumen del Roadmap

| Fase | Descripción | Estado |
|---|---|---|
| 0 | Preparación del entorno | ✅ Completada |
| 1 | Backend: API de noticias | ✅ Completada |
| 2 | App Android: noticias | ✅ Completada |
| 3 | Autenticación Google + roles | ✅ Completada |
| 4 | Ampliar categorías + refactor modelo | ✅ Completada |
| 5 | Directorio de negocios (sin publicación) | ✅ Completada |
| 6 | Directorio de servicios | ✅ Completada |
| 7 | Tablón de anuncios vecinales | ⬜ Pendiente |
| 8 | Notificaciones push | ⬜ Pendiente |
| 9 | Información turística + QR | ⬜ Pendiente |
| 10 | Cuestionarios / encuestas | ⬜ Pendiente |
| 11 | Pulido y producción | ⬜ Pendiente |

> **Siguiente paso:** Fase 7 — tablón de anuncios vecinales.
