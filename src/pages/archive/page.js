import React, { useState , useContext } from "react";
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
import SimpleDialog from "@mui/material/Dialog";
import { get_archive, send_archive } from "../../utils/api";
import { useEffect } from "react";
import { SnackbarContext } from "../../utils/context/SnackbarContext";

export default function Archive() {
  const [archive, setArchive] = useState();
  const [oldArchive, setOldArchive] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const handleSave = () => {
    const newArchive = { ...archive };

   if(oldArchive === title){
      newArchive[title] = content
    }else {
      newArchive[title] = content
      if(oldArchive)
      delete newArchive[oldArchive]
    }
    const postArchive = {
      title: title,
      content: content
    };
    
    if(title.trim() === "" || content.trim() === ""){
      alert("inserire i valori prima di salvare")
    }else{
      (async () => {
        try {
          setArchive(newArchive);
          const response = await send_archive({ postArchive });
          if(response === true){
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "success",
              message: `archive configuration request OK`,
            });
          }
          else{
            handleRequestFeedback({
              vertical: "bottom",
              horizontal: "right",
              severity: "error",
              message: `An error occurred on change archive configuration`,
            });
          }
        } catch (err) {
          console.log("Error occured when fetching books");
        }
      })();
    setTitle("");
    setContent("");
    setOpen(false);
    setMod(false)
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
  };

  const archiveKeys = archive ? Object.keys(archive) : [];
  const archiveValues = archive ? Object.values(archive) : [];
  const handleDelete = (item) => {
    const newArchive = { ...archive };
    delete newArchive[item];

    setArchive(newArchive);
  };
  const [mod,setMod] = useState(false);
  const handleModify = (item) => {
    setTitle(item);
    setContent(archive[item]);
    setMod(true);
    setOldArchive(item)
  };
  const closeMod = () => {
    setMod(false)
  }
  const handleAdd = () => {
    handleClear(archive)
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
        setArchive(response);
        (async () => {
          try {
            const response = await get_archive();
            if(response){
              setArchive(response)
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `archive configuration request OK`,
              });
            }
            else{
              handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred on change archive configuration`,
              });
            }
          } catch (err) {
            console.log("Error occured when fetching books");
          }
        })();
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
  }, []);
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
            <h1>Archive</h1>
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
          <SimpleDialog open={mod} onClose={closeMod} sx={{ padding: 10 }}>
            <Card sx={{ padding: 10, margin: 1 }}>
              <h1>Modify Archive object</h1>
              <div>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
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
                  id="outlined-texterea"
                  label="Content"
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
                <Button variant="contained" size="small" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="contained" size="small" onClick={handleClear}>
                  Clear
                </Button>
              </Stack>
            </Card>
          </SimpleDialog>
          <SimpleDialog open={open} onClose={handleClose} sx={{padding: 5}}>
            <Card sx={{ padding: 5 , margin: 1}}>
              <h1>Insert new Archive object</h1>
              <div>
                <TextField
                  fullWidth={true}
                  id="outlined-textarea"
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
                  id="outlined-texterea"
                  label="Content"
                  multiline
                  rows={5}
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
