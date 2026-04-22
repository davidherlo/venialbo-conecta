import enum

from sqlalchemy import String, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class TipoServicio(str, enum.Enum):
    medico = "medico"
    comedor = "comedor"
    bibliobus = "bibliobus"
    venta_ambulante = "venta_ambulante"
    otro = "otro"


class Servicio(Base):
    __tablename__ = "servicios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(200))
    tipo: Mapped[TipoServicio] = mapped_column(SAEnum(TipoServicio))
    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    direccion: Mapped[str | None] = mapped_column(String(300), nullable=True)
    telefono: Mapped[str | None] = mapped_column(String(20), nullable=True)
    horario: Mapped[str | None] = mapped_column(Text, nullable=True)
    informacion_adicional: Mapped[str | None] = mapped_column(Text, nullable=True)
    activo: Mapped[bool] = mapped_column(default=True)
