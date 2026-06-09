import { Authenticated, Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
import "antd/dist/reset.css";

import { venialboDataProvider } from "./providers/dataProvider";
import { venialboAuthProvider } from "./providers/authProvider";
import { API_URL } from "./config";

import { PublicLayout } from "./public/layout/PublicLayout";
import { Home } from "./public/pages/Home";
import { NoticiasList } from "./public/pages/noticias/NoticiasList";
import { NoticiasShow } from "./public/pages/noticias/NoticiasShow";
import { NegociosList } from "./public/pages/negocios/NegociosList";
import { NegociosShow } from "./public/pages/negocios/NegociosShow";
import { ServiciosList } from "./public/pages/servicios/ServiciosList";
import { ServiciosShow } from "./public/pages/servicios/ServiciosShow";
import { AnunciosList } from "./public/pages/anuncios/AnunciosList";
import { AnunciosShow } from "./public/pages/anuncios/AnunciosShow";

import { LoginPage } from "./admin/LoginPage";
import { AdminLayout } from "./admin/layout/AdminLayout";
import { Dashboard } from "./admin/pages/Dashboard";
import { NoticiasList as AdminNoticiasList } from "./admin/pages/noticias/NoticiasList";
import { NoticiasCreate } from "./admin/pages/noticias/NoticiasCreate";
import { NoticiasEdit } from "./admin/pages/noticias/NoticiasEdit";

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
            {/* Zona pública */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/noticias" element={<NoticiasList />} />
              <Route path="/noticias/:id" element={<NoticiasShow />} />
              <Route path="/negocios" element={<NegociosList />} />
              <Route path="/negocios/:id" element={<NegociosShow />} />
              <Route path="/servicios" element={<ServiciosList />} />
              <Route path="/servicios/:id" element={<ServiciosShow />} />
              <Route path="/tablon" element={<AnunciosList />} />
              <Route path="/tablon/:id" element={<AnunciosShow />} />
            </Route>

            {/* Zona admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <Authenticated
                  key="admin-zone"
                  fallback={<Navigate to="/admin/login" replace />}
                >
                  <AdminLayout />
                </Authenticated>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="noticias" element={<AdminNoticiasList />} />
              <Route path="noticias/nuevo" element={<NoticiasCreate />} />
              <Route path="noticias/:id/editar" element={<NoticiasEdit />} />
            </Route>
          </Routes>
        </Refine>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
