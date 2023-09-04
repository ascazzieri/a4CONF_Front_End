import React, { useState } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { Divider } from "antd";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

export function Archive() {
  const [archive, setArchive] = useState({
    "problema di connessione": "il cliente ha il firewall che deep inspection",
    "problema voltaggio": "accedono frequenti cali di voltaggio",
    "led S2 ": "è stata registrata l'accensione del led S2 per 4 volte",
  });

  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const handleSave = () => {
    const newArchive = {...archive}
    newArchive[title] = content;
    setArchive(newArchive);
  }

  const archiveKeys = Object.keys(archive);
  const archiveValues = Object.values(archive);
  const handleDelete = (item) => {
    const newArchive = { ...archive };
    delete newArchive[item];

    setArchive(newArchive);
  };
  const handleModify = (item) => {
    
  };
  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters></Container>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1 }}>
          <h1>Archive</h1>
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
          <Card sx={{ mt: 1 }}>
            <h1>Insert new Archive object</h1>

            <div>
              <TextField
                id="outlined-textarea"
                label="Title"
                value={title}
                onChange={(event) => {setTitle(event.target.value)}}
                multiline
              />
              <Divider />
              <TextField
                id="outlined-texterea"
                label="Content"
                multiline
                rows={5}
                value={content}
                onChange={(event) => {setContent(event.target.value)}}
              />
            </div>
            <Button variant="contained" size="small" onClick={
              handleSave
            }>
              Save
            </Button>
          </Card>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
