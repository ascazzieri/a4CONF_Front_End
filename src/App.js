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
import ManageUsers from "./pages/users/page";
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
import Advanced from "./pages/advanced/page";
import { check_credentials } from "./utils/api";
import { getAuthToken } from "./utils/utils";

const host = window?.location?.hostname;
const is_local = host?.includes("localhost") || host?.includes("127.0.0.1");

export default function App({ Component, pageProps }) {
  const [authenticated, setAuthenticated] = useState(
    is_local || getAuthToken() !== null
  );
  const [firstUser, setFirstUser] = useState();

  useEffect(() => {
    (async () => {
      const credentials = await check_credentials();
      if (credentials === false) {
        setFirstUser(true);
      } else if (credentials === true) {
        setFirstUser(false);
      }
    })();
  }, []);

  if (firstUser) {
    return (
      <BrowserRouter>
        <Navigate to="/register" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/register"
              element={
                <Register
                  authenticated={authenticated}
                  setAuthenticated={setAuthenticated}
                  firstUser={setFirstUser}
                  setFirstUser={setFirstUser}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

  if (!authenticated) {
    return (
      <BrowserRouter>
        <Navigate to="/login" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route
              path="/login"
              element={
                <Login
                  authenticated={authenticated}
                  setAuthenticated={setAuthenticated}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }

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
              path="/data-collector"
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
              path="/data-sender"
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
                  <PrivateRoute authenticated={authenticated} superUserRequired={true}>
                    <Matrix />
                  </PrivateRoute>
                }
              />
            </Route>
            <Route
              path="/back-channel"
              element={
                <PrivateRoute
                  authenticated={authenticated}
                  superUserRequired={true}
                >
                  <BackChannel />
                </PrivateRoute>
              }
            />
            <Route
              path="/archive"
              element={
                <PrivateRoute
                  authenticated={authenticated}
                  superUserRequired={true}
                >
                  <Archive />
                </PrivateRoute>
              }
            />
            <Route
              path="/manage-users"
              element={
                <PrivateRoute
                  authenticated={authenticated}
                  superUserRequired={true}
                >
                  <ManageUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/advanced"
              element={
                <PrivateRoute
                  authenticated={authenticated}
                  superUserRequired={true}
                >
                  <Advanced />
                </PrivateRoute>
              }
            />
            {/*             <Route
              path="/register"
              element={<Register setAuthenticated={setAuthenticated} />}
            /> */}
            <Route
              path="/login"
              element={
                <Login
                  authenticated={authenticated}
                  setAuthenticated={setAuthenticated}
                />
              }
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
