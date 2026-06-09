import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate, useList } from "@refinedev/core";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Space,
  Spin,
  Switch,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ImageUploader } from "../../../components/ImageUploader";

type Categoria = { id: number; nombre: string };
type Noticia = {
  id: number;
  titulo: string;
  contenido: string;
  imagen_url?: string;
  categoria_id: number;
  categoria: Categoria;
  destacada: boolean;
  activa: boolean;
};
type NoticiaUpdateValues = {
  titulo: string;
  contenido: string;
  categoria_id: number;
  destacada: boolean;
  activa: boolean;
};

export function NoticiasEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm<NoticiaUpdateValues>();

  const { result: noticia, query } = useOne<Noticia>({
    resource: "noticias",
    id: Number(id),
  });

  const { result: catResult } = useList<Categoria>({
    resource: "categorias",
    pagination: { mode: "off" },
  });

  const { mutate: update, mutation } = useUpdate<Noticia>();
  const { isPending, error } = mutation;

  useEffect(() => {
    if (noticia) {
      form.setFieldsValue({
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        categoria_id: noticia.categoria.id,
        destacada: noticia.destacada,
        activa: noticia.activa,
      });
    }
  }, [noticia, form]);

  const onFinish = (values: NoticiaUpdateValues) => {
    update(
      { resource: "noticias", id: Number(id), values },
      { onSuccess: () => navigate("/admin/noticias") },
    );
  };

  if (query.isLoading)
    return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !noticia)
    return <Alert type="error" message="Noticia no encontrada" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/noticias")}
        />
        <Typography.Title level={4} style={{ margin: 0 }}>
          Editar noticia #{id}
        </Typography.Title>
      </Space>

      {error && (
        <Alert type="error" message={String(error)} style={{ marginBottom: 16 }} />
      )}

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="titulo"
          label="Título"
          rules={[{ required: true, message: "El título es obligatorio" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contenido"
          label="Contenido"
          rules={[{ required: true, message: "El contenido es obligatorio" }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item
          name="categoria_id"
          label="Categoría"
          rules={[{ required: true, message: "Selecciona una categoría" }]}
        >
          <Select
            placeholder="Seleccionar…"
            options={(catResult.data ?? []).map((c) => ({
              value: c.id,
              label: c.nombre,
            }))}
          />
        </Form.Item>

        <Space size="large">
          <Form.Item name="destacada" label="Destacada" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="activa" label="Activa" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Guardar cambios
          </Button>
        </Form.Item>
      </Form>

      <Divider>Imagen</Divider>
      <ImageUploader
        resource="noticias"
        id={Number(id)}
        currentUrl={noticia.imagen_url}
      />
    </div>
  );
}
