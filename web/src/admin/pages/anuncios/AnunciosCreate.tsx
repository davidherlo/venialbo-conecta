import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { Alert, Button, Form, Input, Select, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const TIPO_OPTIONS = [
  { value: "mascota_perdida", label: "Mascota perdida" },
  { value: "compra_venta", label: "Compra / Venta" },
  { value: "objeto_perdido", label: "Objeto perdido" },
  { value: "otro", label: "Otro" },
];

export function AnunciosCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: create, mutation } = useCreate<{ id: number }>();

  const onFinish = (values: object) => {
    create(
      { resource: "anuncios", values },
      { onSuccess: (data) => navigate(`/admin/anuncios/${data.data.id}/editar`) },
    );
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/anuncios")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Nuevo anuncio</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
          <Select options={TIPO_OPTIONS} placeholder="Selecciona un tipo" />
        </Form.Item>
        <Form.Item name="titulo" label="Título" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="contacto" label="Contacto">
          <Input placeholder="Teléfono, email, etc." />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            Crear anuncio
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
