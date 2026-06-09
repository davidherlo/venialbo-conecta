import { useState } from "react";
import { Link } from "react-router";
import { useList, useDelete } from "@refinedev/core";
import {
  Alert,
  Button,
  Image,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  StarFilled,
} from "@ant-design/icons";
import { formatFecha, imgUrl } from "../../../config";
import { softTagStyle } from "../../../theme";

type Categoria = { id: number; nombre: string; color?: string };
type Noticia = {
  id: number;
  titulo: string;
  imagen_url?: string;
  categoria: Categoria;
  fecha_publicacion: string;
  destacada: boolean;
  activa: boolean;
};

const PAGE_SIZE = 10;

export function NoticiasList() {
  const [page, setPage] = useState(1);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);

  const { result, query } = useList<Noticia>({
    resource: "noticias",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
    filters: categoriaId
      ? [{ field: "categoria_id", operator: "eq", value: categoriaId }]
      : [],
  });

  const { result: catResult } = useList<Categoria>({
    resource: "categorias",
    pagination: { mode: "off" },
  });

  const { mutate: deleteOne } = useDelete();

  const columns = [
    {
      title: "Imagen",
      dataIndex: "imagen_url",
      width: 70,
      render: (url?: string) =>
        url ? (
          <Image src={imgUrl(url)} width={50} height={50} style={{ objectFit: "cover" }} preview={false} />
        ) : (
          <div style={{ width: 50, height: 50, background: "#f0f0f0", borderRadius: 4 }} />
        ),
    },
    {
      title: "Título",
      dataIndex: "titulo",
      render: (titulo: string, record: Noticia) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{titulo}</Typography.Text>
          {record.destacada && (
            <Tag icon={<StarFilled />} style={{ ...softTagStyle("dorado"), fontSize: 11 }}>
              Destacada
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Categoría",
      dataIndex: "categoria",
      render: (cat: Categoria) => (
        <Tag style={softTagStyle("musgo")}>{cat.nombre}</Tag>
      ),
    },
    {
      title: "Estado",
      dataIndex: "activa",
      width: 90,
      render: (activa: boolean) => (
        <Tag style={softTagStyle(activa ? "musgo" : "rojo")}>{activa ? "Activa" : "Inactiva"}</Tag>
      ),
    },
    {
      title: "Fecha",
      dataIndex: "fecha_publicacion",
      width: 130,
      render: (f: string) => (
        <Typography.Text style={{ fontSize: 12 }}>{formatFecha(f)}</Typography.Text>
      ),
    },
    {
      title: "Acciones",
      width: 100,
      render: (_: unknown, record: Noticia) => (
        <Space>
          <Link to={`/admin/noticias/${record.id}/editar`}>
            <Button size="small" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="¿Eliminar esta noticia?"
            okText="Sí"
            cancelText="No"
            onConfirm={() =>
              deleteOne({ resource: "noticias", id: record.id })
            }
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Noticias
        </Typography.Title>
        <Space wrap>
          <Select
            placeholder="Filtrar por categoría"
            allowClear
            style={{ minWidth: 180 }}
            value={categoriaId}
            onChange={(v) => { setCategoriaId(v ?? null); setPage(1); }}
            options={(catResult.data ?? []).map((c) => ({
              value: c.id,
              label: c.nombre,
            }))}
          />
          <Link to="/admin/noticias/nuevo">
            <Button type="primary" icon={<PlusOutlined />}>
              Nueva noticia
            </Button>
          </Link>
        </Space>
      </div>

      {query.isError && (
        <Alert type="error" message="Error al cargar noticias" style={{ marginBottom: 16 }} />
      )}

      <Table
        dataSource={result.data ?? []}
        columns={columns}
        rowKey="id"
        loading={query.isLoading}
        scroll={{ x: 600 }}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: result.total ?? 0,
          onChange: setPage,
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
