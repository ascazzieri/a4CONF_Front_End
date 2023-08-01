import MiniDrawer from "../components/Menu";
import { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { updateAll } from "../utils/redux/reducers";
import { get_confA, get_confB } from "../utils/api"
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Snackbar, Alert } from "@mui/material"
import { SnackbarContext } from "../utils/context/SnackbarContext"
import Checklist from "../components/Checklist_2";
import THREED from "../components/THREED/THREED";
import Loader from "../components/Loader/Loader";
import { LoadingContext } from "../utils/context/Loading";
import MainButtons from "../components/MainButtons/MainButtons";
import applied_logo from "../media/img/applied_logo.png";

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


const Layout = () => {

  const [bReady, setBReady] = useState(false)

  const dispatch = useDispatch()

  const snackBarContext = useContext(SnackbarContext)

  const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const loaderContext = useContext(LoadingContext)


  useEffect(() => {
    (async () => {
      loaderContext[1](true)
      const confA = await get_confA();
      console.log("get conf A")
      if (confA) {
        dispatch(updateAll({ payload: confA, meta: { actionType: "fromA" } }));
      }
      const confB = await get_confB();
      console.log("get conf B")
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
      loaderContext[1](false)
      //setBReady(true)

    })();
  }, []);

  if (!bReady) {

    return (
      <THREED />
    )
  }

  return (
    <Box sx={{ position: "relative" }}>
      <MiniDrawer>
        {/*         <img src={applied_logo} style={applied_background}/> */}
        <div style={applied_background} />
        {loaderContext[0] && <div style={{ position: 'relative' }}><Loader /></div>}

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

        <Outlet />
      </MiniDrawer>
      <MainButtons />
    </Box>
  );
};

export default Layout;
