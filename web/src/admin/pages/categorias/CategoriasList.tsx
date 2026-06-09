import { useState } from "react";
import { Link } from "react-router";
import { useList, useDelete } from "@refinedev/core";
import { Alert, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

type Categoria = { id: number; nombre: string; icono?: string; color?: string };

const PAGE_SIZE = 20;

export function CategoriasList() {
  const [page, setPage] = useState(1);
  const { result, query } = useList<Categoria>({
    resource: "categorias",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
  });
  const { mutate: deleteOne } = useDelete();

  const columns = [
    { title: "Icono", dataIndex: "icono", width: 60, render: (v?: string) => <span style={{ fontSize: 20 }}>{v ?? "—"}</span> },
    { title: "Nombre", dataIndex: "nombre", render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
    {
      title: "Color", dataIndex: "color", width: 100,
      render: (v?: string) => v
        ? <Tag color={v} style={{ background: v, border: "none" }}>{v}</Tag>
        : <Typography.Text type="secondary">—</Typography.Text>,
    },
    {
      title: "Acciones", width: 100,
      render: (_: unknown, r: Categoria) => (
        <Space>
          <Link to={`/admin/categorias/${r.id}/editar`}><Button size="small" icon={<EditOutlined />} /></Link>
          <Popconfirm
            title="¿Eliminar esta categoría?"
            description="Las noticias asignadas a ella perderán su categoría."
            okText="Sí" cancelText="No"
            onConfirm={() => deleteOne({ resource: "categorias", id: r.id })}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Categorías</Typography.Title>
        <Link to="/admin/categorias/nuevo"><Button type="primary" icon={<PlusOutlined />}>Nueva categoría</Button></Link>
      </div>
      {query.isError && <Alert type="error" message="Error al cargar categorías" style={{ marginBottom: 16 }} />}
      <Table dataSource={result.data ?? []} columns={columns} rowKey="id"
        loading={query.isLoading}
        pagination={{ current: page, pageSize: PAGE_SIZE, total: result.total ?? 0, onChange: setPage, showSizeChanger: false }} />
    </div>
  );
}
