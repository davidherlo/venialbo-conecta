import { useState } from "react";
import { Link } from "react-router";
import { useList, useDelete } from "@refinedev/core";
import { Alert, Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { formatFecha } from "../../../config";

type Anuncio = {
  id: number; tipo: string; titulo: string; contacto?: string;
  fecha_publicacion: string; activo: boolean;
};

const TIPO_LABEL: Record<string, string> = {
  mascota_perdida: "Mascota perdida", compra_venta: "Compra/Venta",
  objeto_perdido: "Objeto perdido", otro: "Otro",
};
const TIPO_COLOR: Record<string, string> = {
  mascota_perdida: "orange", compra_venta: "green", objeto_perdido: "blue", otro: "default",
};

const PAGE_SIZE = 10;

export function AnunciosList() {
  const [page, setPage] = useState(1);
  const { result, query } = useList<Anuncio>({
    resource: "anuncios",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
  });
  const { mutate: deleteOne } = useDelete();

  const columns = [
    { title: "Título", dataIndex: "titulo", render: (v: string) => <Typography.Text strong>{v}</Typography.Text> },
    { title: "Tipo", dataIndex: "tipo", render: (v: string) => <Tag color={TIPO_COLOR[v] ?? "default"}>{TIPO_LABEL[v] ?? v}</Tag> },
    { title: "Contacto", dataIndex: "contacto", render: (v?: string) => v ?? "—" },
    { title: "Fecha", dataIndex: "fecha_publicacion", width: 130, render: (v: string) => <Typography.Text style={{ fontSize: 12 }}>{formatFecha(v)}</Typography.Text> },
    { title: "Estado", dataIndex: "activo", width: 90, render: (v: boolean) => <Tag color={v ? "green" : "red"}>{v ? "Activo" : "Expirado"}</Tag> },
    {
      title: "Acciones", width: 100,
      render: (_: unknown, r: Anuncio) => (
        <Space>
          <Link to={`/admin/anuncios/${r.id}/editar`}><Button size="small" icon={<EditOutlined />} /></Link>
          <Popconfirm title="¿Eliminar este anuncio?" okText="Sí" cancelText="No"
            onConfirm={() => deleteOne({ resource: "anuncios", id: r.id })}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Typography.Title level={4} style={{ margin: 0 }}>Tablón de anuncios</Typography.Title>
      </div>
      {query.isError && <Alert type="error" message="Error al cargar anuncios" style={{ marginBottom: 16 }} />}
      <Table dataSource={result.data ?? []} columns={columns} rowKey="id"
        loading={query.isLoading} scroll={{ x: 600 }}
        pagination={{ current: page, pageSize: PAGE_SIZE, total: result.total ?? 0, onChange: setPage, showSizeChanger: false }} />
    </div>
  );
}
