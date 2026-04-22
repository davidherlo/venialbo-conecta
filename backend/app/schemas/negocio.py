from pydantic import BaseModel


class NegocioBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    direccion: str | None = None
    telefono: str | None = None
    email: str | None = None
    web_url: str | None = None
    redes_sociales: dict | None = None
    logo_url: str | None = None
    horario: str | None = None
    categoria_negocio: str | None = None


class NegocioCreate(NegocioBase):
    pass


class NegocioUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    direccion: str | None = None
    telefono: str | None = None
    email: str | None = None
    web_url: str | None = None
    redes_sociales: dict | None = None
    logo_url: str | None = None
    horario: str | None = None
    categoria_negocio: str | None = None
    activo: bool | None = None


class NegocioOut(NegocioBase):
    id: int
    activo: bool

    model_config = {"from_attributes": True}
