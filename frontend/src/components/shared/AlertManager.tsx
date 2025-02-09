import { Alert, Snackbar } from "@mui/material";
import { useAlertStore } from "../../stores/useAlertStore";

export const AlertManager = () => {
  const { open, message, severity } = useAlertStore();
  const { closeAlert } = useAlertStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeAlert}
        severity={severity}
        variant="standard"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
