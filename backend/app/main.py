from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import engine
from app import models  # noqa: F401 — necesario para que Alembic detecte los modelos
from app.routers import categorias, noticias, auth, negocios

app = FastAPI(
    title=settings.app_name,
    description="API REST para el portal de novedades del pueblo",
    version="0.1.0",
)

# Carpeta de imágenes subidas
os.makedirs(settings.images_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory="media"), name="media")


app.include_router(auth.router)
app.include_router(categorias.router)
app.include_router(noticias.router)
app.include_router(negocios.router)


@app.get("/health", tags=["sistema"])
def health_check():
    """Comprueba que la API está en marcha."""
    return {"estado": "ok", "version": "0.1.0"}
