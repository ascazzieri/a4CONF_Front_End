import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import store from "./utils/redux/store";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import MUITheme from "./MUITheme";
import reportWebVitals from "./reportWebVitals";
import SnackbarProvider from "./utils/context/SnackbarContext";
import LoadingProvider from "./utils/context/Loading";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={MUITheme}>
      <Provider store={store}>
        <LoadingProvider>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </LoadingProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
