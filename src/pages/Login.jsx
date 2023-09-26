import React, { useState, useContext } from "react";
import { Card, Container } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ErrorCacher from "../components/Errors/ErrorCacher";
import appliedLogo from "../media/img/applied_logo_cropped.png";
import { post_login } from "../utils/api";
import { useLocation } from 'react-router-dom';
import { SuperUserContext } from "../utils/context/SuperUser";

export default function Login(props) {

  const { setAuthenticated } = props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const superUser = useContext(SuperUserContext)

  const location = useLocation();
  const elevation = location.state?.elevation || false;

  console.log(location)


  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (username.trim() !== "" && password.trim() !== "") {
      const auth = await post_login({
        username: username,
        password: password,
      });
      if (auth?.result) {
        setAuthenticated(true)
        if (auth?.role === "admin") {
          superUser[1](true)
        } else {
          superUser[1](false)
        }
      } else {
        setAuthenticated(false)
        alert("accesso negato: credenzieli non corrette");
      }

    } else {
      alert("Do not use empty spaces");
    }
  };
  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters></Container>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ padding: 5, margin: 5 }}>
          <Stack direction="row" justifyContent="center" spacing={2} style={{ width: "100%" }}>
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
          </div>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            alignItems="center"
            style={{ width: "100%" }}
          >
            <Button variant="contained" size="medium" onClick={handleLogin}>
              Login
            </Button>
          </Stack>
        </Card>
      </Container>
    </ErrorCacher >
  );
}
