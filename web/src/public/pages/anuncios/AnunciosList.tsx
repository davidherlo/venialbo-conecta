import { useState } from "react";
import { Link } from "react-router";
import { useList } from "@refinedev/core";
import {
  Alert,
  Card,
  Col,
  Pagination,
  Row,
  Spin,
  Tag,
  Typography,
} from "antd";
import { formatFecha } from "../../../config";

type Anuncio = {
  id: number;
  tipo: string;
  titulo: string;
  descripcion?: string;
  fecha_publicacion: string;
  activo: boolean;
};

const TIPO_LABEL: Record<string, string> = {
  mascota_perdida: "Mascota perdida",
  compra_venta: "Compra / Venta",
  objeto_perdido: "Objeto perdido",
  otro: "Otro",
};

const TIPO_COLOR: Record<string, string> = {
  mascota_perdida: "orange",
  compra_venta: "green",
  objeto_perdido: "blue",
  otro: "default",
};

const PAGE_SIZE = 12;

export function AnunciosList() {
  const [page, setPage] = useState(1);

  const { result, query } = useList<Anuncio>({
    resource: "anuncios",
    pagination: { currentPage: page, pageSize: PAGE_SIZE, mode: "server" },
  });

  if (query.isLoading)
    return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError)
    return <Alert type="error" message="No se pudo cargar el tablón" />;

  const items = result.data ?? [];
  const total = result.total ?? 0;

  return (
    <div>
      <Typography.Title level={2}>Tablón de anuncios</Typography.Title>
      <Row gutter={[16, 16]}>
        {items.map((a) => (
          <Col key={a.id} xs={24} sm={12} lg={8}>
            <Link to={`/tablon/${a.id}`}>
              <Card hoverable styles={{ body: { padding: 12 } }}>
                <Tag
                  color={TIPO_COLOR[a.tipo] ?? "default"}
                  style={{ marginBottom: 6 }}
                >
                  {TIPO_LABEL[a.tipo] ?? a.tipo}
                </Tag>
                <Typography.Text
                  strong
                  style={{ display: "block", marginBottom: 4 }}
                >
                  {a.titulo}
                </Typography.Text>
                {a.descripcion && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      display: "block",
                      marginBottom: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.descripcion}
                  </Typography.Text>
                )}
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  {formatFecha(a.fecha_publicacion)}
                </Typography.Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      {total > PAGE_SIZE && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Pagination
            current={page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
