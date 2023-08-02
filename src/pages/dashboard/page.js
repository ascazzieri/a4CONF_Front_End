import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHostName, updateThingNames } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import DeleteIcon from "@mui/icons-material/Delete";
import VerticalTab from "../../components/VerticalTab/VerticalTab";
import {
  Grid,
  Card,
  CardContent,
  Container,
  FormControl,
  TextField,
  Divider,
  FormLabel,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function Dashboard() {
  const hostname = useSelector((state) => state?.system?.hostname);

  const thing_names = useSelector(
    (state) => state?.services?.thingworx?.thing_names
  );

  const dispatch = useDispatch();

  const [hostName, setHostName] = useState(hostname);
  const [thingName, setThingName] = useState();

  const handleHostNameChange = () => {
    const newHostName = {
      customer: hostName?.customer,
      industrial: hostName?.industrial,
    };
    dispatch(updateHostName({ newHostName }));
  };
  const handleAddThingName = () => {
    const thingNameList = [...thing_names];
    if (thingName.trim() === "") {
      return;
    }
    if (!thingName.includes("rt_")) {
      thingNameList.push(`rt_${thingName}`);
    } else {
      thingNameList.push(thingName);
    }

    dispatch(updateThingNames(thingNameList));
  };
  const handleThingNameDelete = (value) => {
    const thingNameList = thing_names.filter((item) => item !== value);
    dispatch(updateThingNames(thingNameList));
  };

  return (
    <Container sx={{ flexGrow: 1, mt: 0, pt: 0 }} disableGutters>
      <Card sx={{ flexGrow: 1, mt: 0, pt: 0 }}>
        <CardContent>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <h3>PCA</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Bidirectionality</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Kepware</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={8}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel>a4GATE serial number:</FormLabel>

                  <TextField
                    type="text"
                    label="a4GATE hostname"
                    helperText="Write a4GATE serial number S/N"
                    value={
                      hostName?.industrial === hostName?.customer
                        ? hostName?.industrial
                        : "a4GATE hostname of PCA and PCB do not match. Please insert S/N as hostname and restart a4GATE"
                    }
                    required={true}
                    onChange={(event) => {
                      setHostName({
                        industrial: event?.target?.value,
                        customer: event?.target?.value,
                      });
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleHostNameChange}>
                  Save
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <h3>PCB</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Ready</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Network</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={8}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel>Machine serial number:</FormLabel>

                  <TextField
                    type="text"
                    label="Machine serial"
                    helperText="Create a new machine serial number and add it to the list below"
                    value={thingName}
                    required={false}
                    onChange={(event) => {
                      setThingName(event?.target?.value);
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleAddThingName}>
                  Add
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} wrap>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <h3>Services</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Sitemanager</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Thingworx</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>OPCUA Server</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Http Server</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Fast Data</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <h3>Terafence</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>a4Monitor</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Back Channel</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Data Transfer</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Config. Service</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Broker</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                padding: "0px 20px",
              }}
            >
              <h3>Machine serial number list</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <TableContainer sx={{ height: 150 }}>
                  <Table stickyHeader aria-label="sticky table" size="small">
                    <TableBody>
                      {thing_names &&
                        thing_names.length !== 0 &&
                        thing_names.map((row) => {
                          return (
                            <TableRow hover key={row}>
                              <TableCell align="center">
                                {row.substring(3, row.length)}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    handleThingNameDelete(row);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
