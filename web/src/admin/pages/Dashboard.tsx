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

function StatCard({
  title,
  icon,
  resource,
  color,
}: {
  title: string;
  icon: React.ReactNode;
  resource: string;
  color: string;
}) {
  const { result } = useList({
    resource,
    pagination: { pageSize: 1, mode: "server" },
  });
  return (
    <Card>
      <Statistic
        title={title}
        value={result.total ?? "—"}
        prefix={<span style={{ color }}>{icon}</span>}
      />
    </Card>
  );
}

export function Dashboard() {
  const { data: identity } = useGetIdentity<Identity>();

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 24 }}>
        Bienvenido{identity ? `, ${identity.nombre}` : ""}
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <StatCard
            title="Noticias"
            icon={<ReadOutlined />}
            resource="noticias"
            color="#1677ff"
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Negocios"
            icon={<ShopOutlined />}
            resource="negocios"
            color="#52c41a"
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Servicios"
            icon={<MedicineBoxOutlined />}
            resource="servicios"
            color="#fa8c16"
          />
        </Col>
        <Col xs={12} md={6}>
          <StatCard
            title="Anuncios"
            icon={<NotificationOutlined />}
            resource="anuncios"
            color="#eb2f96"
          />
        </Col>
      </Row>
    </div>
  );
}
