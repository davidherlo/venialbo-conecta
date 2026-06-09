import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { Alert, Button, Form, Space, Spin, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ServiciosForm } from "./ServiciosForm";

type Servicio = {
  id: number; nombre: string; tipo: string; descripcion?: string;
  direccion?: string; telefono?: string; horario?: string;
  informacion_adicional?: string; activo: boolean;
};

export function ServiciosEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { result: servicio, query } = useOne<Servicio>({ resource: "servicios", id: Number(id) });
  const { mutate: update, mutation } = useUpdate<Servicio>();

  useEffect(() => {
    if (servicio) form.setFieldsValue(servicio);
  }, [servicio, form]);

  const onFinish = (values: object) => {
    update({ resource: "servicios", id: Number(id), values },
      { onSuccess: () => navigate("/admin/servicios") });
  };

  if (query.isLoading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !servicio) return <Alert type="error" message="Servicio no encontrado" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/servicios")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Editar servicio #{id}</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <ServiciosForm showActivo />
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Guardar cambios</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
