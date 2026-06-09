import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { Alert, Button, Form, Space, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { NegociosForm } from "./NegociosForm";

type Negocio = {
  id: number; nombre: string; descripcion?: string; direccion?: string;
  telefono?: string; email?: string; web_url?: string; logo_url?: string;
  horario?: string; categoria_negocio?: string;
  redes_sociales?: Record<string, string>; activo: boolean;
};

export function NegociosEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { result: negocio, query } = useOne<Negocio>({ resource: "negocios", id: Number(id) });
  const { mutate: update, mutation } = useUpdate<Negocio>();

  useEffect(() => {
    if (negocio) form.setFieldsValue(negocio);
  }, [negocio, form]);

  const onFinish = (values: object) => {
    update({ resource: "negocios", id: Number(id), values },
      { onSuccess: () => navigate("/admin/negocios") });
  };

  if (query.isLoading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !negocio) return <Alert type="error" message="Negocio no encontrado" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/negocios")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Editar negocio #{id}</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <NegociosForm showActivo />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Guardar cambios</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
