import React, { useState } from "react";
import { Card, Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { post_register } from "../utils/api";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("password do not match!");
      return;
    }
    if (
      username.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== ""
    ) {
      const result = await post_register({
        username: username,
        password: password,
      });
      if (result) {
        alert("User created correctly");
      } else {
        alert("Error on user creation");
      }
    } else {
      alert("cannot login: there are empty spaces");
    }
  };

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
