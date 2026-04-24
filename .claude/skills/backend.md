# Skill: /backend

Levanta el servidor de desarrollo del backend. Ejecuta estos pasos en orden:

## Paso 1 — matar proceso previo

```bash
pkill -f uvicorn 2>/dev/null; true
```

## Paso 2 — arrancar uvicorn en background

```bash
cd /mnt/c/Users/DHERNANDO/Projects/venialbo-app/backend && .venv/bin/python3.11 -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0
```

Usa `run_in_background: true` para no bloquear la sesión.

## Paso 3 — obtener la IP de WSL2

```bash
hostname -I | awk '{print $1}'
```

## Paso 4 — informar al usuario

Con la IP obtenida, muestra:
- Swagger UI: `http://<IP>:8000/docs`
- Health check: `http://<IP>:8000/health`
- Nota: la IP puede cambiar en cada reinicio de WSL2
