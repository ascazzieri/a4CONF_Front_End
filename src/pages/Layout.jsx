import MiniDrawer from "../components/Menu/Menu";
import ErrorCacher from "../components/Errors/ErrorCacher"
import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { updateAll } from "../utils/redux/reducers";
import { get_confA, get_confB } from "../utils/api";
import { Outlet } from "react-router-dom";
import { Snackbar, Alert, Backdrop, Typography } from "@mui/material"
import { SnackbarContext } from "../utils/context/SnackbarContext"
import Loader from "../components/Loader/Loader";
import { LoadingContext } from "../utils/context/Loading";
import applied_logo from "../media/img/applied_logo.png";
import { useLocation } from "react-router-dom";
import React from "react";
import { togglePageSleep, getQueuePending } from "../utils/utils";

const applied_background = {
  position: "fixed",
  width: "100vw",
  height: "100vh",
  top: "5%",
  zIndex: -1,
  backgroundRepeat: "no-repeat",
  backgroundImage: `url(${applied_logo})`,
  backgroundSize: "150vh",
  backgroundPosition: "right",
};
const verbose = window.location.href.includes("verbose");
/**
 * Handles the layout of the application.
 * 
 * This function is responsible for rendering the layout of the application. It includes the main components such as the MiniDrawer, ErrorCacher, Loader, and Snackbar. It also handles the resizing of the window and displays a message if the viewport is too small for the application.
 * 
 * @returns {JSX.Element} The rendered layout of the application.
 */
const Layout = () => {

  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  const { vertical, horizontal, severity, open, message } = snackBarContext[0];

  const [mobileViewport, setMobileViewport] = useState(false);

  const location = useLocation()
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const loaderContext = useContext(LoadingContext);

  useEffect(() => {
    (async () => {

      const pathName = location?.pathname
      if (!pathName.includes("/login") && !pathName.includes("/register")) {
        loaderContext[1](true);
        togglePageSleep('block')
        const confA = await get_confA();
        verbose && console.log("get conf A");
        if (confA) {
          dispatch(updateAll({ payload: confA, meta: { actionType: "fromA" } }));
        }
        const confB = await get_confB();
        togglePageSleep('release')
        if(getQueuePending() === 0){
          loaderContext[1](false);
        }
       
        verbose && console.log("get conf B");
        if (confB) {
          dispatch(updateAll({ payload: confB, meta: { actionType: "fromB" } }));
        }
        if (confA && confB) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Configuration correctly loaded from both PCs`,
          });
        } else if (!confA && confB) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Error on loading PCA configuration`,
          });
        } else if (confA && !confB) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Error on loading PCB configuration`,
          });
        } else if (!confA && !confB) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Error on loading configuration from both PCs`,
          });
        }

      }
      //setBReady(true)
    })();
  }, []);
/**
 * Handles the resize event of the window.
 * If the inner width of the window is less than or equal to 740, sets the mobileViewport state to true.
 * Otherwise, sets the mobileViewport state to false.
 */
  const handleResize = () => {
    if (window.innerWidth <= 740) {
      setMobileViewport(true);
    } else setMobileViewport(false);
  };

  window.addEventListener("resize", handleResize);

  if (mobileViewport) {
    return (
      <Backdrop
        sx={{
          backgroundColor: "#0D1626",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={true}
      >
        <Typography variant="h5" sx={{ p: 5 }}>
          a4CONF does not support mobile devices with small screens. We
          recommend that you use a device with a larger screen to access the
          application
        </Typography>
      </Backdrop>
    );
  }

  return (
    <ErrorCacher>
      <MiniDrawer>
        <div style={applied_background} />
        {loaderContext[0] && (
          <div style={{ position: "relative" }}>
            <Loader />
          </div>
        )}

        <Snackbar
          open={open}
          autoHideDuration={3000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={() =>
            snackBarContext[1]((prevState) => ({
              ...prevState,
              open: false,
            }))
          }
        >
          <Alert severity={severity}>{message}</Alert>
        </Snackbar>
        {/*  <Checklist /> */}
        {location?.pathname === "/" && <div>
          {(window?.location?.hostname?.includes('localhost') || window?.location?.hostname?.includes('127.0.0.1')) ? <img src="/img/home-image.jpg" width="100%" height="100%" style={{ position: 'absolute', right: -30, top: 80 }} alt=" Home background" /> : (<video width="98%" loop autoPlay muted style={{ position: 'absolute', right: 0, top: 80 }}>
            <source src="/img/a4GATE_mid.mp4" />
          </video>)}


        </div>}
        <Outlet />

      </MiniDrawer>
    </ErrorCacher>
  );
};
export default Layout;
