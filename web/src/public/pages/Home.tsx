import { Link } from "react-router";
import { Card, Col, Row, Typography } from "antd";
import {
  BankOutlined,
  MedicineBoxOutlined,
  NotificationOutlined,
  ReadOutlined,
} from "@ant-design/icons";

const SECCIONES = [
  {
    icon: <ReadOutlined />,
    title: "Noticias",
    desc: "Novedades del pueblo",
    to: "/noticias",
    color: "#1677ff",
  },
  {
    icon: <BankOutlined />,
    title: "Negocios",
    desc: "Directorio local",
    to: "/negocios",
    color: "#52c41a",
  },
  {
    icon: <MedicineBoxOutlined />,
    title: "Servicios",
    desc: "Médico, comedor y más",
    to: "/servicios",
    color: "#fa8c16",
  },
  {
    icon: <NotificationOutlined />,
    title: "Tablón",
    desc: "Anuncios vecinales",
    to: "/tablon",
    color: "#eb2f96",
  },
];

export function Home() {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
        <Typography.Title>Bienvenido a Venialbo</Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 16 }}>
          Tu portal de novedades vecinal
        </Typography.Text>
      </div>

      <Row gutter={[16, 16]}>
        {SECCIONES.map((s) => (
          <Col key={s.to} xs={12} sm={12} md={6}>
            <Link to={s.to}>
              <Card
                hoverable
                style={{ textAlign: "center" }}
                styles={{ body: { padding: 20 } }}
              >
                <div
                  style={{
                    fontSize: 36,
                    color: s.color,
                    marginBottom: 8,
                  }}
                >
                  {s.icon}
                </div>
                <Typography.Text strong style={{ display: "block" }}>
                  {s.title}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {s.desc}
                </Typography.Text>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
