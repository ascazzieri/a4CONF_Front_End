// App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import HTTPServer from "./pages/external-pc/http-server/page";
import OPCUAServer from "./pages/external-pc/opcua-server/page";
import FTP from "./pages/fast-data/ftp/page";
import HTTP from "./pages/fast-data/http/page";
import Matrix from "./pages/fast-data/matrix/page";
import Archive from "./pages/archive/page";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import { check_credentials } from "./utils/api";

export default function App({ Component, pageProps }) {
  /*  const [authenticate, setAuthenticate] = useState(true);
  const [firstUser, setFirstUser] = useState(); */

  /*  useEffect(() => {
    (async () => {
      const credentials = await check_credentials();
      console.log(credentials)
      console.log("loading account details");
      if (credentials) {
        setFirstUser(false);
      } else {
        setFirstUser(true);
      }
    })();
  }, []);

  if (firstUser) {
    console.log(firstUser)
    return (
      <BrowserRouter>
        <Navigate to="/register" />
        <Routes>
          <Route path="/" element={<PrivateRoute authenticated={authenticated}><Layout />}>
            <Route path="/register" element={<PrivateRoute authenticated={authenticated}><Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  if (!authenticate) {
    return (
      <BrowserRouter>
        <Navigate to="/login" />
        <Routes>
          <Route path="/" element={<PrivateRoute authenticated={authenticated}><Layout />}>
            <Route path="/login" element={<PrivateRoute authenticated={authenticated}><Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  } */

  const [authenticated, setAuthenticated] = useState(true);

  useEffect(() => {
    setAuthenticated(true);
    /* // Controlla se l'utente è autenticato quando il componente si monta
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuthenticated(true);
    } */
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/internal-pc"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <InternalPC />
                </PrivateRoute>
              } // Cambia in base a come passi il componente InternalPC
            >
              <Route
                path="network"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <InternalNetwork />
                  </PrivateRoute>
                }
              />
              <Route
                path="kepware"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Kepware />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/external-pc"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <ExternalPC />
                </PrivateRoute>
              }
            >
              <Route
                path="network"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <ExternalNetwork />
                  </PrivateRoute>
                }
              />
              <Route
                path="sitemanager"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Sitemanager />
                  </PrivateRoute>
                }
              />
              <Route
                path="thingworx"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Thingworx />
                  </PrivateRoute>
                }
              />
              <Route
                path="opcua-server"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <OPCUAServer />
                  </PrivateRoute>
                }
              />
              <Route
                path="http-server"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <HTTPServer />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/fast-data"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <FastData />
                </PrivateRoute>
              }
            >
              <Route
                path="ftp"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <FTP />
                  </PrivateRoute>
                }
              />
              <Route
                path="http"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <HTTP />
                  </PrivateRoute>
                }
              />
              <Route
                path="matrix"
                element={
                  <PrivateRoute authenticated={authenticated}>
                    <Matrix />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/back-channel"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <BackChannel />
                </PrivateRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <Archive />
                </PrivateRoute>
              }
            />
            <Route
              path="/register"
              element={<Register setAuthenticated={setAuthenticated} />}
            />
            <Route
              path="/login"
              element={<Login setAuthenticated={setAuthenticated} />}
            />
            <Route
              path="*"
              element={
                <PrivateRoute authenticated={authenticated}>
                  <NoPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
