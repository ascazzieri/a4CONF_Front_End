import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastDataFTP } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import Table from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Stack,
  Autocomplete,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
export default function FTP() {
  const http = useSelector(
    (state) => state.services?.fastdata?.industrial?.http
  );

  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = ["Server", "Blob settings", "File suffix", "JSON"];

  const getArrayOfObjects = (data, key1, key2) => {
    let arrayOfObjects = [];
    if (data && data.length !== 0) {
      data.forEach((item, index) => {
        const file = Object.keys(item);
        const folder = item[file];
        arrayOfObjects.push({
          [`${key1}`]: file,
          [`${key2}`]: folder,
        });
      });
    }

    return arrayOfObjects;
  };

  //Server
  const [serverBind, setServerBind] = useState(http?.http_server?.host);
  const [customPortEnable, setCustomPortEnable] = useState(
    http?.http_server?.custom_port
  );
  const [serverPort, setServerPort] = useState(http?.http_server?.port);
  const [serverPath, setServerPath] = useState(http?.http_server?.path);

  //File suffix
  const [addFileSuffixEnable, setAddFileSuffixEnable] = useState(
    http?.add_file_suffix?.enabled
  );
  const [addFileSuffixFormat, setAddFileSuffixFormat] = useState(
    http?.add_file_suffix?.suffix
  );

  //Blob settings
  const [blobTableData, setBlobTableData] = useState(
    getArrayOfObjects(http?.blob_settings, "file_name", "blob_folder")
  );

  //Update React states
  useEffect(() => {
    setServerBind(http?.http_server?.host);
    setCustomPortEnable(http?.http_server?.custom_port);
    setServerPort(http?.http_server?.port);
    setServerPath(http?.http_server?.path);
    setAddFileSuffixEnable(http?.add_file_suffix?.enabled);
    setAddFileSuffixFormat(http?.add_file_suffix?.suffix);
    setBlobTableData(
      getArrayOfObjects(http?.blob_settings, "file_name", "blob_folder")
    );
  }, [http]);

  const handleServerBindChange = (event) => {
    const ip = event?.target?.value;
    if (ip) {
      setServerBind(ip);
    }
  };
  const handleCustomPortEnableChange = (event) => {
    const customPort = event?.target?.checked;
    if (customPort !== undefined) {
      setCustomPortEnable(customPort);
    }
  };
  const handleServerPortChange = (event) => {
    const port = event?.target?.value;
    if (port) {
      setServerPort(port);
    }
  };

  const handleServerPathChange = (event) => {
    const path = event?.target?.value;
    if (path) {
      setServerPath(path);
    }
  };

  const handleAddSuffixEnableChange = (event) => {
    const enable = event?.target?.checked;
    if (enable !== undefined) {
      setAddFileSuffixEnable(enable);
    }
  };

  const handleAddSuffixFormatChange = (event) => {
    const format = event?.target?.value;
    if (format) {
      setAddFileSuffixFormat(format);
    }
  };

  const handleFTPChange = () => {
    const newFTP = {
      ...http,
      http_server: {
        host: serverBind,
        custom_port: customPortEnable,
        port: serverPort,
        path: serverPath,
      },
      add_file_suffix: {
        enabled: addFileSuffixEnable,
        suffix: addFileSuffixFormat,
      },
      blob_settings: [
        {
          default: "test",
        },
        {
          default_1: "default_1",
        },
      ],
    };

    dispatch(updateFastDataFTP({ newFTP }));
  };

  const blobColumnsData = [
    {
      accessorKey: "file_name",
      header: "File Name",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "blob_folder",
      header: "Blob Folder",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="FTP" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && <JSONTree data={http} />}

        <form onSubmit={handleFTPChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Binding IP address of FTP server:</FormLabel>

                <TextField
                  type="text"
                  label="Host bindind"
                  helperText="HTTP server bind addresses"
                  value={serverBind}
                  required={true}
                  onChange={handleServerBindChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel>Custom port:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Port: {customPortEnable ? serverPort : 8080}
                  </Typography>

                  <Switch
                    checked={customPortEnable}
                    onChange={handleCustomPortEnableChange}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {customPortEnable && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>HTTP server port:</FormLabel>

                    <TextField
                      type="number"
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      label="Port number"
                      value={serverPort}
                      onChange={handleServerPortChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}

              <FormControl fullWidth>
                <FormLabel>Add format to file:</FormLabel>

                <TextField
                  type="text"
                  label="File format"
                  helperText="Add format to file"
                  value={serverPath}
                  required={true}
                  onChange={handleServerPathChange}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Add file suffix:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    checked={addFileSuffixEnable}
                    onChange={handleAddSuffixEnableChange}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {customPortEnable && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Add file suffix:</FormLabel>

                    <TextField
                      type="text"
                      label="File suffix"
                      helperText="Add file suffix"
                      value={addFileSuffixFormat}
                      onChange={handleAddSuffixEnableChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormLabel>Blob settings:</FormLabel>

              <Table
                tableData={blobTableData}
                setTableData={setBlobTableData}
                columnsData={blobColumnsData}
              />

              <Divider />
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
