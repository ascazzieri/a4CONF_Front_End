// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Layout from "./pages/Layout";
import Dashboard from "./pages/dashboard/page";
import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InternalPC from "./pages/internal-pc/page";
import ExternalPC from "./pages/external-pc/page";
import FastData from "./pages/fast-data/page";
import BackChannel from "./pages/back-channel/page";
import InternalNetwork from "./pages/internal-pc/network/page";
import Kepware from "./pages/internal-pc/kepware/page";
import ExternalNetwork from "./pages/external-pc/network/page";
import Sitemanager from "./pages/external-pc/sitemanager/page";
import Thingworx from "./pages/external-pc/thingworx/page";
import OPCUAServer from "./pages/external-pc/opcua-server/page";
import { Checklist } from "@mui/icons-material";

export default function App({ Component, pageProps }) {
  const [authenticate, setAuthenticate] = useState(true);
  const [registered, setRegistered] = useState(true);

  if (!authenticate) {
    return (
      <BrowserRouter>
        <Navigate to="/login" />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/internal-pc" element={<InternalPC />}>
              <Route path="network" element={<InternalNetwork />} />
              <Route
                path="kepware"
                element={<Kepware />}
                loader={async () => {
                  return <h1>Loading...</h1>;
                }}
              />
            </Route>
            <Route path="/external-pc" element={<ExternalPC />}>
              <Route path="network" element={<ExternalNetwork />} />
              <Route path="sitemanager" element={<Sitemanager />} />
              <Route path="thingworx" element={<Thingworx />} />
              <Route path="opcua-server" element={<OPCUAServer />} />
            </Route>
            <Route path="/fast-data" element={<FastData />} />
            <Route path="/back-channel" element={<BackChannel />} />
            <Route path="*" element={<NoPage />} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<h1>Login</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
