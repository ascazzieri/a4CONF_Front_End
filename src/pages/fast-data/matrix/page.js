import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import {
  Button,
  Card,
  Container,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import DeleteIcon from "@mui/icons-material/Delete";
import SimpleDialog from "@mui/material/Dialog";
import { get_matrix } from "../../../utils/api";

export default function Matrix() {
  const [archive, setArchive] = useState();

  const [matrixId, setMatrixId] = useState();
  const [content, setContent] = useState();

  const handleSave = () => {
    const newArchive = { ...archive };
    newArchive[matrixId] = content;
    if (matrixId.trim() === "" || content.trim() === "") {
      alert("inserire i valori prima di salvare");
    } else {
      setArchive(newArchive);
      setMatrixId("");
      setContent("");
      setOpen(false);
    }
  };

  const handleClear = () => {
    setMatrixId("");
    setContent("");
  };

  const archiveKeys = archive ? Object.keys(archive) : [];
  const archiveValues = archive ? Object.values(archive) : [];
  const handleDelete = (item) => {
    const newArchive = { ...archive };
    delete newArchive[item];

    setArchive(newArchive);
  };
  const handleModify = (item) => {
    setMatrixId(item);
    setContent(archive[item]);
    setOpen(true);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    (async () => {
      try {
        const response = await get_matrix();
        setArchive(response);
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
  }, []);
  console.log(get_matrix());

  const matrix = useSelector(
    (state) => state.services?.fastdata?.customer?.matrix
  );

  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Server", "Blob settings", "Matrix management", "JSON"]
    : ["Server", "Blob settings", "Matrix management"];

  //Server
  const [serverIP, setServerIP] = useState(matrix?.http_server?.host);
  const [serverPort, setServerPort] = useState(matrix?.http_server?.port);
  const [blobConnectionUrl, setBlobConnectionUrl] = useState(
    matrix?.blob_connection?.azure_url
  );
  const [blobConnectionSas, setBlobConnectionSas] = useState(
    matrix?.blob_connection?.azure_sas
  );

  const [showAppkey, setShowAppkey] = useState(false);
  const handleClickShowPassword = () => setShowAppkey((show) => !show);

  const [matrixDataManagement, setMatrixDataManagement] = useState(
    matrix?.matrix_data_managment
  );

  //Update React states
  useEffect(() => {
    setServerIP(matrix?.http_server?.host);
    setServerPort(matrix?.http_server?.port);
    setBlobConnectionUrl(matrix?.blob_connection?.azure_url);
    setBlobConnectionSas(matrix?.blob_connection?.azure_sas);
    setMatrixDataManagement(matrix?.matrix_data_managment);
  }, [matrix]);

  const handleServerIPChange = (event) => {
    const ip = event?.target?.value;
    if (ip) {
      setServerIP(ip);
    }
  };
  const handleServerPortChange = (event) => {
    const port = event?.target?.value;
    if (port) {
      setServerPort(port);
    }
  };
  const handleBlobConnectionUrlChange = (event) => {
    const blobUrl = event?.target?.value;
    if (blobUrl) {
      setBlobConnectionUrl(blobUrl);
    }
  };

  const handleBlobConnectionSasChange = (event) => {
    const blobSas = event?.target?.value;
    if (blobSas) {
      setBlobConnectionSas(blobSas);
    }
  };

  const handleMatrixChange = () => {
    const newMatrix = {
      ...matrix,
      http_server: {
        host: "127.0.0.1",
        port: 11002,
      },
      blob_connection: {
        azure_url: "https://x0storage.blob.core.windows.net/iot-default",
        azure_sas:
          "?sv=2020-02-10&st=2023-03-24T10%3A06%3A32Z&se=2053-03-25T10%3A06%3A00Z&sr=c&sp=racwdlm&sig=gXK0kFw%2FX11xV9hXC9rCzxoB75eNJo54V7S5Go6BZ3U%3D",
      },
      matrix_data_managment: [
        {
          id: "7Q910A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
        {
          id: "7Q810A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
        {
          id: "7Q610A0",
          grouping_files: 10,
          matrix_delimiter: {
            start: "[",
            mid: ",",
            end: "]",
          },
          source_object_ID_column_name: "Engine_ID",
          source_objects_properties: [
            "RefPosition",
            "TrackingDeviation",
            "RefVelocity",
            "ActualVelocity",
            "RefAcceleration",
            "ActualCurrent",
          ],
          each_source_object_properties: {
            engine_1: [1, 2, 3, 4, 5, 6],
            engine_2: [7, 8, 9, 10, 11, 12],
            engine_3: [13, 14, 15, 16, 17, 18],
            engine_4: [19, 20, 21, 22, 23, 24],
            engine_5: [25, 26, 27, 28, 29, 30],
          },
          timestamp: {
            db_timestamp_column_name: "Timestamp",
            get_timestamp_from_matrix: {
              enabled: false,
              matrix_index_number: 0,
            },
          },
          machine_id_column: {
            enabled: true,
            machine_id_column_name: "machine_id",
          },
          custom_columns: {
            dynamic_columns: {
              enabled: false,
              columns: {
                MasterRefPosition: 26,
                Counter: 0,
              },
            },
          },
        },
      ],
    };

    dispatch(updateFastData({ customer: { matrix: { newMatrix } } }));
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Matrix" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 3 && superUser && <JSONTree data={matrix} />}

        <form onSubmit={handleMatrixChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel>HTTP server settings:</FormLabel>

                <TextField
                  type="text"
                  label="IP Address"
                  helperText="HTTP server address"
                  value={serverIP || ""}
                  required={true}
                  onChange={handleServerIPChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel>HTTP server port:</FormLabel>

                <TextField
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Port number"
                  value={serverPort || ""}
                  onChange={handleServerPortChange}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Blob storage Url:</FormLabel>

                <TextField
                  type="text"
                  label="Blob Url"
                  helperText="Blob storage Url"
                  value={blobConnectionUrl}
                  required={true}
                  onChange={handleBlobConnectionUrlChange}
                />
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">
                  Appkey *
                </InputLabel>
                <OutlinedInput
                  type={showAppkey ? "text" : "password"}
                  required={true}
                  defaultValue={blobConnectionSas}
                  onChange={handleBlobConnectionSasChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onMouseDown={handleClickShowPassword}
                        onMouseUp={handleClickShowPassword}
                        edge="end"
                      >
                        {showAppkey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText id="outlined-weight-helper-text">
                  Unique athentication string for Microsoft Blob Storage
                </FormHelperText>
              </FormControl>

              <Divider />
            </>
          )}

          {currentTab === 2 && (
            <>
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
                      <h1>Matrix management archive</h1>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleAdd}
                      >
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
                              <Typography
                                key={Math.random()}
                                sx={{ width: "70%" }}
                              >
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

                    <SimpleDialog
                      open={open}
                      onClose={handleClose}
                      sx={{ padding: 5 }}
                    >
                      <Card sx={{ padding: 5, margin: 2 }}>
                        <h1>Insert new Matrix object</h1>
                        <div>
                          <TextField
                            fullWidth={true}
                            id="outlined-textarea"
                            label="Matrix Id"
                            value={matrixId}
                            onChange={(event) => {
                              setMatrixId(event.target.value);
                            }}
                            multiline
                          />
                          <Divider />
                          <TextField
                            fullWidth={true}
                            id="outlined-texterea"
                            label="JSON"
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
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleSave}
                          >
                            Save
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleClear}
                          >
                            Clear
                          </Button>
                        </Stack>
                      </Card>
                    </SimpleDialog>
                  </Card>
                </Container>
              </ErrorCacher>
            </>
          )}

          <FormControl fullWidth>
            <Button type="submit" variant="contained">
              Invia
            </Button>
          </FormControl>
        </form>
      </Container>
    </ErrorCacher>
  );
}
