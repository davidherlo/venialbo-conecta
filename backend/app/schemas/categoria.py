from pydantic import BaseModel


class CategoriaBase(BaseModel):
    nombre: str
    icono: str | None = None
    color: str | None = None


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: str | None = None
    icono: str | None = None
    color: str | None = None


class CategoriaOut(CategoriaBase):
    id: int

    model_config = {"from_attributes": True}
