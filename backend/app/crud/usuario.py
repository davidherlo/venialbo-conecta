from sqlalchemy.orm import Session

from app.models.usuario import Usuario, Rol


def get_by_email(db: Session, email: str) -> Usuario | None:
    return db.query(Usuario).filter(Usuario.email == email).first()


def get_or_create(db: Session, email: str, nombre: str) -> tuple[Usuario, bool]:
    """
    Devuelve (usuario, creado).
    Si el usuario no existe lo crea con rol vecino.
    """
    usuario = get_by_email(db, email)
    if usuario:
        return usuario, False

    usuario = Usuario(nombre=nombre, email=email, rol=Rol.vecino)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario, True
