import { useGetIdentity } from "@refinedev/core";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  NotificationOutlined,
  ReadOutlined,
  ShopOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons";
import { useList } from "@refinedev/core";
import type { Identity } from "../../providers/authProvider";
import { colors, fonts } from "../../theme";

function StatCard({
  title,
  icon,
  resource,
  color,
  bg,
}: {
  title: string;
  icon: React.ReactNode;
  resource: string;
  color: string;
  bg: string;
}) {
  const { result } = useList({
    resource,
    pagination: { pageSize: 1, mode: "server" },
  });
  return (
    <Card style={{ border: `1px solid ${colors.borde}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: bg,
            color,
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <Statistic
          title={title}
          value={result.total ?? "—"}
          valueStyle={{ color: colors.marronTexto, fontFamily: fonts.serif, fontWeight: 600 }}
        />
      </div>
    </Card>
  );
}

export function Dashboard() {
  const { data: identity } = useGetIdentity<Identity>();

  return (
    <div>
      <Typography.Title
        level={3}
        style={{
          marginBottom: 24,
          fontFamily: fonts.serif,
          color: colors.marronTexto,
        }}
      >
        Bienvenido{identity ? `, ${identity.nombre}` : ""}
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <StatCard
            title="Noticias"
            icon={<ReadOutlined />}
            resource="noticias"
            color={colors.musgo}
            bg={colors.musgoFondo}
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Negocios"
            icon={<ShopOutlined />}
            resource="negocios"
            color={colors.terracota}
            bg="#fbe9df"
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Servicios"
            icon={<MedicineBoxOutlined />}
            resource="servicios"
            color="#6b4d99"
            bg="#efe8f7"
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Anuncios"
            icon={<NotificationOutlined />}
            resource="anuncios"
            color={colors.dorado}
            bg="#faf0d8"
          />
        </Col>
      </Row>
    </div>
  );
}
