import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { Alert, Button, Form, Input, Space, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

type Categoria = { id: number; nombre: string; icono?: string; color?: string };

export function CategoriasEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { result: categoria, query } = useOne<Categoria>({ resource: "categorias", id: Number(id) });
  const { mutate: update, mutation } = useUpdate<Categoria>();

  useEffect(() => {
    if (categoria) form.setFieldsValue(categoria);
  }, [categoria, form]);

  const onFinish = (values: object) => {
    update({ resource: "categorias", id: Number(id), values },
      { onSuccess: () => navigate("/admin/categorias") });
  };

  if (query.isLoading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !categoria) return <Alert type="error" message="Categoría no encontrada" />;

  return (
    <div style={{ maxWidth: 480 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/categorias")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Editar categoría #{id}</Typography.Title>
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
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Guardar cambios</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
