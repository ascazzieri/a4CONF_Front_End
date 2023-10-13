import React, { useState, useEffect, useContext } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import {
  Card,
  Container,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { Divider, OutlinedInput } from "@mui/material";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleDialog from "@mui/material/Dialog";
import { get_users, post_users } from "../../utils/api";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { SnackbarContext } from "../../utils/context/SnackbarContext";

export default function ManageUsers() {
  const [user, setUser] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldUser, setOldUser] = useState();

  const userKeys = user ? Object.keys(user) : [];
  const userValues = user ? Object.values(user) : [];

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);

  useEffect(() => {
    (async () => {
      try {
        const response = await get_users();
        if (response) {
          setUser(response);
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `users configuration request OK`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred on change users configuration`,
          });
        }
        console.log(response);
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
  }, []);

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleSave = () => {
    const newUser = { ...user };
    if (oldUser === username) {
      newUser[username] = password;
    } else {
      newUser[username] = password;
      if (oldUser) delete newUser[oldUser];
    }

    const postUser = {
      user: username,
      password: password,
    };
    if (password !== confirmPassword) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `pasword do not match`,
      });
    } else {
      if (
        userIsValid(username) === false ||
        checkPasswordStrength(password) !== 4
      ) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Username or password not conformed. Username must have similar format: user@example.com . Paasword must includes at least:  8 caracters, a small letter, a capital letter, a number and a special character`,
        });
        
      } else {
        (async () => {
          try {
            setUser(newUser);
            const response = await post_users({ postUser });
            if (response === true) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `users configuration request OK`,
              });
            } else {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred on change users configuration`,
              });
            }
          } catch (err) {
            console.log("Error occured when fetching books");
          }
        })();
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setOpen(false);
        setMod(false);
      }
    }
  };

  const handleDelete = (item) => {
    const newArchive = { ...user };
    delete newArchive[item];
    setUser(newArchive);
  };
  const [mod, setMod] = useState(false);
  const handleModify = (item) => {
    setUsername(item);
    setPassword(user[item]);
    setConfirmPassword(user[item]);
    setMod(true);
    setOldUser(item);
  };
  const closeMod = () => {
    setMod(false);
  };
  const handleAdd = () => {
    handleClear(user);
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
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

  const [blobConnectionUrl, setBlobConnectionUrl] = useState(
    user?.customer?.matrix?.blob_connection?.azure_sas
  );
  const [blobConnectionSas, setBlobConnectionSas] = useState(
    user?.customer?.matrix?.blob_connection?.azure_sas
  );

  useEffect(() => {
    setBlobConnectionUrl(user?.customer?.matrix?.blob_connection?.azure_url);
    setBlobConnectionSas(user?.customer?.matrix?.blob_connection?.azure_sas);
  }, [user]);
  const [visibleUsers, setVisibleUser] = useState([]);
  const handleClickShowSas = (user, action) => {
    if (action === "add") {
      setVisibleUser((prevArray) => {
        const newArray = [...visibleUsers];
        newArray.push(user);
        console.log(newArray);
        return newArray;
      });
    } else if (action === "delete" && visibleUsers.length !== 0) {
      setVisibleUser((prevArray) => {
        const newArray = prevArray.filter((element) => element !== user);
        console.log(newArray);
        return newArray;
      });
    }
  };

  const handleBlobConnectionSasChange = (event) => {
    const blobSas = event?.target?.value;
    if (blobSas !== undefined) {
      setBlobConnectionSas(blobSas);
    }
  };

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters></Container>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1, p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            style={{ width: "100%" }}
            spacing={2}
          >
            <h1>Manage users</h1>
            <Button variant="contained" size="small" onClick={handleAdd}>
              Add
            </Button>
          </Stack>
          {user &&
            userKeys.length !== 0 &&
            userKeys.map((item, index) => {
              return (
                <MenuItem>
                  <Typography key={Math.random()} sx={{ width: "70%" }}>
                    <Item>{item}</Item>
                    <OutlinedInput
                      type={visibleUsers.includes(item) ? "text" : "password"}
                      required={true}
                      value={userValues[index]}
                      readOnly={true}
                      onChange={handleBlobConnectionSasChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onMouseDown={() => handleClickShowSas(item, "add")}
                            onMouseUp={() => handleClickShowSas(item, "delete")}
                            edge="end"
                          >
                            {visibleUsers.includes(item) ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    alignItems="center"
                    style={{ width: "100%" }}
                  >
                    <Typography key={Math.random()}></Typography>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        handleModify(item);
                      }}
                    >
                      Modify
                    </Button>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        handleDelete(item);
                      }}
                    >
                      Delete
                    </Button>
                  </Stack>
                </MenuItem>
              );
            })}
          <SimpleDialog open={mod} onClose={closeMod} sx={{ padding: 10 }}>
            <Card sx={{ padding: 10, margin: 1 }}>
              <h1>Modify user</h1>
              <div>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  multiline
                />
                
                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel htmlFor="input-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password || ""}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
               
                <FormControl  variant="outlined" fullWidth={true}>
                  <InputLabel htmlFor="input-password-confirm">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPasswordConfirm ? "text" : "password"}
                    value={confirmPassword || ""}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirm}
                          onMouseDown={handleClickShowPasswordConfirm}
                          edge="end"
                        >
                          {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </div>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                style={{ width: "100%" }}
              >
                <Button variant="contained" size="small" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="contained" size="small" onClick={handleClear}>
                  Clear
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
          <SimpleDialog open={open} onClose={handleClose} sx={{ padding: 10 }}>
            <Card sx={{ padding: 10, margin: 1 }}>
              <h1>Insert new User</h1>
              <div>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  multiline
                />
              
                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel htmlFor="input-password">Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password || ""}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
           
                <FormControl  variant="outlined" fullWidth={true}>
                  <InputLabel htmlFor="input-password-confirm">Confirm Password</InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPasswordConfirm ? "text" : "password"}
                    value={confirmPassword || ""}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirm}
                          onMouseDown={handleClickShowPasswordConfirm}
                          edge="end"
                        >
                          {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </div>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems="center"
                style={{ width: "100%" }}
              >
                <Button variant="contained" size="small" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="contained" size="small" onClick={handleClear}>
                  Clear
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
