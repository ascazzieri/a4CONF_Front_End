import React, { useState, useContext, useEffect } from "react";
import { Card, FormControl, Grid, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { send_login } from "../utils/api";
import { useLocation } from "react-router-dom";
import { SuperUserContext } from "../utils/context/SuperUser";
import { ArrowBackIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { updateUserList } from "../utils/redux/reducers";
import { SnackbarContext } from "../utils/context/SnackbarContext";

export default function Login(props) {
  const navigate = useNavigate();

  const { authenticated, setAuthenticated } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const superUser = useContext(SuperUserContext);
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const location = useLocation();
  const elevation = location.state?.elevation || false;

  useEffect(() => {
    if (authenticated && !elevation) {
      navigate("/");
    }
  });

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (username.trim() !== "" && password.trim() !== "") {
      (async () => {
        try {
          const auth = await send_login({
            username: username,
            password: password,
          });
          console.log(auth);
          if (auth?.result) {
            updateUserList(username);
            setAuthenticated(true);
            if (auth?.role === "admin") {
              superUser[1](true);
              //feeback positivo per admin
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `login successful for admin`,
              });
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
          console.log("Error occured when fetching books");
        }
      })();
    } else {
      alert("Do not use empty spaces");
    }
  };
  return (
    <ErrorCacher>
      <Card sx={{ padding: 5 }}>
        <Stack direction="row" spacing={2} justifyContent="center" style={{ width: "100%" }}>
          {elevation ? <h1 style={{ margin: 0 }}>Log as administrator </h1> : <h1 style={{ margin: 0 }}>Authenticate</h1>}
          <img src={appliedLogo} alt="appliedLogo" width="60" height="60" />
        </Stack>
        <Divider style={{ background: "white" }} />
        <Grid container spacing={2}>
          <Grid item md={8} sx={{ display: "flex" }}>

            <video autoPlay muted loop width='100%' style={{ margin: '4% 0' }}>
              <source src="/img/APL_loop_campagna_low.mp4" type="video/mp4" />
            </video>

          </Grid>
          <Grid container md={4} justify="flex-end" alignItems="center" sx={{ p: 2 }}>
            <Box>
              <FormControl fullWidth>
                <TextField
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  style={{ margin: 0, padding: 0 }}
                /></FormControl>
              <FormControl fullWidth>
                <TextField
                  fullWidth={true}
                  label="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{ margin: 0, padding: 0 }}
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
                    <Button variant="contained" onClick={handleLogin}>Login</Button>
                  </FormControl>
                )}
              </Stack>

            </Box>



          </Grid>
        </Grid>
      </Card>
      {/* <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ padding: 5, margin: 5 }}>
          <Stack
            direction="row"
            justifyContent="center"
            spacing={2}
            style={{ width: "100%" }}
          >
            {elevation ? <h1>Log as administrator </h1> : <h1>Authenticate</h1>}
            <img src={appliedLogo} alt="appliedLogo" width="60" height="60" />
          </Stack>
          <Divider style={{ background: "white" }} />
          <div>
            <Stack direction="row" spacing={5} style={{ width: "100%" }}>
              <h2>Username:</h2>
              <TextField
                fullWidth={true}
                name="username"
                rows={1}
                value={username}
                onChange={handleUsernameChange}
              />
            </Stack>
            <Divider />
            <Stack direction="row" spacing={5} style={{ width: "100%" }} >
              <h2>Password:</h2>
              <TextField
                fullWidth={true}
                name="password"
                rows={1}
                value={password}
                onChange={handlePasswordChange}
                type="password"
              />
            </Stack>
          </div>
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
              <Button variant="contained" onClick={handleLogin}>
                Login
              </Button>
            )}
          </Stack>
        </Card>
      </Container> */}
    </ErrorCacher>
  );
}
