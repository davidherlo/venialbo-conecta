import { Form, Input, Select, Switch } from "antd";

const TIPO_OPTIONS = [
  { value: "medico", label: "Médico" },
  { value: "comedor", label: "Comedor" },
  { value: "bibliobus", label: "Bibliobús" },
  { value: "venta_ambulante", label: "Venta ambulante" },
  { value: "otro", label: "Otro" },
];

type Props = { showActivo?: boolean };

export function ServiciosForm({ showActivo }: Props) {
  return (
    <>
      <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
        <Select options={TIPO_OPTIONS} placeholder="Seleccionar…" />
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
      <Form.Item name="horario" label="Horario">
        <Input.TextArea rows={2} placeholder="Ej: Martes y jueves 10:00-14:00" />
      </Form.Item>
      <Form.Item name="informacion_adicional" label="Información adicional">
        <Input.TextArea rows={2} />
      </Form.Item>
      {showActivo && (
        <Form.Item name="activo" label="Activo" valuePropName="checked">
          <Switch />
        </Form.Item>
      )}
    </>
  );
}
