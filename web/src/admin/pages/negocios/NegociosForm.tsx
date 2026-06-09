import { Form, Input, Switch } from "antd";

type Props = { showActivo?: boolean };

export function NegociosForm({ showActivo }: Props) {
  return (
    <>
      <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="descripcion" label="Descripción">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item name="direccion" label="Dirección">
        <Input />
      </Form.Item>
      <Form.Item name="telefono" label="Teléfono">
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email">
        <Input type="email" />
      </Form.Item>
      <Form.Item name="web_url" label="Web">
        <Input placeholder="https://…" />
      </Form.Item>
      <Form.Item name="horario" label="Horario">
        <Input.TextArea rows={2} placeholder="Ej: L-V 9:00-14:00, 16:00-20:00" />
      </Form.Item>
      <Form.Item name="categoria_negocio" label="Categoría">
        <Input placeholder="Ej: bar, tienda, peluquería…" />
      </Form.Item>
      <Form.Item name={["redes_sociales", "facebook"]} label="Facebook">
        <Input placeholder="https://facebook.com/…" />
      </Form.Item>
      <Form.Item name={["redes_sociales", "instagram"]} label="Instagram">
        <Input placeholder="https://instagram.com/…" />
      </Form.Item>
      {showActivo && (
        <Form.Item name="activo" label="Activo" valuePropName="checked">
          <Switch />
        </Form.Item>
      )}
    </>
  );
}
