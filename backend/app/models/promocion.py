from datetime import date
from sqlalchemy import String, Text, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Promocion(Base):
    __tablename__ = "promociones"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    negocio_id: Mapped[int] = mapped_column(ForeignKey("negocios.id"))
    titulo: Mapped[str] = mapped_column(String(255))
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    imagen_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    fecha_inicio: Mapped[date] = mapped_column(Date)
    fecha_fin: Mapped[date] = mapped_column(Date)
    activa: Mapped[bool] = mapped_column(default=True)
