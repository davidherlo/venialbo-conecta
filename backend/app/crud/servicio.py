from sqlalchemy.orm import Session

from app.models.servicio import Servicio, TipoServicio
from app.schemas.servicio import ServicioCreate, ServicioUpdate


def get_all(db: Session, tipo: TipoServicio | None = None) -> list[Servicio]:
    q = db.query(Servicio).filter(Servicio.activo == True)
    if tipo:
        q = q.filter(Servicio.tipo == tipo)
    return q.order_by(Servicio.tipo, Servicio.nombre).all()


def get_by_id(db: Session, servicio_id: int) -> Servicio | None:
    return db.query(Servicio).filter(Servicio.id == servicio_id).first()


def create(db: Session, data: ServicioCreate) -> Servicio:
    servicio = Servicio(**data.model_dump())
    db.add(servicio)
    db.commit()
    db.refresh(servicio)
    return servicio


def update(db: Session, servicio: Servicio, data: ServicioUpdate) -> Servicio:
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(servicio, campo, valor)
    db.commit()
    db.refresh(servicio)
    return servicio


def delete(db: Session, servicio: Servicio) -> None:
    db.delete(servicio)
    db.commit()
