import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "@refinedev/core";
import { Button, Card, Divider, Space, Typography } from "antd";
import { EnvironmentFilled } from "@ant-design/icons";
import type { LoginParams } from "../providers/authProvider";
import { colors, fonts } from "../theme";

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
        background: `linear-gradient(135deg, ${colors.musgoFondo} 0%, ${colors.cremaOscuro} 100%)`,
        padding: 16,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 400,
          border: `1px solid ${colors.borde}`,
          boxShadow: "0 10px 32px rgba(61, 47, 31, 0.1)",
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: colors.musgoFondo,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <EnvironmentFilled style={{ fontSize: 32, color: colors.terracota }} />
          </div>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              fontFamily: fonts.serif,
              color: colors.marronTexto,
            }}
          >
            Panel de administración
          </Typography.Title>
          <Typography.Text style={{ color: colors.marronSuave }}>
            Venialbo<span style={{ color: colors.terracota }}>Conecta</span>
          </Typography.Text>
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

          <Divider style={{ margin: "4px 0", borderColor: colors.borde }} />

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
