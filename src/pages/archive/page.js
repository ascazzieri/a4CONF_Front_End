import React, { useState, useContext } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { Card, Container, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { Divider } from "@mui/material";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import CachedIcon from "@mui/icons-material/Cached";
import SimpleDialog from "@mui/material/Dialog";
import {
  get_archive,
  send_archive,
  delete_archive_note,
} from "../../utils/api";
import { useEffect } from "react";
import { SnackbarContext } from "../../utils/context/SnackbarContext";

export default function Archive() {
  const [archive, setArchive] = useState();
  const [title, setTitle] = useState();
  const [oldTitle, setOldTitle] = useState();
  const [content, setContent] = useState();

  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const handleSave = (isAdding) => {
    const newArchive = { ...archive };

    const date = new Date(); // Ottieni la data corrente
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`; // Formatta la data come "gg/mm/aaaa"
    const timestamp = `${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`; // Ottieni il timestamp
    const newTitle = `${title} - ${formattedDate} - ${timestamp}`; // Aggiungi la data e il timestamp a `title` // Aggiungi la data a `title`

    if (oldTitle) {
      newArchive[oldTitle] = content;
    } else {
      newArchive[newTitle] = content;
    }
    setOldTitle(null)

    if (title.trim() === "" || content.trim() === "") {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Insert values before saving`,
      });
    } else {
      (async () => {
        try {
          console.log(newArchive);
          const response = await send_archive(newArchive);
          if (response === true) {
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "success",
              message: `Archive configuration saved successfully`,
            });
          } else {
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "error",
              message: `An error occurred on change archive configuration`,
            });
          }
        } catch (err) {
          console.log("Error occured when fetching archive elements");
        }
      })();
      setArchive(newArchive);
      setTitle("");
      setContent("");
      setOpen(false);
      setMod(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
  };

  const archiveKeys = archive ? Object.keys(archive) : [];
  const archiveValues = archive ? Object.values(archive) : [];
  const handleDelete = async (item) => {
    console.log(item);
    const newArchive = { ...archive };
    const response = await delete_archive_note(item);
    if (response) {
      delete newArchive[item];
      setArchive(newArchive);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Archive item correctly deleted`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on delete item`,
      });
    }
  };
  const [mod, setMod] = useState(false);
  const handleModify = (item) => {
    setTitle(item);
    setContent(archive[item]);
    setMod(true);
    setOldTitle(item);
  };
  const closeMod = () => {
    setMod(false);
  };
  const handleAdd = () => {
    handleClear(archive);
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await get_archive();
        if (response) {
          setArchive(response);
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Archive notes loaded correctly`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred on change archive configuration`,
          });
        }
      } catch (err) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on change archive configuration`,
        });
        console.error(err);
      }
    })();
  }, []);

  const handleReload = async () => {
    (async () => {
      try {
        const response = await get_archive();
        if (response) {
          setArchive(response);
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Archive notes loaded correctly`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred on change archive configuration`,
          });
        }
      } catch (err) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on change archive configuration`,
        });
      }
    })();
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
            <h1>Archive</h1>
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
          {archive &&
            archiveKeys.length !== 0 &&
            archiveKeys.map((item, index) => {
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
                      {archiveValues[index]}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          <SimpleDialog open={mod} onClose={closeMod} sx={{ padding: 5 }}>
            <Card sx={{ padding: 5, paddingTop: 2, margin: 1 }}>
              <h1>Modify Archive object</h1>
              <div>
                <TextField
                  fullWidth={true}
                  label="Title"
                  value={title}
                  disabled
                />
                <Divider />
                <TextField
                  fullWidth={true}
                  label="Content"
                  multiline
                  rows={7}
                  value={content}
                  onChange={(event) => {
                    setContent(event?.target?.value);
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
                <Button variant="contained" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
          <SimpleDialog open={open} onClose={handleClose} sx={{ padding: 5 }}>
            <Card sx={{ padding: 5, paddingTop: 2, margin: 1 }}>
              <h1>Add new Archive object</h1>
              <div>
                <TextField
                  fullWidth={true}
                  label="Title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                  }}
                  multiline
                />
                <Divider />
                <TextField
                  fullWidth={true}
                  label="Content"
                  multiline
                  rows={7}
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value);
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
                <Button variant="contained" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="contained" onClick={() => handleSave(true)}>
                  Save
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
