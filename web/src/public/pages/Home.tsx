import { Link } from "react-router";
import { Card, Col, Row, Typography } from "antd";
import {
  BankOutlined,
  MedicineBoxOutlined,
  NotificationOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { colors, fonts } from "../../theme";

const SECCIONES = [
  {
    icon: <ReadOutlined />,
    title: "Noticias",
    desc: "Lo último que pasa en el pueblo",
    to: "/noticias",
    color: colors.musgo,
    bg: colors.musgoFondo,
  },
  {
    icon: <BankOutlined />,
    title: "Negocios",
    desc: "Directorio del comercio local",
    to: "/negocios",
    color: colors.terracota,
    bg: "#fbe9df",
  },
  {
    icon: <MedicineBoxOutlined />,
    title: "Servicios",
    desc: "Médico, comedor, bibliobús",
    to: "/servicios",
    color: "#8b6db5",
    bg: "#efe8f7",
  },
  {
    icon: <NotificationOutlined />,
    title: "Tablón",
    desc: "Anuncios entre vecinos",
    to: "/tablon",
    color: colors.dorado,
    bg: "#faf0d8",
  },
];

export function Home() {
  return (
    <div>
      <section
        style={{
          textAlign: "center",
          padding: "48px 16px 56px",
          background: `linear-gradient(135deg, ${colors.musgoFondo} 0%, ${colors.cremaOscuro} 100%)`,
          borderRadius: 20,
          marginBottom: 40,
          border: `1px solid ${colors.borde}`,
        }}
      >
        <Typography.Title
          style={{
            fontFamily: fonts.serif,
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 600,
            color: colors.marronTexto,
            margin: 0,
            marginBottom: 12,
            letterSpacing: "-0.02em",
          }}
        >
          Bienvenido a <span style={{ color: colors.musgo }}>Venialbo</span>
        </Typography.Title>
        <Typography.Text
          style={{
            fontSize: 18,
            color: colors.marronSuave,
            display: "block",
            maxWidth: 540,
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          Tu portal vecinal — noticias, negocios, servicios y un tablón para
          compartir lo que pasa en el pueblo.
        </Typography.Text>
      </section>

      <Row gutter={[20, 20]}>
        {SECCIONES.map((s) => (
          <Col key={s.to} xs={12} sm={12} md={6}>
            <Link to={s.to} className="vc-card-link">
              <Card
                styles={{ body: { padding: 24, textAlign: "center" } }}
                style={{ border: `1px solid ${colors.borde}` }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: s.bg,
                    color: s.color,
                    fontSize: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                  }}
                >
                  {s.icon}
                </div>
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    marginBottom: 4,
                    fontSize: 18,
                    color: colors.marronTexto,
                  }}
                >
                  {s.title}
                </Typography.Title>
                <Typography.Text
                  style={{ fontSize: 13, color: colors.marronSuave }}
                >
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
