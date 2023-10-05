import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, FormControl, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { send_register } from "../utils/api";
import { SnackbarContext } from "../utils/context/SnackbarContext";

export default function Register(props) {
  const { setAuthenticated, firstUser, setFirstUser } = props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  useEffect(() => {
    if (!firstUser) {
      navigate("/");
    }
  });

  const handleRegister = async () => {
    if (
      username.trim() !== "" &&
      userIsValid(username) === true &&
      password.trim() !== "" &&
      checkPasswordStrength(password) === 4 &&
      confirmPassword.trim() !== ""
    ) {
      if (password !== confirmPassword) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `password do not match`
        });
        return;
      } else {
        (async () => {
          try {
            const result = await send_register({
              username: username,
              password: password,
            });
            if (result) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `User ${username} create correctly`,
              });
              setAuthenticated(true)
              setFirstUser(false)
              navigate("/");
            } else {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred on create user creation`,
              });
            }
          } catch (err) {
            console.error(err);
          }
        })();
      }
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Username o password not conformed. Username must have similar format: user@example.com . Paasword must includes at least:  8 caracters, a small letter, a capital letter, a number and a special character`
      });
    }
  };
  function userIsValid(user) {
    var regex_email_valida =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex_email_valida.test(user);
  }
  function checkPasswordStrength(password) {
    var strength = 0;
    if (password.length >= 8) {
      strength += 1;
      console.log("1")
    }
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      strength += 1;
      console.log("2")
    }
    if (password.match(/\d/)) {
      strength += 1;
      console.log("3")
    }
    if (password.match(/[^a-zA-Z\d]/)) {
      strength += 1;
      console.log("4")
    }
    return strength;
  }
  return (
    <ErrorCacher>
      <Card sx={{ padding: 5 }}>
        <Stack direction="row" spacing={2} justifyContent="center" style={{ width: "100%" }}>
          <h1 style={{margin:0}}> Create user details </h1>
          <img src={appliedLogo} alt="appliedLogo" width="60" height="60" />
        </Stack>
        <Divider style={{ background: "white" }} />
        <Grid container spacing={2}>
          <Grid item md={8} sx={{ display: "flex" }}>

            <video autoPlay muted loop width='100%' style={{ margin: '4% 0' }}>
              <source src="/img/APL_loop_campagna_low.mp4" type="video/mp4" />
            </video>

          </Grid>
          <Grid container md={4} justify="flex-end" alignItems="center" sx={{p:2}}>
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
              <FormControl fullWidth>
                <TextField
                  fullWidth={true}
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  style={{ margin: 0, padding: 0 }}
                />
              </FormControl>
              <FormControl fullWidth>
                <Button variant="contained" onClick={handleRegister}>Register</Button>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </ErrorCacher >
  );
}
