# Skill: /orientate

Lee los ficheros clave del proyecto para tener contexto completo antes de trabajar.
Hazlo en paralelo para ser rápido. Al terminar, resume en una tabla el estado actual
(qué endpoints existen, qué pantallas Android existen, en qué fase estamos).

## Backend — leer en paralelo

- `backend/app/main.py` — routers registrados
- `backend/app/models/__init__.py` — modelos activos
- `backend/app/auth/dependencies.py` — dependencias de autenticación
- `backend/app/routers/anuncios.py` — router más reciente (referencia de estilo actual)

## Android — leer en paralelo

- `android/app/src/main/java/com/venialboconecta/ui/navigation/NavGraph.kt` — rutas de navegación
- `android/app/src/main/java/com/venialboconecta/data/api/VenialboApiService.kt` — endpoints consumidos
- `android/app/src/main/java/com/venialboconecta/ui/screens/MainScreen.kt` — estructura de la pantalla principal

## Al terminar

Muestra un resumen con:
1. Fase actual y qué queda pendiente de ella
2. Endpoints del backend (tabla)
3. Pantallas Android existentes
4. Cualquier inconsistencia detectada entre backend y Android (endpoints definidos pero no consumidos, o viceversa)
