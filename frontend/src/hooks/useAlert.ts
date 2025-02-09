import { useState } from "react";

export type AlertSeverity = "success" | "error" | "warning" | "info";
interface AlertSnackbarState {
  open: boolean;
  message: string;
  severity: AlertSeverity;
}

export function useAlertSnackbar(defaultSeverity: AlertSeverity = "info") {
  const [snackbar, setSnackbar] = useState<AlertSnackbarState>({
    open: false,
    message: "",
    severity: defaultSeverity,
  });

  const showAlert = (message: string, severity?: AlertSeverity) => {
    setSnackbar({
      open: true,
      message,

      severity: severity ?? snackbar.severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return {
    snackbar,

    showAlert,
    closeSnackbar,
  };
}
