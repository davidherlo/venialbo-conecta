from datetime import datetime
from pydantic import BaseModel

from app.schemas.categoria import CategoriaOut


class NoticiaBase(BaseModel):
    titulo: str
    contenido: str
    imagen_url: str | None = None
    categoria_id: int
    destacada: bool = False


class NoticiaCreate(NoticiaBase):
    pass


class NoticiaUpdate(BaseModel):
    titulo: str | None = None
    contenido: str | None = None
    imagen_url: str | None = None
    categoria_id: int | None = None
    destacada: bool | None = None
    activa: bool | None = None


class NoticiaOut(NoticiaBase):
    id: int
    autor_id: int
    fecha_publicacion: datetime
    activa: bool
    categoria: CategoriaOut

    model_config = {"from_attributes": True}


class NoticiaListOut(BaseModel):
    """Versión compacta para el listado (sin contenido completo)."""
    id: int
    titulo: str
    imagen_url: str | None
    categoria: CategoriaOut
    fecha_publicacion: datetime
    destacada: bool
    activa: bool

    model_config = {"from_attributes": True}
