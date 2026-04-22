import enum
from datetime import datetime, timedelta

from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class TipoAnuncio(str, enum.Enum):
    mascota_perdida = "mascota_perdida"
    compra_venta = "compra_venta"
    objeto_perdido = "objeto_perdido"
    otro = "otro"


def _caducidad_default() -> datetime:
    return datetime.utcnow() + timedelta(days=30)


class Anuncio(Base):
    __tablename__ = "anuncios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    tipo: Mapped[TipoAnuncio] = mapped_column(SAEnum(TipoAnuncio), nullable=False)
    titulo: Mapped[str] = mapped_column(String(200))
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    imagen_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    contacto: Mapped[str | None] = mapped_column(String(300), nullable=True)
    autor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    fecha_publicacion: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    fecha_caducidad: Mapped[datetime] = mapped_column(DateTime, default=_caducidad_default)

    autor: Mapped["Usuario"] = relationship("Usuario", lazy="joined")  # noqa: F821
