import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.noticia import NoticiaCreate, NoticiaUpdate, NoticiaOut, NoticiaListOut
from app.crud import noticia as crud

router = APIRouter(prefix="/noticias", tags=["noticias"])

EXTENSIONES_PERMITIDAS = {".jpg", ".jpeg", ".png", ".webp"}


@router.get("/", response_model=list[NoticiaListOut])
def listar_noticias(
    categoria_id: int | None = Query(None, description="Filtrar por categoría"),
    destacadas: bool = Query(False, description="Solo noticias destacadas"),
    busqueda: str | None = Query(None, description="Buscar en el título"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Lista noticias activas, con filtro opcional por categoría y búsqueda."""
    return crud.get_all(db, categoria_id=categoria_id, solo_destacadas=destacadas, busqueda=busqueda, skip=skip, limit=limit)


@router.get("/{noticia_id}", response_model=NoticiaOut)
def obtener_noticia(noticia_id: int, db: Session = Depends(get_db)):
    noticia = crud.get_by_id(db, noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return noticia


@router.post("/", response_model=NoticiaOut, status_code=status.HTTP_201_CREATED)
def crear_noticia(data: NoticiaCreate, db: Session = Depends(get_db)):
    # autor_id=1 es provisional hasta que implementemos autenticación (Fase 3)
    return crud.create(db, data, autor_id=1)


@router.put("/{noticia_id}", response_model=NoticiaOut)
def actualizar_noticia(noticia_id: int, data: NoticiaUpdate, db: Session = Depends(get_db)):
    noticia = crud.get_by_id(db, noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    return crud.update(db, noticia, data)


@router.delete("/{noticia_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_noticia(noticia_id: int, db: Session = Depends(get_db)):
    noticia = crud.get_by_id(db, noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")
    crud.delete(db, noticia)


@router.post("/{noticia_id}/imagen", response_model=NoticiaOut)
async def subir_imagen(
    noticia_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Sube una imagen y la asocia a la noticia."""
    noticia = crud.get_by_id(db, noticia_id)
    if not noticia:
        raise HTTPException(status_code=404, detail="Noticia no encontrada")

    ext = Path(archivo.filename).suffix.lower()
    if ext not in EXTENSIONES_PERMITIDAS:
        raise HTTPException(status_code=400, detail=f"Formato no permitido. Usa: {EXTENSIONES_PERMITIDAS}")

    nombre_archivo = f"{uuid.uuid4().hex}{ext}"
    ruta = os.path.join(settings.images_dir, nombre_archivo)

    async with aiofiles.open(ruta, "wb") as f:
        contenido = await archivo.read()
        await f.write(contenido)

    from app.schemas.noticia import NoticiaUpdate
    return crud.update(db, noticia, NoticiaUpdate(imagen_url=f"/media/imagenes/{nombre_archivo}"))
