import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Layout, Menu, Button, Drawer, Grid, Typography } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const NAV_ITEMS = [
  { key: "/noticias", label: "Noticias" },
  { key: "/negocios", label: "Negocios" },
  { key: "/servicios", label: "Servicios" },
  { key: "/tablon", label: "Tablón" },
];

export function PublicLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const location = useLocation();

  const menuItems = NAV_ITEMS.map((item) => ({
    key: item.key,
    label: (
      <Link to={item.key} onClick={() => setDrawerOpen(false)}>
        {item.label}
      </Link>
    ),
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "0 24px",
        }}
      >
        <Link to="/" style={{ flexShrink: 0 }}>
          <Typography.Text strong style={{ color: "#fff", fontSize: 18 }}>
            VenialboConecta
          </Typography.Text>
        </Link>

        {screens.md ? (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            style={{ flex: 1, borderBottom: "none", minWidth: 0 }}
          />
        ) : (
          <div style={{ marginLeft: "auto" }}>
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "#fff", fontSize: 20 }} />}
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        )}
      </Header>

      <Drawer
        title="VenialboConecta"
        placement="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={240}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: "none" }}
        />
      </Drawer>

      <Content
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          padding: "24px 16px",
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
}
