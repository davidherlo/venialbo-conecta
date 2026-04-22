from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.google import verificar_token_google
from app.auth.jwt import crear_token
from app.config import settings
from app.crud import usuario as crud
from app.database import get_db
from app.schemas.auth import GoogleLoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["autenticación"])


@router.post("/google", response_model=TokenResponse)
def login_google(body: GoogleLoginRequest, db: Session = Depends(get_db)):
    """
    Recibe el ID Token de Google, lo verifica y devuelve un JWT de sesión propio.
    Si el usuario no existe se crea automáticamente con rol 'vecino'.
    """
    try:
        payload = verificar_token_google(body.id_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de Google inválido o expirado",
        )

    email: str = payload.get("email")
    nombre: str = payload.get("name", email)

    if not email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El token no contiene email")

    usuario, _ = crud.get_or_create(db, email=email, nombre=nombre)

    if not usuario.activo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta desactivada")

    token = crear_token({"sub": str(usuario.id), "rol": usuario.rol.value})

    return TokenResponse(
        access_token=token,
        rol=usuario.rol,
        nombre=usuario.nombre,
        email=usuario.email,
    )


class DevLoginRequest(BaseModel):
    email: str
    nombre: str
    rol: str = "vecino"


@router.post("/dev-login", response_model=TokenResponse, include_in_schema=False)
def login_dev(body: DevLoginRequest, db: Session = Depends(get_db)):
    """Bypass de Google solo disponible con DEV_MODE=True. No incluir en producción."""
    if not settings.dev_mode:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")

    usuario, _ = crud.get_or_create(db, email=body.email, nombre=body.nombre)

    if not usuario.activo:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cuenta desactivada")

    token = crear_token({"sub": str(usuario.id), "rol": body.rol})

    return TokenResponse(
        access_token=token,
        rol=body.rol,
        nombre=usuario.nombre,
        email=usuario.email,
    )
