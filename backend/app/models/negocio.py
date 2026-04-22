from sqlalchemy import String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Negocio(Base):
    __tablename__ = "negocios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(200))
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    direccion: Mapped[str | None] = mapped_column(String(300), nullable=True)
    telefono: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    web_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    redes_sociales: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    logo_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    horario: Mapped[str | None] = mapped_column(Text, nullable=True)
    categoria_negocio: Mapped[str | None] = mapped_column(String(100), nullable=True)
    activo: Mapped[bool] = mapped_column(default=True)
