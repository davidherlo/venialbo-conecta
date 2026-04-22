from datetime import datetime
from pydantic import BaseModel

from app.models.anuncio import TipoAnuncio


class AnuncioBase(BaseModel):
    tipo: TipoAnuncio
    titulo: str
    descripcion: str | None = None
    contacto: str | None = None


class AnuncioCreate(AnuncioBase):
    pass


class AnuncioUpdate(BaseModel):
    tipo: TipoAnuncio | None = None
    titulo: str | None = None
    descripcion: str | None = None
    contacto: str | None = None
    imagen_url: str | None = None
    activo: bool | None = None
    fecha_caducidad: datetime | None = None


class AnuncioOut(AnuncioBase):
    id: int
    imagen_url: str | None = None
    autor_id: int
    fecha_publicacion: datetime
    activo: bool
    fecha_caducidad: datetime

    model_config = {"from_attributes": True}
