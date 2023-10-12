import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import Table from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { fast_http_blob_table_desc, fast_http_file_desc, fast_http_host_desc, fast_http_port_desc, fast_http_suffix_desc } from "../../../utils/titles";
export default function FTP() {
  const http = useSelector(
    (state) => state.services?.fastdata?.industrial?.http
  );

  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Server", "File suffix", "Blob settings", "JSON"]
    : ["Server", "File suffix", "Blob settings"];

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

  const handleHTTPChange = (event) => {
    event.preventDefault()
    const newHTTP = {
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

    dispatch(updateFastData({ industrial: { http: { newHTTP } } }));
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
        <BackButton pageTitle="HTTP" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && superUser && <JSONTree data={http} />}

        <form onSubmit={handleHTTPChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={fast_http_host_desc}>Binding IP address of FTP server:</FormLabel>

                <TextField
                  title={fast_http_host_desc}
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
                <FormLabel title={fast_http_port_desc}>Custom port:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography >
                    Port: {customPortEnable ? serverPort : 8080}
                  </Typography>

                  <Switch
                    title={fast_http_port_desc}
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
                <FormLabel title={fast_http_file_desc}>Add format to file:</FormLabel>

                <TextField
                  title={fast_http_file_desc}
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
                <FormLabel title={fast_http_suffix_desc}>Add file suffix:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    title={fast_http_suffix_desc}
                    checked={addFileSuffixEnable}
                    onChange={handleAddSuffixEnableChange}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {addFileSuffixEnable && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Add file suffix:</FormLabel>

                    <TextField
                      type="text"
                      label="File suffix"
                      helperText="Add file suffix"
                      value={addFileSuffixFormat}
                      onChange={handleAddSuffixFormatChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormLabel title={fast_http_blob_table_desc}>Blob settings:</FormLabel>

              <Table
                tableData={blobTableData}
                setTableData={setBlobTableData}
                columnsData={blobColumnsData}
              />

              <Divider />
            </>
          )}

          {currentTab !== 3 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
