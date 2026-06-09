import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "@refinedev/core";
import { Button, Card, Divider, Space, Typography } from "antd";
import { LockOutlined } from "@ant-design/icons";
import type { LoginParams } from "../providers/authProvider";

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, data: loginResult } = useLogin<LoginParams>();

  useEffect(() => {
    if (loginResult?.success) navigate("/admin", { replace: true });
  }, [loginResult?.success, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
        padding: 16,
      }}
    >
      <Card style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <LockOutlined style={{ fontSize: 40, color: "#1677ff", marginBottom: 12 }} />
          <Typography.Title level={3} style={{ margin: 0 }}>
            Panel de administración
          </Typography.Title>
          <Typography.Text type="secondary">VenialboConecta</Typography.Text>
        </div>

        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Button
            type="primary"
            block
            size="large"
            loading={isPending}
            onClick={() =>
              login({ email: "admin@dev.local", nombre: "Admin Dev", rol: "admin" })
            }
          >
            Entrar como Admin [DEV]
          </Button>

          <Divider style={{ margin: "4px 0" }} />

          <Button
            block
            loading={isPending}
            onClick={() =>
              login({ email: "vecino@dev.local", nombre: "Vecino Dev", rol: "vecino" })
            }
          >
            Entrar como Vecino [DEV]
          </Button>
        </Space>
      </Card>
    </div>
  );
}
