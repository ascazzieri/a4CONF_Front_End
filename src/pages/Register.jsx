import React, { useState , useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { send_register } from "../utils/api";
import { SnackbarContext } from "../utils/context/SnackbarContext";

export default function Register() {
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
            console.log(result);
            if (result) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `User ${username} create correctly`,
              });
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
            console.log("Error occured when fetching books");
          }
        })();
      }
    } else {
      
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `username o password not conformed.Username must have similar format: user@example.com . Paasword must includes : 8 caracters, a small letter, acapital letter and a special character`
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
    }
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
      strength += 1;
    }
    if (password.match(/\d/)) {
      strength += 1;
    }
    if (password.match(/[^a-zA-Z\d]/)) {
      strength += 1;
    }
    return strength;
  }
  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters></Container>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ padding: 5, margin: 5 }}>
          <Stack direction="row" spacing={30} style={{ width: "100%" }}>
            <h1> Registration </h1>
            <img src={appliedLogo} alt="appliedLogo" width="60" height="60" />
          </Stack>
          <Divider />
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
            <Stack direction="row" spacing={5} style={{ width: "100%" }}>
              <h2>Password:</h2>
              <TextField
                fullWidth={true}
                name="password"
                rows={1}
                value={password}
                onChange={handlePasswordChange}
              />
            </Stack>
            <Divider />
            <Stack direction="row" spacing={5} style={{ width: "100%" }}>
              <h2>Confirm Password</h2>
              <TextField
                fullWidth={true}
                name="confirmPassword"
                rows={1}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
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
            <Button variant="contained" size="medium" onClick={handleRegister}>
              Register
            </Button>
          </Stack>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
