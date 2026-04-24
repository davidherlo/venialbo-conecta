import json
import logging
import os
from pathlib import Path

logger = logging.getLogger(__name__)
_initialized = False


def _init() -> bool:
    """
    Orden de búsqueda de credenciales:
    1. Variable de entorno FIREBASE_SERVICE_ACCOUNT_JSON (JSON como string) — recomendado en producción
    2. Fichero en la ruta configurada en settings.firebase_service_account — útil en desarrollo
    """
    global _initialized
    if _initialized:
        return True
    try:
        import firebase_admin
        from firebase_admin import credentials

        raw_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
        if raw_json:
            cred = credentials.Certificate(json.loads(raw_json))
            logger.info("Firebase Admin SDK inicializado desde variable de entorno")
        else:
            from app.config import settings
            path = settings.firebase_service_account
            if not path or not Path(path).exists():
                logger.warning(
                    "Firebase Admin SDK no configurado "
                    f"(ni FIREBASE_SERVICE_ACCOUNT_JSON ni '{path}') — notificaciones desactivadas"
                )
                return False
            cred = credentials.Certificate(path)
            logger.info(f"Firebase Admin SDK inicializado desde fichero '{path}'")

        firebase_admin.initialize_app(cred)
        _initialized = True
        return True
    except Exception as e:
        logger.error(f"Error al inicializar Firebase Admin SDK: {e}")
        return False


def send_to_topic(topic: str, title: str, body: str) -> None:
    """Envía una notificación push a todos los dispositivos suscritos a un topic FCM."""
    if not _init():
        return
    try:
        from firebase_admin import messaging

        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(
                    channel_id="venialbo_noticias",
                ),
            ),
            topic=topic,
        )
        response = messaging.send(message)
        logger.info(f"Notificación enviada a topic '{topic}': {response}")
    except Exception as e:
        logger.error(f"Error al enviar notificación a topic '{topic}': {e}")
