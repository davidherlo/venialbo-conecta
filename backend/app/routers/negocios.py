from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.crud import negocio as crud
from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.negocio import NegocioCreate, NegocioOut, NegocioUpdate

router = APIRouter(prefix="/negocios", tags=["negocios"])


@router.get("/", response_model=list[NegocioOut])
def listar_negocios(categoria: str | None = None, db: Session = Depends(get_db)):
    """Lista todos los negocios activos. Filtro opcional por categoria_negocio."""
    return crud.get_all(db, categoria=categoria)


@router.get("/categorias", response_model=list[str])
def listar_categorias_negocio(db: Session = Depends(get_db)):
    """Devuelve las categorías de negocio existentes (para construir los filtros)."""
    return crud.get_categorias(db)


@router.get("/{negocio_id}", response_model=NegocioOut)
def obtener_negocio(negocio_id: int, db: Session = Depends(get_db)):
    negocio = crud.get_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado")
    return negocio


@router.post("/", response_model=NegocioOut, status_code=status.HTTP_201_CREATED)
def crear_negocio(
    data: NegocioCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    return crud.create(db, data)


@router.put("/{negocio_id}", response_model=NegocioOut)
def actualizar_negocio(
    negocio_id: int,
    data: NegocioUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    negocio = crud.get_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado")
    return crud.update(db, negocio, data)


@router.delete("/{negocio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_negocio(
    negocio_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    negocio = crud.get_by_id(db, negocio_id)
    if not negocio:
        raise HTTPException(status_code=404, detail="Negocio no encontrado")
    crud.delete(db, negocio)
