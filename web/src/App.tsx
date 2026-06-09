import { Authenticated, Refine } from "@refinedev/core";
import { useNotificationProvider } from "@refinedev/antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { App as AntdApp, ConfigProvider } from "antd";
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
import { NegociosList as AdminNegociosList } from "./admin/pages/negocios/NegociosList";
import { NegociosCreate } from "./admin/pages/negocios/NegociosCreate";
import { NegociosEdit } from "./admin/pages/negocios/NegociosEdit";
import { ServiciosList as AdminServiciosList } from "./admin/pages/servicios/ServiciosList";
import { ServiciosCreate } from "./admin/pages/servicios/ServiciosCreate";
import { ServiciosEdit } from "./admin/pages/servicios/ServiciosEdit";
import { AnunciosList as AdminAnunciosList } from "./admin/pages/anuncios/AnunciosList";
import { AnunciosCreate } from "./admin/pages/anuncios/AnunciosCreate";
import { AnunciosEdit } from "./admin/pages/anuncios/AnunciosEdit";
import { NotFound } from "./pages/NotFound";
import { CategoriasList } from "./admin/pages/categorias/CategoriasList";
import { CategoriasCreate } from "./admin/pages/categorias/CategoriasCreate";
import { CategoriasEdit } from "./admin/pages/categorias/CategoriasEdit";

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={esES}>
        <AntdApp>
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
              <Route path="negocios" element={<AdminNegociosList />} />
              <Route path="negocios/nuevo" element={<NegociosCreate />} />
              <Route path="negocios/:id/editar" element={<NegociosEdit />} />
              <Route path="servicios" element={<AdminServiciosList />} />
              <Route path="servicios/nuevo" element={<ServiciosCreate />} />
              <Route path="servicios/:id/editar" element={<ServiciosEdit />} />
              <Route path="anuncios" element={<AdminAnunciosList />} />
              <Route path="anuncios/nuevo" element={<AnunciosCreate />} />
              <Route path="anuncios/:id/editar" element={<AnunciosEdit />} />
              <Route path="categorias" element={<CategoriasList />} />
              <Route path="categorias/nuevo" element={<CategoriasCreate />} />
              <Route path="categorias/:id/editar" element={<CategoriasEdit />} />
            </Route>
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

export default App;
