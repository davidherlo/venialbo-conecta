from fastapi import APIRouter, Query
from app import firebase_client

router = APIRouter(prefix="/debug", tags=["debug"])


@router.post("/notificacion")
def enviar_notificacion_prueba(
    topic: str = Query(default="noticias_destacadas", description="Topic FCM destino"),
    titulo: str = Query(default="🔔 Notificación de prueba"),
    cuerpo: str = Query(default="Esto es una notificación de prueba desde el backend."),
):
    """Envía una notificación push de prueba a un topic FCM. Solo disponible con dev_mode=True."""
    firebase_client.send_to_topic(topic=topic, title=titulo, body=cuerpo)
    return {"ok": True, "topic": topic, "titulo": titulo}
