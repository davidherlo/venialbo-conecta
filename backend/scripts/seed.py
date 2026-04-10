"""
Carga datos de ejemplo en la base de datos.
Ejecutar desde el directorio backend/ con:
    .venv/bin/python scripts/seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.database import SessionLocal
from app.models.categoria import Categoria
from app.models.usuario import Usuario, Rol
from app.models.noticia import Noticia

# Email de Google del administrador — cámbialo por el tuyo
ADMIN_EMAIL = "david.panader@gmail.com"
ADMIN_NOMBRE = "Administrador"

CATEGORIAS = [
    {"nombre": "Cultura", "icono": "🎭", "color": "#9C27B0"},
    {"nombre": "Deportes", "icono": "⚽", "color": "#4CAF50"},
    {"nombre": "Obras", "icono": "🏗️", "color": "#FF9800"},
    {"nombre": "Fiestas", "icono": "🎉", "color": "#E91E63"},
    {"nombre": "Avisos", "icono": "📢", "color": "#F44336"},
    {"nombre": "Medio Ambiente", "icono": "🌿", "color": "#8BC34A"},
]

NOTICIAS_EJEMPLO = [
    {
        "titulo": "Gran éxito de la feria del libro local",
        "contenido": "Este fin de semana celebramos la XII edición de la feria del libro, con más de 20 autores locales y una asistencia récord de 500 vecinos. La próxima edición ya está planificada para el año que viene.",
        "destacada": True,
        "categoria_nombre": "Cultura",
    },
    {
        "titulo": "Obras de mejora en la calle Mayor",
        "contenido": "Durante los próximos tres meses se llevarán a cabo obras de renovación del pavimento y la red de saneamiento en la calle Mayor. Habrá cortes de tráfico parciales de lunes a viernes.",
        "destacada": False,
        "categoria_nombre": "Obras",
    },
    {
        "titulo": "El equipo local asciende a primera regional",
        "contenido": "Después de una temporada brillante, el Club Deportivo del pueblo ha conseguido el ascenso a primera regional. El ayuntamiento los recibirá en un acto de reconocimiento el próximo sábado.",
        "destacada": True,
        "categoria_nombre": "Deportes",
    },
    {
        "titulo": "Programa de las fiestas patronales",
        "contenido": "Ya está disponible el programa completo de las fiestas en honor a nuestro patrón. Del 15 al 20 de agosto habrá conciertos, verbenas, deportes tradicionales y el tradicional encierro.",
        "destacada": True,
        "categoria_nombre": "Fiestas",
    },
    {
        "titulo": "Corte de agua el jueves por mantenimiento",
        "contenido": "El jueves entre las 9:00 y las 14:00 habrá un corte de suministro de agua en el barrio norte por trabajos de mantenimiento preventivo en la red.",
        "destacada": False,
        "categoria_nombre": "Avisos",
    },
    {
        "titulo": "Nueva zona de reciclaje en el parque central",
        "contenido": "Se han instalado nuevos contenedores de reciclaje en el parque central. Los vecinos pueden separar vidrio, papel, plástico y residuos orgánicos.",
        "destacada": False,
        "categoria_nombre": "Medio Ambiente",
    },
]


def seed():
    db = SessionLocal()
    try:
        # Evitar duplicados si ya hay datos
        if db.query(Categoria).count() > 0:
            print("La base de datos ya tiene datos. Omitiendo seed.")
            return

        print("Insertando categorías...")
        categorias = {}
        for c in CATEGORIAS:
            cat = Categoria(**c)
            db.add(cat)
            db.flush()
            categorias[c["nombre"]] = cat
        db.commit()

        print("Creando usuario admin...")
        admin = Usuario(
            nombre=ADMIN_NOMBRE,
            email=ADMIN_EMAIL,
            rol=Rol.admin,
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)

        print("Insertando noticias de ejemplo...")
        for n in NOTICIAS_EJEMPLO:
            cat = categorias[n["categoria_nombre"]]
            noticia = Noticia(
                titulo=n["titulo"],
                contenido=n["contenido"],
                destacada=n["destacada"],
                categoria_id=cat.id,
                autor_id=admin.id,
            )
            db.add(noticia)
        db.commit()

        print("✓ Seed completado.")
        print(f"  {len(CATEGORIAS)} categorías")
        print(f"  {len(NOTICIAS_EJEMPLO)} noticias")
        print(f"  1 usuario admin  (email: {ADMIN_EMAIL})")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
