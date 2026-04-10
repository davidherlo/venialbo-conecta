from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate, CategoriaOut
from app.crud import categoria as crud

router = APIRouter(prefix="/categorias", tags=["categorías"])


@router.get("/", response_model=list[CategoriaOut])
def listar_categorias(db: Session = Depends(get_db)):
    """Devuelve todas las categorías disponibles."""
    return crud.get_all(db)


@router.get("/{categoria_id}", response_model=CategoriaOut)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = crud.get_by_id(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return categoria


@router.post("/", response_model=CategoriaOut, status_code=status.HTTP_201_CREATED)
def crear_categoria(data: CategoriaCreate, db: Session = Depends(get_db)):
    if crud.get_by_nombre(db, data.nombre):
        raise HTTPException(status_code=409, detail="Ya existe una categoría con ese nombre")
    return crud.create(db, data)


@router.put("/{categoria_id}", response_model=CategoriaOut)
def actualizar_categoria(categoria_id: int, data: CategoriaUpdate, db: Session = Depends(get_db)):
    categoria = crud.get_by_id(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return crud.update(db, categoria, data)


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)):
    categoria = crud.get_by_id(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    crud.delete(db, categoria)
