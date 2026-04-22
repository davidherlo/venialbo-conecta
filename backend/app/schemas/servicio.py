from pydantic import BaseModel

from app.models.servicio import TipoServicio


class ServicioBase(BaseModel):
    nombre: str
    tipo: TipoServicio
    descripcion: str | None = None
    direccion: str | None = None
    telefono: str | None = None
    horario: str | None = None
    informacion_adicional: str | None = None


class ServicioCreate(ServicioBase):
    pass


class ServicioUpdate(BaseModel):
    nombre: str | None = None
    tipo: TipoServicio | None = None
    descripcion: str | None = None
    direccion: str | None = None
    telefono: str | None = None
    horario: str | None = None
    informacion_adicional: str | None = None
    activo: bool | None = None


class ServicioOut(ServicioBase):
    id: int
    activo: bool

    model_config = {"from_attributes": True}
