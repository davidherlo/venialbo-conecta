import type { CSSProperties } from "react";
import type { ThemeConfig } from "antd";

export const colors = {
  musgo: "#5a7a3e",
  musgoClaro: "#7a9a5e",
  musgoFondo: "#eef2e6",
  terracota: "#c87856",
  terracotaOscuro: "#a85e3e",
  crema: "#faf6ef",
  cremaOscuro: "#f0e9d8",
  marronTexto: "#3d2f1f",
  marronSuave: "#6b5a44",
  dorado: "#d4a04c",
  borde: "#e8e0d0",
  blanco: "#ffffff",
};

export const fonts = {
  serif: "'Fraunces', 'Georgia', serif",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
};

export type TagTone = "musgo" | "terracota" | "dorado" | "lila" | "rojo" | "azul" | "gris";

export const tagTones: Record<TagTone, { bg: string; color: string }> = {
  musgo: { bg: "#eef2e6", color: "#4a6730" },
  terracota: { bg: "#fbe9df", color: "#a85e3e" },
  dorado: { bg: "#faf0d8", color: "#9b7a2a" },
  lila: { bg: "#efe8f7", color: "#6b4d99" },
  rojo: { bg: "#f9e0e0", color: "#b03030" },
  azul: { bg: "#e0eaf2", color: "#3d6691" },
  gris: { bg: "#f0eadd", color: "#6b5a44" },
};

export const softTagStyle = (tone: TagTone): CSSProperties => {
  const t = tagTones[tone];
  return {
    background: t.bg,
    color: t.color,
    border: "none",
    fontWeight: 500,
    fontSize: 12,
    padding: "2px 10px",
    borderRadius: 6,
  };
};

export const venialboTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.musgo,
    colorInfo: colors.musgo,
    colorSuccess: "#52a23a",
    colorWarning: colors.dorado,
    colorError: "#c0392b",
    colorTextBase: colors.marronTexto,
    colorBgBase: colors.crema,
    colorBgContainer: colors.blanco,
    colorBgLayout: colors.crema,
    colorBorder: colors.borde,
    colorBorderSecondary: colors.cremaOscuro,
    borderRadius: 10,
    borderRadiusLG: 14,
    borderRadiusSM: 6,
    fontFamily: fonts.sans,
    fontSize: 15,
    boxShadow: "0 2px 8px rgba(61, 47, 31, 0.06)",
    boxShadowSecondary: "0 4px 16px rgba(61, 47, 31, 0.08)",
  },
  components: {
    Layout: {
      bodyBg: colors.crema,
      headerBg: colors.blanco,
      headerColor: colors.marronTexto,
      headerHeight: 68,
      headerPadding: "0 24px",
      footerBg: colors.musgoFondo,
      footerPadding: "20px 24px",
    },
    Menu: {
      itemBg: "transparent",
      itemColor: colors.marronTexto,
      itemSelectedColor: colors.musgo,
      itemSelectedBg: colors.musgoFondo,
      itemHoverColor: colors.musgo,
      horizontalItemSelectedColor: colors.musgo,
      horizontalItemHoverColor: colors.musgo,
      horizontalItemBorderRadius: 6,
    },
    Card: {
      borderRadiusLG: 14,
      boxShadowTertiary: "0 1px 4px rgba(61, 47, 31, 0.06)",
    },
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      fontWeight: 500,
    },
    Tag: {
      borderRadiusSM: 6,
    },
    Typography: {
      titleMarginBottom: "0.4em",
      fontWeightStrong: 600,
    },
  },
};
