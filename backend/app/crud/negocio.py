from sqlalchemy.orm import Session

from app.models.negocio import Negocio
from app.schemas.negocio import NegocioCreate, NegocioUpdate


def get_all(db: Session, categoria: str | None = None) -> list[Negocio]:
    q = db.query(Negocio).filter(Negocio.activo == True)
    if categoria:
        q = q.filter(Negocio.categoria_negocio == categoria)
    return q.order_by(Negocio.nombre).all()


def get_by_id(db: Session, negocio_id: int) -> Negocio | None:
    return db.query(Negocio).filter(Negocio.id == negocio_id).first()


def get_categorias(db: Session) -> list[str]:
    rows = (
        db.query(Negocio.categoria_negocio)
        .filter(Negocio.activo == True, Negocio.categoria_negocio != None)
        .distinct()
        .order_by(Negocio.categoria_negocio)
        .all()
    )
    return [r[0] for r in rows]


def create(db: Session, data: NegocioCreate) -> Negocio:
    negocio = Negocio(**data.model_dump())
    db.add(negocio)
    db.commit()
    db.refresh(negocio)
    return negocio


def update(db: Session, negocio: Negocio, data: NegocioUpdate) -> Negocio:
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(negocio, campo, valor)
    db.commit()
    db.refresh(negocio)
    return negocio


def delete(db: Session, negocio: Negocio) -> None:
    db.delete(negocio)
    db.commit()
