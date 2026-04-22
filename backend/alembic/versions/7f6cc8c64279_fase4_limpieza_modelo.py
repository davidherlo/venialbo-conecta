"""fase4_limpieza_modelo

Revision ID: 7f6cc8c64279
Revises: a1b2c3d4e5f6
Create Date: 2026-04-22 18:31:26.846904

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7f6cc8c64279'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Reasignar rol negocio → vecino antes de eliminar el valor del enum
    op.execute("UPDATE usuarios SET rol = 'vecino' WHERE rol = 'negocio'")

    op.drop_index('ix_promociones_id', table_name='promociones')
    op.drop_table('promociones')
    op.drop_index('ix_negocios_id', table_name='negocios')
    op.drop_table('negocios')
    # SQLite almacena el enum como VARCHAR — no hay ALTER COLUMN necesario.
    # La validación ya la hace el modelo Python.

    # Renombrar "Avisos" → "Avisos urgentes"
    op.execute("UPDATE categorias SET nombre = 'Avisos urgentes' WHERE nombre = 'Avisos'")

    # Añadir las 5 categorías nuevas
    op.execute("""
        INSERT INTO categorias (nombre, icono, color) VALUES
        ('Ayuntamiento',      '🏛️', '#607D8B'),
        ('Religión',          '⛪',  '#795548'),
        ('Infantil / Colegio','🎒',  '#00BCD4'),
        ('Curiosidades',      '📖',  '#FF5722'),
        ('Asociaciones',      '🤝',  '#3F51B5')
    """)


def downgrade() -> None:
    op.create_table('negocios',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('nombre', sa.VARCHAR(length=200), nullable=False),
    sa.Column('descripcion', sa.TEXT(), nullable=True),
    sa.Column('direccion', sa.VARCHAR(length=300), nullable=True),
    sa.Column('telefono', sa.VARCHAR(length=20), nullable=True),
    sa.Column('logo_url', sa.VARCHAR(length=500), nullable=True),
    sa.Column('usuario_id', sa.INTEGER(), nullable=False),
    sa.Column('activo', sa.BOOLEAN(), nullable=False),
    sa.ForeignKeyConstraint(['usuario_id'], ['usuarios.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('usuario_id')
    )
    op.create_index('ix_negocios_id', 'negocios', ['id'], unique=False)
    op.create_table('promociones',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('negocio_id', sa.INTEGER(), nullable=False),
    sa.Column('titulo', sa.VARCHAR(length=255), nullable=False),
    sa.Column('descripcion', sa.TEXT(), nullable=True),
    sa.Column('imagen_url', sa.VARCHAR(length=500), nullable=True),
    sa.Column('fecha_inicio', sa.DATE(), nullable=False),
    sa.Column('fecha_fin', sa.DATE(), nullable=False),
    sa.Column('activa', sa.BOOLEAN(), nullable=False),
    sa.ForeignKeyConstraint(['negocio_id'], ['negocios.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_promociones_id', 'promociones', ['id'], unique=False)
    # ### end Alembic commands ###
