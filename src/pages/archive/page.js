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
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Divider } from "antd";
import Stack from '@mui/material/Stack';
export function Archive() {
  const [archive, setArchive] = useState({
    "problema di connessione": "il cliente ha il firewall che deep inspection",
    "problema voltaggio": "accedono frequenti cali di voltaggio",
    "led S2": "è stata registrata l'accensione del led S2 per 4 volte",
  });
  console.log(archive);
  Object.keys(archive).map((item, index) => {
    console.log(item);
  });
  Object.values(archive).map((item, index) => {
    console.log(item);
  });
  const archiveKeys = Object.keys(archive);
  const archiveValues = Object.values(archive);
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
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography key={Math.random()}>
                      <Stack direction="row" spacing={2}>
                        {item}
                      </Stack>
                    </Typography>
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
              <TextField id="outlined-textarea" label="Title" multiline />
              <Divider />
              <TextField
                id="outlined-texterea"
                label="Content"
                multiline
                rows={5}
                defaultValue=""
              />
            </div>
          </Card>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
