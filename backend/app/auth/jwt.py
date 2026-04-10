from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.config import settings


def crear_token(datos: dict) -> str:
    payload = datos.copy()
    expira = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload["exp"] = expira
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def decodificar_token(token: str) -> dict:
    """Lanza JWTError si el token no es válido o ha expirado."""
    return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
