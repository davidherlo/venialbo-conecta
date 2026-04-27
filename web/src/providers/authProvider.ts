import type { AuthProvider } from "@refinedev/core";

import { TOKEN_STORAGE_KEY } from "./dataProvider";

export const IDENTITY_STORAGE_KEY = "vc_identity";

export type Rol = "vecino" | "admin";

export type LoginParams = {
  email: string;
  nombre: string;
  rol?: Rol;
};

export type Identity = {
  email: string;
  nombre: string;
  rol: Rol;
};

const readIdentity = (): Identity | null => {
  const raw = localStorage.getItem(IDENTITY_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Identity;
  } catch {
    return null;
  }
};

const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(IDENTITY_STORAGE_KEY);
};

export const venialboAuthProvider = (apiUrl: string): AuthProvider => ({
  login: async ({ email, nombre, rol = "admin" }: LoginParams) => {
    try {
      const response = await fetch(`${apiUrl}/auth/dev-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nombre, rol }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return {
          success: false,
          error: {
            name: "LoginError",
            message: text || `Error ${response.status}`,
          },
        };
      }

      const data = (await response.json()) as {
        access_token: string;
        rol: Rol;
        nombre: string;
        email: string;
      };

      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      localStorage.setItem(
        IDENTITY_STORAGE_KEY,
        JSON.stringify({ email: data.email, nombre: data.nombre, rol: data.rol }),
      );

      return { success: true, redirectTo: "/admin" };
    } catch (e) {
      return {
        success: false,
        error: {
          name: "NetworkError",
          message: e instanceof Error ? e.message : "Error de red",
        },
      };
    }
  },

  logout: async () => {
    clearSession();
    return { success: true, redirectTo: "/admin/login" };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      return { authenticated: false, redirectTo: "/admin/login" };
    }
    return { authenticated: true };
  },

  onError: async (error) => {
    const status = error?.statusCode ?? error?.status;
    if (status === 401 || status === 403) {
      clearSession();
      return { logout: true, redirectTo: "/admin/login" };
    }
    return {};
  },

  getIdentity: async () => readIdentity(),

  getPermissions: async () => readIdentity()?.rol ?? null,
});
