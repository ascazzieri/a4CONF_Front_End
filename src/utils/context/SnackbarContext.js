import { useState, createContext } from "react";

export const SnackbarContext = createContext(undefined);

export default function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    severity: "error",
    message: "test",
  });
  return (
    <SnackbarContext.Provider value={[snackbar, setSnackbar]}>
      {children}
    </SnackbarContext.Provider>
  );
}
