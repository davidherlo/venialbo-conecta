import { useState } from "react";
import { Link } from "react-router";
import { useList, useDelete } from "@refinedev/core";
import { Alert, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { softTagStyle } from "../../../theme";

type Negocio = {
  id: number;
  nombre: string;
  telefono?: string;
  categoria_negocio?: string;
  activo: boolean;
};

const PAGE_SIZE = 10;

export function NegociosList() {
  const [page, setPage] = useState(1);
  const { result, query } = useList<Negocio>({
    resource: "negocios",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
  });
  const { mutate: deleteOne } = useDelete();

  const columns = [
    { title: "Nombre", dataIndex: "nombre", render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
    {
      title: "Categoría",
      dataIndex: "categoria_negocio",
      render: (v?: string) => v ? <Tag style={softTagStyle("terracota")}>{v}</Tag> : <Typography.Text type="secondary">—</Typography.Text>,
    },
    { title: "Teléfono", dataIndex: "telefono", render: (v?: string) => v ?? "—" },
    {
      title: "Estado",
      dataIndex: "activo",
      width: 90,
      render: (v: boolean) => <Tag style={softTagStyle(v ? "musgo" : "rojo")}>{v ? "Activo" : "Inactivo"}</Tag>,
    },
    {
      title: "Acciones",
      width: 100,
      render: (_: unknown, r: Negocio) => (
        <Space>
          <Link to={`/admin/negocios/${r.id}/editar`}>
            <Button size="small" icon={<EditOutlined />} />
          </Link>
          <Popconfirm title="¿Eliminar este negocio?" okText="Sí" cancelText="No"
            onConfirm={() => deleteOne({ resource: "negocios", id: r.id })}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Negocios</Typography.Title>
        <Link to="/admin/negocios/nuevo">
          <Button type="primary" icon={<PlusOutlined />}>Nuevo negocio</Button>
        </Link>
      </div>
      {query.isError && <Alert type="error" message="Error al cargar negocios" style={{ marginBottom: 16 }} />}
      <Table dataSource={result.data ?? []} columns={columns} rowKey="id"
        loading={query.isLoading} scroll={{ x: 500 }}
        pagination={{ current: page, pageSize: PAGE_SIZE, total: result.total ?? 0, onChange: setPage, showSizeChanger: false }} />
    </div>
  );
}
