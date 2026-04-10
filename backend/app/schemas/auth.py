from pydantic import BaseModel

from app.models.usuario import Rol


class GoogleLoginRequest(BaseModel):
    id_token: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: Rol
    nombre: str
    email: str
