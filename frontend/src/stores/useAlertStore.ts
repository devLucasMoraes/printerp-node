import { AlertColor } from "@mui/material";
import { create } from "zustand";

interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
  showAlert: (message: string, severity?: AlertColor) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  open: false,
  message: "",
  severity: "info",
  showAlert: (message, severity = "info") =>
    set({
      open: true,
      message,
      severity,
    }),
  closeAlert: () =>
    set({
      open: false,
    }),
}));
