from sqlalchemy.orm import Session

from app.models.noticia import Noticia
from app.schemas.noticia import NoticiaCreate, NoticiaUpdate

# Número de noticias por página por defecto
DEFAULT_LIMIT = 20


def get_all(
    db: Session,
    categoria_id: int | None = None,
    solo_activas: bool = True,
    solo_destacadas: bool = False,
    busqueda: str | None = None,
    skip: int = 0,
    limit: int = DEFAULT_LIMIT,
) -> list[Noticia]:
    q = db.query(Noticia)
    if solo_activas:
        q = q.filter(Noticia.activa == True)  # noqa: E712
    if categoria_id is not None:
        q = q.filter(Noticia.categoria_id == categoria_id)
    if solo_destacadas:
        q = q.filter(Noticia.destacada == True)  # noqa: E712
    if busqueda:
        q = q.filter(Noticia.titulo.ilike(f"%{busqueda}%"))
    return q.order_by(Noticia.fecha_publicacion.desc()).offset(skip).limit(limit).all()


def get_by_id(db: Session, noticia_id: int) -> Noticia | None:
    return db.query(Noticia).filter(Noticia.id == noticia_id).first()


def create(db: Session, data: NoticiaCreate, autor_id: int) -> Noticia:
    noticia = Noticia(**data.model_dump(), autor_id=autor_id)
    db.add(noticia)
    db.commit()
    db.refresh(noticia)
    return noticia


def update(db: Session, noticia: Noticia, data: NoticiaUpdate) -> Noticia:
    for campo, valor in data.model_dump(exclude_unset=True).items():
        setattr(noticia, campo, valor)
    db.commit()
    db.refresh(noticia)
    return noticia


def delete(db: Session, noticia: Noticia) -> None:
    db.delete(noticia)
    db.commit()
