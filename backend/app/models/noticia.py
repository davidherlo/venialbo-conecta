from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Noticia(Base):
    __tablename__ = "noticias"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    titulo: Mapped[str] = mapped_column(String(255))
    contenido: Mapped[str] = mapped_column(Text)
    imagen_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"))
    autor_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"))
    fecha_publicacion: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    destacada: Mapped[bool] = mapped_column(default=False)
    activa: Mapped[bool] = mapped_column(default=True)

    categoria: Mapped["Categoria"] = relationship("Categoria")  # noqa: F821
    autor: Mapped["Usuario"] = relationship("Usuario")  # noqa: F821
