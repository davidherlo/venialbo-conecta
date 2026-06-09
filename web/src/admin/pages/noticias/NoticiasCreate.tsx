import { useNavigate } from "react-router";
import { useCreate, useList } from "@refinedev/core";
import {
  Alert,
  Button,
  Form,
  Input,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

type Categoria = { id: number; nombre: string };
type NoticiaCreateValues = {
  titulo: string;
  contenido: string;
  categoria_id: number;
  destacada: boolean;
};

export function NoticiasCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<NoticiaCreateValues>();
  const { mutate: create, mutation } = useCreate<{ id: number }>();
  const { isPending, error } = mutation;
  const { result: catResult } = useList<Categoria>({
    resource: "categorias",
    pagination: { mode: "off" },
  });

  const onFinish = (values: NoticiaCreateValues) => {
    create(
      { resource: "noticias", values },
      { onSuccess: () => navigate("/admin/noticias") },
    );
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/noticias")} />
        <Typography.Title level={4} style={{ margin: 0 }}>
          Nueva noticia
        </Typography.Title>
      </Space>

      {error && (
        <Alert type="error" message={String(error)} style={{ marginBottom: 16 }} />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ destacada: false }}
      >
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

        <Form.Item name="destacada" label="Destacada" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Crear noticia
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
