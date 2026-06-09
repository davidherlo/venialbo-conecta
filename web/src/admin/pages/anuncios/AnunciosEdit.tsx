import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOne, useUpdate } from "@refinedev/core";
import { Alert, Button, Divider, Form, Input, Select, Space, Spin, Switch, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ImageUploader } from "../../../components/ImageUploader";

type Anuncio = {
  id: number; tipo: string; titulo: string; descripcion?: string;
  contacto?: string; imagen_url?: string; activo: boolean;
};

const TIPO_OPTIONS = [
  { value: "mascota_perdida", label: "Mascota perdida" },
  { value: "compra_venta", label: "Compra / Venta" },
  { value: "objeto_perdido", label: "Objeto perdido" },
  { value: "otro", label: "Otro" },
];

export function AnunciosEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { result: anuncio, query } = useOne<Anuncio>({ resource: "anuncios", id: Number(id) });
  const { mutate: update, mutation } = useUpdate<Anuncio>();

  useEffect(() => {
    if (anuncio) form.setFieldsValue(anuncio);
  }, [anuncio, form]);

  const onFinish = (values: object) => {
    update({ resource: "anuncios", id: Number(id), values },
      { onSuccess: () => navigate("/admin/anuncios") });
  };

  if (query.isLoading) return <Spin style={{ display: "block", margin: "60px auto" }} />;
  if (query.isError || !anuncio) return <Alert type="error" message="Anuncio no encontrado" />;

  return (
    <div style={{ maxWidth: 720 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/anuncios")} />
        <Typography.Title level={4} style={{ margin: 0 }}>Editar anuncio #{id}</Typography.Title>
      </Space>
      {mutation.error && <Alert type="error" message={String(mutation.error)} style={{ marginBottom: 16 }} />}
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
          <Select options={TIPO_OPTIONS} />
        </Form.Item>
        <Form.Item name="titulo" label="Título" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="contacto" label="Contacto">
          <Input />
        </Form.Item>
        <Form.Item name="activo" label="Activo" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>Guardar cambios</Button>
        </Form.Item>
      </Form>
      <Divider>Imagen</Divider>
      <ImageUploader resource="anuncios" id={Number(id)} currentUrl={anuncio.imagen_url} />
    </div>
  );
}
