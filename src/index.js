import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./utils/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import MUITheme from "./MUITheme";
import SnackbarProvider from "./utils/context/SnackbarContext";
import LoadingProvider from "./utils/context/Loading";
import SuperUserProvider from "./utils/context/SuperUser";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={MUITheme}>
    <Provider store={store}>
      <SuperUserProvider>
        <LoadingProvider>
          <SnackbarProvider>
            <div className="page-blocker" id="page-blocker" />
            <App />
          </SnackbarProvider>
        </LoadingProvider>
      </SuperUserProvider>
    </Provider>
  </ThemeProvider>
);
