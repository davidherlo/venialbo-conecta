from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.crud import servicio as crud
from app.database import get_db
from app.models.servicio import TipoServicio
from app.models.usuario import Usuario
from app.schemas.servicio import ServicioCreate, ServicioOut, ServicioUpdate

router = APIRouter(prefix="/servicios", tags=["servicios"])


@router.get("/", response_model=list[ServicioOut])
def listar_servicios(tipo: TipoServicio | None = None, db: Session = Depends(get_db)):
    """Lista todos los servicios activos. Filtro opcional por tipo."""
    return crud.get_all(db, tipo=tipo)


@router.get("/{servicio_id}", response_model=ServicioOut)
def obtener_servicio(servicio_id: int, db: Session = Depends(get_db)):
    servicio = crud.get_by_id(db, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return servicio


@router.post("/", response_model=ServicioOut, status_code=status.HTTP_201_CREATED)
def crear_servicio(
    data: ServicioCreate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    return crud.create(db, data)


@router.put("/{servicio_id}", response_model=ServicioOut)
def actualizar_servicio(
    servicio_id: int,
    data: ServicioUpdate,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    servicio = crud.get_by_id(db, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    return crud.update(db, servicio, data)


@router.delete("/{servicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_servicio(
    servicio_id: int,
    db: Session = Depends(get_db),
    _: Usuario = Depends(require_admin),
):
    servicio = crud.get_by_id(db, servicio_id)
    if not servicio:
        raise HTTPException(status_code=404, detail="Servicio no encontrado")
    crud.delete(db, servicio)
