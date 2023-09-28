import React, { useState } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import {
  Card,
  Container,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import {Divider} from "@mui/material";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleDialog from "@mui/material/Dialog";
import { post_users } from "../../utils/api";


export default function ManageUsers() {
  const [user, setUser] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  
  const userKeys = user ? Object.keys(user) : [];
  const userValues = user ? Object.values(user) : [];

  const handleSave = () => {
    const newUser = { ...user };
    newUser[username] = password;
    const postUser = {
      "user" : username,
      "password" : password
    }
    if(userIsValid(username) === false || checkPasswordStrength(password) !== 4){
      alert("username o password non conformi.Username deve avere un formato simile: user@example.com . La password devo contenere almeno 8 caratteri,una minuscola,una maiuscola e un carattere speciale")
    }else{   
        (async () => {
          try {
            await post_users({postUser});
            setUser(newUser);
            console.log(postUser)
          } catch (err) {
            console.log('Error occured when fetching books');
          }
        })();
    setUsername("");
    setPassword("");
    setOpen(false);
    }
  };

  const handleClear = () => {
    setUsername("");
    setPassword("");
  };


  const handleDelete = (item) => {
    const newArchive = { ...user };
    delete newArchive[item];
    setUser(newArchive);
  };
  const handleModify = (item) => {
    setUsername(item);
    setPassword(user[item]);
    setOpen(true);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };


  function userIsValid(user) {
    var regex_email_valida = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
        <Card sx={{ mt: 1, p:2 }}>
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
                <Accordion key={Math.random()}>
                  <AccordionSummary
                    key={Math.random()}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography key={Math.random()} sx={{ width: "70%" }}>
                      <Item>{item}</Item>
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      alignItems="center"
                      style={{ width: "100%" }}
                    >
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
                  </AccordionSummary>
                  <AccordionDetails key={Math.random()}>
                    <Typography key={Math.random()}>
                      {userValues[index]}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}

          <SimpleDialog open={open} onClose={handleClose} sx={{padding: 10}}>
            <Card sx={{ padding: 10 , margin: 1}}>
              <h1>Insert new User</h1>
              <div>
                <TextField
                  fullWidth= {true}
                  id="outlined-textarea"
                  label="Username"
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                  multiline
                />
                <Divider />
                <TextField
                  fullWidth={true}
                  id="outlined-texterea"
                  label="Password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
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
