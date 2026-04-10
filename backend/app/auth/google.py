from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.config import settings


def verificar_token_google(token: str) -> dict:
    """
    Verifica un ID Token de Google y devuelve el payload si es válido.
    Lanza ValueError si el token no es válido o ha expirado.
    """
    return id_token.verify_oauth2_token(
        token,
        google_requests.Request(),
        settings.google_client_id,
    )
