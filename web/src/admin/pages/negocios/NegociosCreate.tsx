import { useNavigate } from "react-router";
import { useCreate } from "@refinedev/core";
import { Alert, Button, Form, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { NegociosForm } from "./NegociosForm";

export function NegociosCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: create, mutation } = useCreate<{ id: number }>();

  const onFinish = (values: object) => {
    create({ resource: "negocios", values },
      { onSuccess: () => navigate("/admin/negocios") });
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/negocios")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Nuevo negocio</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ activo: true }}>
        <NegociosForm />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Crear negocio</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
