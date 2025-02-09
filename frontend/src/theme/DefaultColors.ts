import { createTheme } from "@mui/material";
import { ptBR as MaterialLocale } from "@mui/material/locale";
import { ptBR as DataGridLocale } from "@mui/x-data-grid/locales";
import typography from "./Typography";
import components from "./components";

// Cores comuns entre os temas
const commonColors = {
  primary: {
    main: "#008069",
    light: "#00a884",
    dark: "#005c4b",
  },
  secondary: {
    main: "#53bdeb",
    light: "#85d1f2",
    dark: "#0a7caf",
  },
  success: {
    main: "#008069",
    light: "#00a884",
    dark: "#005c4b",
    contrastText: "#ffffff",
  },
  info: {
    main: "#53bdeb",
    light: "#7accf0",
    dark: "#3fb3e8",
    contrastText: "#ffffff",
  },
  error: {
    main: "#ef697a",
    light: "#ffd9dc",
    dark: "#e15468",
    contrastText: "#ffffff",
  },
  warning: {
    main: "#ffa726",
    light: "#fff4e5",
    dark: "#f57c00",
    contrastText: "#ffffff",
  },
};

// Configurações específicas para o modo light
const lightPalette = {
  mode: "light" as const,
  ...commonColors,
  background: {
    default: "#f0f2f5",
    paper: "#ffffff",
  },
  text: {
    primary: "#2b3942",
    secondary: "#667781",
  },
  grey: {
    100: "#f7f7f7",
    200: "#f0f2f5",
    300: "#e4e7ea",
    400: "#8696a0",
    500: "#667781",
    600: "#2b3942",
  },
  action: {
    disabledBackground: "rgba(0,0,0,0.08)",
    hoverOpacity: 0.04,
    hover: "rgba(0,0,0,0.03)",
    active: "#008f72",
  },
  divider: "rgba(0,0,0,0.08)",
};

// Configurações específicas para o modo dark
const darkPalette = {
  mode: "dark" as const,
  ...commonColors,
  background: {
    default: "#182229",
    paper: "#202c33",
  },
  text: {
    primary: "#e9edef",
    secondary: "#8696a0",
  },
  grey: {
    100: "#2a3942",
    200: "#323f47",
    300: "#aebac1",
    400: "#8696a0",
    500: "#667781",
    600: "#e9edef",
  },
  action: {
    disabledBackground: "rgba(255,255,255,0.08)",
    hoverOpacity: 0.06,
    hover: "rgba(255,255,255,0.06)",
    active: "#1aac91",
  },
  divider: "rgba(255,255,255,0.08)",
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme(
    {
      direction: "ltr",
      palette: mode === "light" ? lightPalette : darkPalette,
      typography,
      components,
      shape: {
        borderRadius: 8,
      },
    },
    DataGridLocale,
    MaterialLocale
  );
