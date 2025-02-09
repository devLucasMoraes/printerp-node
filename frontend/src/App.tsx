import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ptBR } from "date-fns/locale";
import { useRoutes } from "react-router";
import { AlertManager } from "./components/shared/AlertManager";
import { useThemeMode } from "./hooks/useThemeMode";
import { QueryProvider } from "./lib/react-query/provider";
import Router from "./routes/Router";
import { getTheme } from "./theme/DefaultColors";

function App() {
  const routing = useRoutes(Router);
  const { effectiveMode } = useThemeMode();
  const theme = getTheme(effectiveMode);

  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <CssBaseline />
          <AlertManager />
          {routing}
        </LocalizationProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
