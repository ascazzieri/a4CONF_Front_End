import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CustomTable from "../../../components/Table/Table";
import Stack from "@mui/material/Stack";
import Item from "antd/es/list/Item";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import {
  Container,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography
} from "@mui/material";

export default function Matrix() {
  const matrix = useSelector(
    (state) => state.services?.fastdata?.customer?.matrix
  );

  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Server", "Matrix management", "JSON"]
    : ["Server", "Matrix management"];

  //Server
  const [serverIP, setServerIP] = useState(matrix?.http_server?.host);
  const [serverPort, setServerPort] = useState(matrix?.http_server?.port);

  const [matrixDataManagement, setMatrixDataManagement] = useState(
    matrix?.matrix_data_managment
  );

  //Update React states
  useEffect(() => {
    setServerIP(matrix?.http_server?.host);
    setServerPort(matrix?.http_server?.port);
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

  const handleMatrixChange = (e) => {
    e.preventDefault();
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
              {matrixDataManagement &&
            matrixDataManagement.length !== 0 &&
            matrixDataManagement.map((item, index) => {
              return (
                <Accordion key={Math.random()}>
                  <AccordionSummary
                    key={Math.random()}
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <Typography key={Math.random()} sx={{ width: "70%" }}>
                      <Item>{item?.id}</Item>
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
                      
                      >
                        Modify
                      </Button>

                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<DeleteIcon />}
                      
                      >
                        Delete
                      </Button>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails key={Math.random()}>
                    <JSONTree data={matrixDataManagement[index]} />
                  </AccordionDetails>
                </Accordion>
              );
            })}
            </>
          )}

          {currentTab !== 2 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
