from datetime import datetime

from sqlalchemy.orm import Session

from app.models.anuncio import Anuncio, TipoAnuncio
from app.schemas.anuncio import AnuncioCreate, AnuncioUpdate


def get_all(
    db: Session,
    tipo: TipoAnuncio | None = None,
    skip: int = 0,
    limit: int = 20,
) -> list[Anuncio]:
    ahora = datetime.utcnow()
    q = db.query(Anuncio).filter(Anuncio.activo == True, Anuncio.fecha_caducidad > ahora)
    if tipo:
        q = q.filter(Anuncio.tipo == tipo)
    return q.order_by(Anuncio.fecha_publicacion.desc()).offset(skip).limit(limit).all()


def get_by_id(db: Session, anuncio_id: int) -> Anuncio | None:
    return db.query(Anuncio).filter(Anuncio.id == anuncio_id).first()


def create(db: Session, data: AnuncioCreate, autor_id: int) -> Anuncio:
    anuncio = Anuncio(**data.model_dump(), autor_id=autor_id)
    db.add(anuncio)
    db.commit()
    db.refresh(anuncio)
    return anuncio


def update(db: Session, anuncio: Anuncio, data: AnuncioUpdate) -> Anuncio:
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(anuncio, campo, valor)
    db.commit()
    db.refresh(anuncio)
    return anuncio


def delete(db: Session, anuncio: Anuncio) -> None:
    db.delete(anuncio)
    db.commit()
