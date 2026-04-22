from datetime import datetime
from sqlalchemy import String, DateTime, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
import enum

from app.database import Base


class Rol(str, enum.Enum):
    vecino = "vecino"
    admin = "admin"


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    rol: Mapped[Rol] = mapped_column(SAEnum(Rol), default=Rol.vecino)
    fecha_registro: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    activo: Mapped[bool] = mapped_column(default=True)
