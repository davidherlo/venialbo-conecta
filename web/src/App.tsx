import {
  Refine,
  useGetIdentity,
  useList,
  useLogin,
  useLogout,
} from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Route, Routes } from "react-router";
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Layout,
  List,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import esES from "antd/locale/es_ES";
import "antd/dist/reset.css";

import { venialboDataProvider } from "./providers/dataProvider";
import {
  venialboAuthProvider,
  type Identity,
  type LoginParams,
} from "./providers/authProvider";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

type NoticiaListItem = {
  id: number;
  titulo: string;
  destacada: boolean;
  fecha_publicacion: string;
};

function NoticiasSmokeTest() {
  const { result, query } = useList<NoticiaListItem>({
    resource: "noticias",
    pagination: { pageSize: 5 },
  });

  if (query.isLoading) return <Spin />;
  if (query.isError) {
    return (
      <Alert
        type="error"
        message="No se pudo cargar /noticias/"
        description={query.error?.message}
      />
    );
  }

  return (
    <List
      header={<strong>Últimas noticias (smoke test)</strong>}
      bordered
      dataSource={result.data ?? []}
      renderItem={(n) => (
        <List.Item>
          <span>
            #{n.id} — {n.titulo}
            {n.destacada ? " ⭐" : ""}
          </span>
        </List.Item>
      )}
      locale={{ emptyText: "Sin noticias" }}
    />
  );
}

function AuthSmokeTest() {
  const { mutate: login, isPending: isLoggingIn } = useLogin<LoginParams>();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: identity } = useGetIdentity<Identity>();

  return (
    <Card title="Auth (smoke test)" size="small">
      {identity ? (
        <Space direction="vertical">
          <span>
            Conectado como <strong>{identity.nombre}</strong> ({identity.email}){" "}
            <Tag color={identity.rol === "admin" ? "red" : "blue"}>{identity.rol}</Tag>
          </span>
          <Button onClick={() => logout({})} loading={isLoggingOut}>
            Logout
          </Button>
        </Space>
      ) : (
        <Space>
          <Button
            type="primary"
            loading={isLoggingIn}
            onClick={() =>
              login({ email: "admin@dev.local", nombre: "Admin Dev", rol: "admin" })
            }
          >
            Login como admin
          </Button>
          <Button
            loading={isLoggingIn}
            onClick={() =>
              login({ email: "vecino@dev.local", nombre: "Vecino Dev", rol: "vecino" })
            }
          >
            Login como vecino
          </Button>
        </Space>
      )}
    </Card>
  );
}

function Home() {
  return (
    <Layout style={{ minHeight: "100vh", padding: 24, gap: 24 }}>
      <Typography.Title level={2}>VenialboConecta</Typography.Title>
      <Typography.Paragraph>
        Conectado a <code>{API_URL}</code>.
      </Typography.Paragraph>
      <AuthSmokeTest />
      <NoticiasSmokeTest />
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={esES}>
        <Refine
          dataProvider={venialboDataProvider(API_URL)}
          authProvider={venialboAuthProvider(API_URL)}
          notificationProvider={useNotificationProvider}
          options={{ disableTelemetry: true }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
