import React, { useState, useEffect, useContext, Fragment } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import {
  Card,
  Container,
  InputLabel,
} from "@mui/material";
import {change_password} from "../../utils/api"
import KeyIcon from "@mui/icons-material/Key";
import { Divider, OutlinedInput } from "@mui/material";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import { SnackbarContext } from "../../utils/context/SnackbarContext";

export default function ChangePassword() {
  const [username, setUsername] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [newPasswordConfirm, setNewPasswordConfirm] = useState();

  const [showOldPassword, setShowOldPassword] = useState();
  const [showNewPassword, setShowNewPassword] = useState();
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState();

  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleChangePassword = () => {
    if (newPassword !== newPasswordConfirm) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `New password does not match with confirmation`,
      });
    } else {
      if (
        !userIsValid(username) ||
        checkPasswordStrength(newPassword) !== 4 ||
        username?.includes(" ") ||
        newPassword?.includes(" ")
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
            const changePasswordData = {
              user: username,
              password: oldPassword,
              new_password: newPassword,
            };
            const response = await change_password(changePasswordData);
            console.log(response);
            if (response) {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `Password for user ${username} changed successfully`,
              });

              setUsername("");
              setOldPassword("");
              setNewPassword("");
              setNewPasswordConfirm("");
            } else {
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred while trying to change password`,
              });
            }
          } catch (err) {
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "error",
              message: `An error occurred while trying to change password`,
            });
          }
        })();
      }
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
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1, p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <h1>Manage user</h1>
          </Stack>
          <Divider />
          <InputLabel>Enter your username:</InputLabel>
          <OutlinedInput
            type="text"
            value={username || ""}
            onChange={(event) => setUsername(event?.target?.value?.trim())}
            fullWidth
          />
          <Divider />
          <InputLabel>Enter your old password:</InputLabel>
          <OutlinedInput
            type={showOldPassword ? "text" : "password"}
            value={oldPassword || ""}
            onChange={(event) => setOldPassword(event?.target?.value?.trim())}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseDown={() =>
                    setShowOldPassword((prevState) => !prevState)
                  }
                  onMouseUp={() =>
                    setShowOldPassword((prevState) => !prevState)
                  }
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Divider />
          <InputLabel>Enter your new password:</InputLabel>
          <OutlinedInput
            type={showNewPassword ? "text" : "password"}
            value={newPassword || ""}
            onChange={(event) => setNewPassword(event?.target?.value?.trim())}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseDown={() =>
                    setShowNewPassword((prevState) => !prevState)
                  }
                  onMouseUp={() =>
                    setShowNewPassword((prevState) => !prevState)
                  }
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Divider />
          <InputLabel>Confirm new password:</InputLabel>
          <OutlinedInput
            type={showNewPasswordConfirm ? "text" : "password"}
            value={newPasswordConfirm || ""}
            onChange={(event) =>
              setNewPasswordConfirm(event?.target?.value?.trim())
            }
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onMouseDown={() =>
                    setShowNewPasswordConfirm((prevState) => !prevState)
                  }
                  onMouseUp={() =>
                    setShowNewPasswordConfirm((prevState) => !prevState)
                  }
                  edge="end"
                >
                  {showNewPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <Divider />
          <Stack direction="row" justifyContent="flex-end" alignItems="center">
            <Button
              variant="contained"
              endIcon={<KeyIcon />}
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </Stack>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
