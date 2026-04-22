import os
import uuid
from pathlib import Path

import aiofiles
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user, require_admin
from app.config import settings
from app.crud import anuncio as crud
from app.database import get_db
from app.models.anuncio import TipoAnuncio
from app.models.usuario import Usuario, Rol
from app.schemas.anuncio import AnuncioCreate, AnuncioOut, AnuncioUpdate

router = APIRouter(prefix="/anuncios", tags=["anuncios"])

EXTENSIONES_PERMITIDAS = {".jpg", ".jpeg", ".png", ".webp"}


def _check_autor_o_admin(anuncio, usuario: Usuario):
    if usuario.rol != Rol.admin and anuncio.autor_id != usuario.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso para modificar este anuncio")


@router.get("/", response_model=list[AnuncioOut])
def listar_anuncios(
    tipo: TipoAnuncio | None = Query(None, description="Filtrar por tipo"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.get_all(db, tipo=tipo, skip=skip, limit=limit)


@router.get("/{anuncio_id}", response_model=AnuncioOut)
def obtener_anuncio(anuncio_id: int, db: Session = Depends(get_db)):
    anuncio = crud.get_by_id(db, anuncio_id)
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    return anuncio


@router.post("/", response_model=AnuncioOut, status_code=status.HTTP_201_CREATED)
def crear_anuncio(
    data: AnuncioCreate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    return crud.create(db, data, autor_id=usuario.id)


@router.put("/{anuncio_id}", response_model=AnuncioOut)
def actualizar_anuncio(
    anuncio_id: int,
    data: AnuncioUpdate,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    anuncio = crud.get_by_id(db, anuncio_id)
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    _check_autor_o_admin(anuncio, usuario)
    return crud.update(db, anuncio, data)


@router.delete("/{anuncio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_anuncio(
    anuncio_id: int,
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    anuncio = crud.get_by_id(db, anuncio_id)
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    _check_autor_o_admin(anuncio, usuario)
    crud.delete(db, anuncio)


@router.post("/{anuncio_id}/imagen", response_model=AnuncioOut)
async def subir_imagen(
    anuncio_id: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario: Usuario = Depends(get_current_user),
):
    anuncio = crud.get_by_id(db, anuncio_id)
    if not anuncio:
        raise HTTPException(status_code=404, detail="Anuncio no encontrado")
    _check_autor_o_admin(anuncio, usuario)

    ext = Path(archivo.filename).suffix.lower()
    if ext not in EXTENSIONES_PERMITIDAS:
        raise HTTPException(status_code=400, detail=f"Formato no permitido. Usa: {EXTENSIONES_PERMITIDAS}")

    nombre_archivo = f"{uuid.uuid4().hex}{ext}"
    ruta = os.path.join(settings.images_dir, nombre_archivo)

    async with aiofiles.open(ruta, "wb") as f:
        contenido = await archivo.read()
        await f.write(contenido)

    return crud.update(db, anuncio, AnuncioUpdate(imagen_url=f"/media/imagenes/{nombre_archivo}"))
