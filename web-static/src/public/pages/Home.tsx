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
          position: "relative",
          textAlign: "center",
          padding: "96px 24px 104px",
          backgroundImage: `url('${import.meta.env.BASE_URL}venialbo-hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 60%",
          borderRadius: 20,
          marginBottom: 40,
          overflow: "hidden",
          border: `1px solid ${colors.borde}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, rgba(61, 47, 31, 0.35) 0%, rgba(74, 103, 48, 0.55) 100%)`,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Typography.Title
            style={{
              fontFamily: fonts.serif,
              fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
              fontWeight: 600,
              color: "#fff",
              margin: 0,
              marginBottom: 14,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            Bienvenido a Venialbo
          </Typography.Title>
          <Typography.Text
            style={{
              fontSize: 18,
              color: "rgba(255, 255, 255, 0.95)",
              display: "block",
              maxWidth: 580,
              margin: "0 auto",
              lineHeight: 1.5,
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
            }}
          >
            Tu portal vecinal — noticias, negocios, servicios y un tablón para
            compartir lo que pasa en el pueblo.
          </Typography.Text>
        </div>
        <a
          href="https://commons.wikimedia.org/wiki/File:Margen_izquierda_del_R%C3%8DO_Y_AYUNTAMIENTO.jpg"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            right: 10,
            bottom: 8,
            fontSize: 10,
            color: "rgba(255, 255, 255, 0.7)",
            textShadow: "0 1px 3px rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        >
          © Ángel Encinas Carazo · CC BY-SA 4.0
        </a>
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
