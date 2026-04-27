import type { DataProvider, CrudFilter, BaseKey } from "@refinedev/core";

export const TOKEN_STORAGE_KEY = "vc_token";

const authHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const collectionUrl = (apiUrl: string, resource: string) =>
  `${apiUrl}/${resource}/`;

const itemUrl = (apiUrl: string, resource: string, id: BaseKey) =>
  `${apiUrl}/${resource}/${id}`;

const buildFilterParams = (filters?: CrudFilter[]): URLSearchParams => {
  const params = new URLSearchParams();
  filters?.forEach((f) => {
    if (
      "field" in f &&
      f.operator === "eq" &&
      f.value !== undefined &&
      f.value !== null &&
      f.value !== ""
    ) {
      params.append(f.field, String(f.value));
    }
  });
  return params;
};

const parseResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
};

export const venialboDataProvider = (apiUrl: string): DataProvider => ({
  getApiUrl: () => apiUrl,

  getList: async ({ resource, pagination, filters }) => {
    const { currentPage = 1, pageSize = 20, mode = "server" } = pagination ?? {};
    const params = buildFilterParams(filters);

    if (mode === "server") {
      const skip = (currentPage - 1) * pageSize;
      params.set("skip", String(skip));
      params.set("limit", String(pageSize));

      const url = `${collectionUrl(apiUrl, resource)}?${params}`;
      const data = await parseResponse(await fetch(url, { headers: authHeaders() }));

      // Heurística mientras el backend no devuelva X-Total-Count:
      // si llega una página completa asumimos que hay más.
      const hasMore = Array.isArray(data) && data.length === pageSize;
      const total = hasMore
        ? skip + pageSize + 1
        : skip + (Array.isArray(data) ? data.length : 0);

      return { data, total };
    }

    // mode "off" → cargar todo (con un techo razonable)
    params.set("skip", "0");
    params.set("limit", "1000");
    const url = `${collectionUrl(apiUrl, resource)}?${params}`;
    const data = await parseResponse(await fetch(url, { headers: authHeaders() }));
    return { data, total: Array.isArray(data) ? data.length : 0 };
  },

  getOne: async ({ resource, id }) => {
    const data = await parseResponse(
      await fetch(itemUrl(apiUrl, resource, id), { headers: authHeaders() }),
    );
    return { data };
  },

  create: async ({ resource, variables }) => {
    const data = await parseResponse(
      await fetch(collectionUrl(apiUrl, resource), {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      }),
    );
    return { data };
  },

  update: async ({ resource, id, variables }) => {
    const data = await parseResponse(
      await fetch(itemUrl(apiUrl, resource, id), {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(variables),
      }),
    );
    return { data };
  },

  deleteOne: async ({ resource, id }) => {
    await parseResponse(
      await fetch(itemUrl(apiUrl, resource, id), {
        method: "DELETE",
        headers: authHeaders(),
      }),
    );
    return { data: { id } as never };
  },

  custom: async ({ url, method, payload, headers }) => {
    const isAbsolute = /^https?:\/\//.test(url);
    const finalUrl = isAbsolute ? url : `${apiUrl}/${url.replace(/^\//, "")}`;
    const data = await parseResponse(
      await fetch(finalUrl, {
        method: (method ?? "get").toUpperCase(),
        headers: {
          ...authHeaders(),
          ...(payload ? { "Content-Type": "application/json" } : {}),
          ...((headers as Record<string, string> | undefined) ?? {}),
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }),
    );
    return { data };
  },
});
