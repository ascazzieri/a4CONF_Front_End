import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastDataMatrix } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import {
  Button,
  Container,
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
export default function Matrix() {
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

    dispatch(updateFastDataMatrix({ newMatrix }));
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

          {currentTab === 2 && <></>}

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
