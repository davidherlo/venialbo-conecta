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
import { StarFilled } from "@ant-design/icons";
import { formatFecha, imgUrl } from "../../../config";

type NoticiaDetail = {
  id: number;
  titulo: string;
  contenido: string;
  imagen_url?: string;
  categoria: { id: number; nombre: string; color?: string };
  fecha_publicacion: string;
  destacada: boolean;
  activa: boolean;
};

export function NoticiasShow() {
  const { id } = useParams<{ id: string }>();
  const { result, query } = useOne<NoticiaDetail>({
    resource: "noticias",
    id: Number(id),
  });

  if (query.isLoading)
    return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !result)
    return <Alert type="error" message="Noticia no encontrada" />;

  const n = result;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Breadcrumb
        style={{ marginBottom: 16 }}
        items={[
          { title: <Link to="/noticias">Noticias</Link> },
          { title: n.titulo },
        ]}
      />
      {n.imagen_url && (
        <img
          src={imgUrl(n.imagen_url)}
          alt={n.titulo}
          style={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 8,
            marginBottom: 24,
          }}
        />
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <Tag color={n.categoria.color ?? "blue"}>{n.categoria.nombre}</Tag>
        {n.destacada && (
          <Tag icon={<StarFilled />} color="gold">
            Destacada
          </Tag>
        )}
      </div>
      <Typography.Title level={2}>{n.titulo}</Typography.Title>
      <Typography.Text type="secondary">
        {formatFecha(n.fecha_publicacion)}
      </Typography.Text>
      <Divider />
      <Typography.Paragraph
        style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: "pre-wrap" }}
      >
        {n.contenido}
      </Typography.Paragraph>
      <Link to="/noticias">← Volver a Noticias</Link>
    </div>
  );
}
