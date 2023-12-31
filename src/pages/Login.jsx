import React, { useState, useContext, useEffect } from "react";
import { Card, FormControl, Grid, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  OutlinedInput,
  InputAdornment,
  InputLabel,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { send_login, get_confA, get_confB } from "../utils/api";
import { useLocation } from "react-router-dom";
import { SuperUserContext } from "../utils/context/SuperUser";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { updateUserList, updateAll } from "../utils/redux/reducers";
import { SnackbarContext } from "../utils/context/SnackbarContext";
import { LoadingContext } from "../utils/context/Loading";
import { getQueuePending, togglePageSleep, getAuthToken } from "../utils/utils";
import { useDispatch } from "react-redux";

export default function Login(props) {
  const navigate = useNavigate();

  const { authenticated, setAuthenticated } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const superUser = useContext(SuperUserContext);
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const loadingContext = useContext(LoadingContext);
  const location = useLocation();
  const elevation = location.state?.elevation || false;

  useEffect(() => {
    if (authenticated && !elevation) {
      navigate("/");
    }
  }, []);
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getAllConfig = async () => {
    loadingContext[1](true);
    togglePageSleep("block");
    const confA = await get_confA();
    if (confA) {
      dispatch(updateAll({ payload: confA, meta: { actionType: "fromA" } }));
    }
    const confB = await get_confB();
    togglePageSleep("release");
    if (getQueuePending() === 0) {
      loadingContext[1](false);
    }
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
  };
  const handleLogin = async () => {
    try {
      if (username.trim() !== "" && password.trim() !== "") {
        try {
          const res = await send_login({
            user: username,
            password: password,
          });
          if (res) {
            updateUserList(username);
            setAuthenticated(true);
            if (elevation) {
              if (res?.role === "admin") {
                if (res && res.access_token) {
                  localStorage.setItem("jwtToken", res.access_token);
                }
                superUser[1](true);
                //feeback positivo per admin
                handleRequestFeedback({
                  vertical: "bottom",
                  horizontal: "right",
                  severity: "success",
                  message: `Admin elevation activated`,
                });
                await getAllConfig();
                navigate("/");
              } else {
                superUser[1](false);
                //feedback negativo per admin
                handleRequestFeedback({
                  vertical: "bottom",
                  horizontal: "right",
                  severity: "error",
                  message: `wrong credential for admin`,
                });
              }
            } else if (res?.role === "admin") {
              superUser[1](true);
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `login successful as admin`,
              });
              navigate("/");
            } else {
              superUser[1](false);
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `login successful`,
              });
              navigate("/");
            }
          } else {
            setAuthenticated(false);
            //feedback negativo per login con credenziali errate
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "error",
              message: `wrong credential`,
            });
          }
        } catch (err) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred during authentication`,
          });
        }
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `login successful for admin`,
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during authentication`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loadingContext[1](false);
      }
    }
  };
  return (
    <ErrorCacher>
      <Card sx={{ padding: 5 }}>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          style={{ width: "100%" }}
        >
          {elevation ? (
            <h1 style={{ margin: 0 }}>Log as administrator</h1>
          ) : (
            <h1 style={{ margin: 0 }}>Authenticate</h1>
          )}
          <img src={appliedLogo} alt="appliedLogo" width="60" height="60" />
        </Stack>
        <Divider style={{ background: "white" }} />
        <Grid container spacing={2} alignItems="center">
          <Grid item md={8} sx={{ display: "flex" }}>
            <video autoPlay muted loop width="100%" style={{ margin: "4% 0" }}>
              <source src="/img/APL_loop_campagna_low.mp4" type="video/mp4" />
            </video>
          </Grid>
          <Grid
            item
            md={4}
            justify="flex-end"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Box>
              <h2 style={{ textAlign: "center" }}>Login</h2>
              <FormControl fullWidth>
                <TextField
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  style={{ margin: 0, padding: 0 }}
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  value={password || ""}
                  onChange={handlePasswordChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onMouseDown={handleClickShowPassword}
                        onMouseUp={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                style={{ width: "100%" }}
              >
                {elevation ? (
                  <>
                    <Stack direction="row" spacing={4} alignItems="center">
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<ArrowBackIos />}
                        onClick={() => {
                          navigate("/");
                        }}
                      >
                        Back
                      </Button>
                      <Button variant="contained" onClick={handleLogin}>
                        Login
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <FormControl fullWidth>
                    <Button variant="contained" onClick={handleLogin}>
                      Login
                    </Button>
                  </FormControl>
                )}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </ErrorCacher>
  );
}
