import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { Alert, Button, Form, Input, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export function CategoriasCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: create, mutation } = useCreate<{ id: number }>();

  const onFinish = (values: object) => {
    create({ resource: "categorias", values },
      { onSuccess: () => navigate("/admin/categorias") });
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/categorias")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Nueva categoría</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="icono" label="Icono (emoji)" extra="Ej: 🎭 ⚽ 🌿">
          <Input />
        </Form.Item>
        <Form.Item name="color" label="Color (hex)" extra="Ej: #4CAF50">
          <Input placeholder="#1677ff" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Crear categoría</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
