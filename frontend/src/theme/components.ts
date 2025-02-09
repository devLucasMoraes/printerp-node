import { Components, Theme } from "@mui/material";

const components: Components<Omit<Theme, "components">> = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        transition: "background-color 0.3s ease, color 0.3s ease",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "8px",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": {
          "& .MuiButton-label": {
            color: theme.palette.primary.dark,
          },
        },
      }),
      contained: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        color: "#ffffff",
        fontWeight: 500,
        "&:hover": {
          backgroundColor: "#006c5a", // Hover mais escuro
        },
        "&:active": {
          backgroundColor: "#004d40", // Estado ativo ainda mais escuro
        },
      }),
      outlined: ({ theme }) => ({
        borderColor: theme.palette.primary.main,
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.03)",
          borderColor: theme.palette.primary.dark,
        },
      }),
      text: ({ theme }) => ({
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.03)",
        },
      }),
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.03)",
          "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
          },
        },
        "&.Mui-selected": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.04)",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.05)",
          },
          "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
          },
        },
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: "36px",
        color: "inherit",
        transition: "color 0.2s ease-in-out",
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        minHeight: "70px",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        backgroundColor: theme.palette.background.paper,
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 2px 8px rgba(0,0,0,0.15)"
            : "0 2px 8px rgba(0,0,0,0.05)",
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundColor: theme.palette.mode === "dark" ? "#2a3942" : "#ffffff",
      }),
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderColor: theme.palette.divider,
      }),
    },
  },
  // Ajuste para tornar os inputs mais suaves
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.2)"
              : "rgba(0,0,0,0.2)",
        },
      }),
    },
  },
};

export default components;
