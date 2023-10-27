import React, { useState, useEffect, useContext, Fragment } from "react";
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
import CachedIcon from "@mui/icons-material/Cached";
import { get_users, add_user, delete_user } from "../../utils/api";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { Cached } from "@mui/icons-material";

export default function ManageUsers() {
  const [userList, setUserList] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState("");

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
          setUserList(response?.length !== 0 ? [...new Set(response)] : []);
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `User configuration request successfull`,
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
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on change users configuration`,
        });
      }
    })();
  }, []);

  const handleReload = async () => {
    try {
      const response = await get_users();
      if (response) {
        setUserList(response?.length !== 0 ? [...new Set(response)] : []);
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `User configuration request successfull`,
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
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on change users configuration`,
      });
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleCreate = () => {
    if (password !== confirmPassword) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `pasword do not match`,
      });
    } else {
      if (
        !userIsValid(username) ||
        checkPasswordStrength(password) !== 4 ||
        username?.includes(" ") ||
        password?.includes(" ")
      ) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Username or password not conformed. Username must have similar format: user@example.com . Paasword must includes at least:  8 caracters, a small letter, a capital letter, a number and a special character. Do not use spaces.`,
        });
      } else {
        (async () => {
          try {
            const oldUserList = userList?.length !== 0 ? [...userList] : [];
            if (oldUserList?.includes(username)) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `User ${username} has already been created`,
              });
              return;
            }
            const newUserData = {
              user: username,
              password: password,
            };
            const response = await add_user(newUserData);
            console.log(response)
            if (response) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `User created successfully`,
              });

              oldUserList?.push(username);
              setUserList(oldUserList);
            } else {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred while trying to add new user`,
              });
            }
          } catch (err) {
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "error",
              message: `An error occurred while trying to add new user`,
            });
          }
        })();
        handleClear();
        setOpen(false);
      }
    }
  };

  const handleDelete = async (user) => {
    try {
      const response = await delete_user(user);
      if (response) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `User deleted successfully`,
        });
        const newUserList = userList?.filter((item) => item !== user);
        setUserList(newUserList);
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to delete user`,
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to delete user`,
      });
    }
  };
  const handleAdd = () => {
    handleClear();
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

  const getUserNamefromEmail = (email) => {
    const userName = email.match(/^([^@]*)@/);
    return userName ? userName[1] : null;
  };

  const [visibleUsers, setVisibleUser] = useState([]);
  const handleClickShowUser = (user, action) => {
    if (action === "add") {
      setVisibleUser((prevArray) => {
        const newArray = [...visibleUsers];
        newArray.push(user);
        return newArray;
      });
    } else if (action === "delete" && visibleUsers.length !== 0) {
      setVisibleUser((prevArray) => {
        const newArray = prevArray.filter((element) => element !== user);
        return newArray;
      });
    }
  };

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1, p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            style={{ width: "100%" }}
            spacing={2}
          >
            <h1>Manage users</h1>

            <IconButton
              onClick={handleReload}
              aria-label="reload"
              className="rotate-on-hover"
            >
              <CachedIcon />
            </IconButton>
            <Button variant="contained" size="small" onClick={handleAdd}>
              Add
            </Button>
          </Stack>
          <Divider />
          {userList &&
            userList?.length !== 0 &&
            userList?.map((item, index) => {
              return (
                <Fragment key={Math.random()}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <MenuItem key={Math.random()} sx={{ minWidth: 500 }}>
                      <div key={Math.random()} style={{ width: "90%" }}>
                        <Typography key={Math.random()}>
                          • {getUserNamefromEmail(item) || `User ${index}`}
                        </Typography>
                        <OutlinedInput
                          type={
                            visibleUsers.includes(item) ? "text" : "password"
                          }
                          value={item}
                          readOnly={true}
                          key={Math.random()}
                          fullWidth
                          endAdornment={
                            <InputAdornment position="end" key={Math.random()}>
                              <IconButton
                                aria-label="toggle password visibility"
                                onMouseDown={() =>
                                  handleClickShowUser(item, "add")
                                }
                                onMouseUp={() =>
                                  handleClickShowUser(item, "delete")
                                }
                                key={Math.random()}
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
                      </div>
                    </MenuItem>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        handleDelete(item);
                      }}
                      key={Math.random()}
                    >
                      Delete
                    </Button>
                  </Stack>
                  <Divider key={Math.random()} />
                </Fragment>
              );
            })}
          <SimpleDialog open={open} onClose={handleClose}>
            <Card sx={{ p: 5, pt: 1, m: 1, overflow: "auto" }}>
              <h1 style={{ textAlign: "center" }}>Create new User</h1>
              <div>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
                  label="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event?.target?.value);
                  }}
                  sx={{ margin: 0 }}
                />

                <FormControl fullWidth={true} variant="outlined">
                  <InputLabel htmlFor="input-password">Password</InputLabel>
                  <OutlinedInput
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password || ""}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onMouseUp={handleClickShowPassword}
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

                <FormControl variant="outlined" fullWidth={true}>
                  <InputLabel htmlFor="input-password-confirm">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="input-password-confirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    value={confirmPassword || ""}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onMouseUp={handleClickShowPasswordConfirm}
                          onMouseDown={handleClickShowPasswordConfirm}
                          edge="end"
                        >
                          {showPasswordConfirm ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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
                style={{ width: "100%", marginTop: 1 }}
              >
                <Button variant="outlined" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="contained" onClick={handleCreate}>
                  Create
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
