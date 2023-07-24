import MiniDrawer from "../components/Menu";
import { useEffect, useState, useContext, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import { useDispatch } from "react-redux";
import { updateAll } from "../utils/redux/reducers";
import { get_confA, get_confB } from "../utils/api"
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import { Snackbar, Alert } from "@mui/material"
import { SnackbarContext } from "../utils/context/SnackbarContext"
import Checklist from "../components/Checklist_2";
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



function THREEDBox(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}


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
      <Canvas style={{ height: '100vh', width: '100vw' }}>
        {/* <ambientLight />
        <pointLight position={[10, 10, 10]} /> */}
        <THREEDBox position={[-1.2, 0, 0]} />
        <THREEDBox position={[1.2, 0, 0]} />
        <Environment
          background={true} // can be true, false or "only" (which only sets the background) (default: false)
          blur={0} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
          files='/img/test.hdr'

        />
        <CameraControls makeDefault />
      </Canvas>
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
