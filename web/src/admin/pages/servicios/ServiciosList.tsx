import { useState } from "react";
import { Link } from "react-router";
import { useList, useDelete } from "@refinedev/core";
import { Alert, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { softTagStyle, type TagTone } from "../../../theme";

type Servicio = { id: number; nombre: string; tipo: string; telefono?: string; activo: boolean };

const TIPO_LABEL: Record<string, string> = {
  medico: "Médico", comedor: "Comedor", bibliobus: "Bibliobús",
  venta_ambulante: "Venta ambulante", otro: "Otro",
};
const TIPO_TONE: Record<string, TagTone> = {
  medico: "rojo", comedor: "terracota", bibliobus: "azul", venta_ambulante: "musgo", otro: "gris",
};

const PAGE_SIZE = 10;

export function ServiciosList() {
  const [page, setPage] = useState(1);
  const { result, query } = useList<Servicio>({
    resource: "servicios",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
  });
  const { mutate: deleteOne } = useDelete();

  const columns = [
    { title: "Nombre", dataIndex: "nombre", render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
    { title: "Tipo", dataIndex: "tipo", render: (v: string) => <Tag style={softTagStyle(TIPO_TONE[v] ?? "gris")}>{TIPO_LABEL[v] ?? v}</Tag> },
    { title: "Teléfono", dataIndex: "telefono", render: (v?: string) => v ?? "—" },
    { title: "Estado", dataIndex: "activo", width: 90, render: (v: boolean) => <Tag style={softTagStyle(v ? "musgo" : "rojo")}>{v ? "Activo" : "Inactivo"}</Tag> },
    {
      title: "Acciones", width: 100,
      render: (_: unknown, r: Servicio) => (
        <Space>
          <Link to={`/admin/servicios/${r.id}/editar`}><Button size="small" icon={<EditOutlined />} /></Link>
          <Popconfirm title="¿Eliminar este servicio?" okText="Sí" cancelText="No"
            onConfirm={() => deleteOne({ resource: "servicios", id: r.id })}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Servicios</Typography.Title>
        <Link to="/admin/servicios/nuevo"><Button type="primary" icon={<PlusOutlined />}>Nuevo servicio</Button></Link>
      </div>
      {query.isError && <Alert type="error" message="Error al cargar servicios" style={{ marginBottom: 16 }} />}
      <Table dataSource={result.data ?? []} columns={columns} rowKey="id"
        loading={query.isLoading} scroll={{ x: 500 }}
        pagination={{ current: page, pageSize: PAGE_SIZE, total: result.total ?? 0, onChange: setPage, showSizeChanger: false }} />
    </div>
  );
}
