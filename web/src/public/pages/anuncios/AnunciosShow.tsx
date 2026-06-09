import { useParams, Link } from "react-router";
import { useOne } from "@refinedev/core";
import {
  Alert,
  Breadcrumb,
  Divider,
  Spin,
  Tag,
  Typography,
} from "antd";
import { formatFecha, imgUrl } from "../../../config";

type Anuncio = {
  id: number;
  tipo: string;
  titulo: string;
  descripcion?: string;
  contacto?: string;
  imagen_url?: string;
  fecha_publicacion: string;
  activo: boolean;
  fecha_caducidad: string;
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

export function AnunciosShow() {
  const { id } = useParams<{ id: string }>();
  const { result, query } = useOne<Anuncio>({
    resource: "anuncios",
    id: Number(id),
  });

  if (query.isLoading)
    return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !result)
    return <Alert type="error" message="Anuncio no encontrado" />;

  const a = result;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/tablon">Tablón</Link> },
          { title: a.titulo },
        ]}
      />
      {a.imagen_url && (
        <img
          src={imgUrl(a.imagen_url)}
          alt={a.titulo}
          style={{
            width: "100%",
            maxHeight: 360,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 24,
          }}
        />
      )}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Tag color={TIPO_COLOR[a.tipo] ?? "default"}>
          {TIPO_LABEL[a.tipo] ?? a.tipo}
        </Tag>
        {!a.activo && <Tag color="red">Expirado</Tag>}
      </div>
      <Typography.Title level={2}>{a.titulo}</Typography.Title>
      <Typography.Text type="secondary">
        Publicado el {formatFecha(a.fecha_publicacion)}
      </Typography.Text>
      <Divider />
      {a.descripcion && (
        <Typography.Paragraph
          style={{ fontSize: 16, whiteSpace: "pre-wrap" }}
        >
          {a.descripcion}
        </Typography.Paragraph>
      )}
      {a.contacto && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#f6f6f6",
            borderRadius: 8,
          }}
        >
          <Typography.Text strong>Contacto: </Typography.Text>
          <Typography.Text>{a.contacto}</Typography.Text>
        </div>
      )}
      <div style={{ marginTop: 24 }}>
        <Link to="/tablon">← Volver al tablón</Link>
      </div>
    </div>
  );
}
