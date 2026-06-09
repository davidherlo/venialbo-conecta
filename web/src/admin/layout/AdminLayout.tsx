import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useLogout, useGetIdentity } from "@refinedev/core";
import {
  Avatar,
  Button,
  Drawer,
  Grid,
  Layout,
  Menu,
  Tag,
  Typography,
} from "antd";
import {
  LogoutOutlined,
  MenuOutlined,
  MedicineBoxOutlined,
  NotificationOutlined,
  ReadOutlined,
  ShopOutlined,
  TagsOutlined,
  DashboardOutlined,
  EnvironmentFilled,
} from "@ant-design/icons";
import type { Identity } from "../../providers/authProvider";
import { colors, fonts, softTagStyle } from "../../theme";

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

const NAV_ITEMS = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard", exact: true },
  { key: "/admin/noticias", icon: <ReadOutlined />, label: "Noticias" },
  { key: "/admin/negocios", icon: <ShopOutlined />, label: "Negocios" },
  { key: "/admin/servicios", icon: <MedicineBoxOutlined />, label: "Servicios" },
  { key: "/admin/anuncios", icon: <NotificationOutlined />, label: "Tablón" },
  { key: "/admin/categorias", icon: <TagsOutlined />, label: "Categorías" },
];

function activeKey(pathname: string): string {
  const exact = NAV_ITEMS.find((i) => i.exact && pathname === i.key);
  if (exact) return exact.key;
  const match = [...NAV_ITEMS]
    .reverse()
    .find((i) => !i.exact && pathname.startsWith(i.key));
  return match?.key ?? "/admin";
}

export function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: logout } = useLogout();
  const { data: identity } = useGetIdentity<Identity>();

  const menuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      navigate(item.key);
      setDrawerOpen(false);
    },
  }));

  const sidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px 16px",
          borderBottom: `1px solid ${colors.borde}`,
          flexShrink: 0,
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: colors.musgo,
            fontFamily: fonts.serif,
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: "-0.01em",
          }}
        >
          <EnvironmentFilled style={{ color: colors.terracota, fontSize: 20 }} />
          <span>
            Venialbo<span style={{ color: colors.terracota }}>Conecta</span>
          </span>
        </Link>
        <Typography.Text
          style={{ display: "block", fontSize: 11, marginTop: 4, color: colors.marronSuave }}
        >
          Panel de administración
        </Typography.Text>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[activeKey(location.pathname)]}
        items={menuItems}
        style={{ flex: 1, borderRight: "none", overflow: "auto" }}
      />

      <div
        style={{
          padding: "12px 16px",
          borderTop: `1px solid ${colors.borde}`,
          flexShrink: 0,
        }}
      >
        {identity && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <Avatar size="small" style={{ background: colors.musgo, flexShrink: 0 }}>
              {identity.nombre[0].toUpperCase()}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Typography.Text
                style={{ display: "block", fontSize: 12, fontWeight: 500 }}
                ellipsis
              >
                {identity.nombre}
              </Typography.Text>
              <Tag
                style={{
                  ...softTagStyle(identity.rol === "admin" ? "terracota" : "azul"),
                  fontSize: 10,
                  lineHeight: "16px",
                  padding: "0 6px",
                }}
              >
                {identity.rol}
              </Tag>
            </div>
          </div>
        )}
        <Button
          icon={<LogoutOutlined />}
          block
          danger
          size="small"
          onClick={() => logout({})}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );

  const SIDER_WIDTH = 220;

  return (
    <Layout style={{ minHeight: "100vh", background: colors.crema }}>
      {screens.md ? (
        <Sider
          width={SIDER_WIDTH}
          style={{
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            background: colors.blanco,
            borderRight: `1px solid ${colors.borde}`,
            overflow: "hidden",
          }}
        >
          {sidebarContent}
        </Sider>
      ) : (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={SIDER_WIDTH}
          styles={{ body: { padding: 0, height: "100%" } }}
          title={null}
          closable={false}
        >
          {sidebarContent}
        </Drawer>
      )}

      <Layout style={{ marginLeft: screens.md ? SIDER_WIDTH : 0 }}>
        <Header
          style={{
            background: colors.blanco,
            borderBottom: `1px solid ${colors.borde}`,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: "0 1px 4px rgba(61, 47, 31, 0.04)",
          }}
        >
          {!screens.md && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          )}
          <Typography.Text
            strong
            style={{ fontFamily: fonts.serif, fontSize: 18, color: colors.marronTexto }}
          >
            {NAV_ITEMS.find(
              (i) =>
                i.exact
                  ? location.pathname === i.key
                  : location.pathname.startsWith(i.key) && !i.exact
                    ? location.pathname.startsWith(i.key)
                    : false,
            )?.label ??
              NAV_ITEMS.find((i) => location.pathname === i.key)?.label ??
              "Admin"}
          </Typography.Text>
        </Header>

        <Content style={{ padding: 24, minHeight: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
