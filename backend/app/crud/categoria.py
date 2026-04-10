from sqlalchemy.orm import Session

from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaUpdate


def get_all(db: Session) -> list[Categoria]:
    return db.query(Categoria).order_by(Categoria.nombre).all()


def get_by_id(db: Session, categoria_id: int) -> Categoria | None:
    return db.query(Categoria).filter(Categoria.id == categoria_id).first()


def get_by_nombre(db: Session, nombre: str) -> Categoria | None:
    return db.query(Categoria).filter(Categoria.nombre == nombre).first()


def create(db: Session, data: CategoriaCreate) -> Categoria:
    categoria = Categoria(**data.model_dump())
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


def update(db: Session, categoria: Categoria, data: CategoriaUpdate) -> Categoria:
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(categoria, campo, valor)
    db.commit()
    db.refresh(categoria)
    return categoria


def delete(db: Session, categoria: Categoria) -> None:
    db.delete(categoria)
    db.commit()
