import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastDataFTP } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import Table from "../../../components/Table/Table";
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
  const ftp = useSelector((state) => state.services?.fastdata?.industrial?.ftp);

  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = [
    "Server",
    "Security",
    "Blob settings",
    "File timestamp",
    "JSON",
  ];

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
  const [serverIP, setServerIP] = useState(ftp?.server?.ip_address);
  const [serverType, setServerType] = useState(ftp?.server?.type);
  const [serverPort, setServerPort] = useState(ftp?.server?.port);
  const [maxConnection, setMaxConnection] = useState(ftp?.server?.max_cons);
  const [maxConnectionPerIP, setMaxConnectionPerIP] = useState(
    ftp?.server?.max_cons_per_ip
  );
  const [anonymousEnabled, setAnonymousEnabled] = useState(
    ftp?.server?.anonymus_login?.enabled
  );
  const [anonymousFolder, setAnonymousFolder] = useState(
    ftp?.server?.anonymus_login?.shared_folder
  );

  //Users
  const [usersTableData, setUsersTableData] = useState(ftp?.server?.users);

  //File timestamp
  const [addTimestamp, setAddTimestamp] = useState(
    ftp?.file_timestamp?.add_timestamp_to_filename
  );
  const [addTimestampMilliseconds, setAddTimestampMilliseconds] = useState(
    ftp?.file_timestamp?.add_milliseconds_to_timestamp
  );

  //Blob settings
  const [blobTableData, setBlobTableData] = useState(
    getArrayOfObjects(ftp?.blob_settings, "file_name", "blob_folder")
  );

  //Update React states
  useEffect(() => {
    setServerIP(ftp?.server?.ip_address);
    setServerType(ftp?.server?.type);
    setServerPort(ftp?.server?.port);
    setMaxConnection(ftp?.server?.max_cons);
    setMaxConnectionPerIP(ftp?.server?.max_cons_per_ip);
    setAnonymousEnabled(ftp?.server?.anonymus_login?.enabled);
    setAnonymousFolder(ftp?.server?.anonymus_login?.shared_folder);
    setBlobTableData(
      getArrayOfObjects(ftp?.blob_settings, "file_name", "blob_folder")
    );
  }, [ftp]);

  const handleServerIPChange = (event) => {
    const ip = event?.target?.value;
    if (ip) {
      setServerIP(ip);
    }
  };
  const handleTypeChange = (value) => {
    if (value) {
      setServerType(value);
    }
  };
  const handleServerPortChange = (event) => {
    const port = event?.target?.value;
    if (port) {
      setServerPort(port);
    }
  };

  const handleMaxConsChange = (event) => {
    const cons = event?.target?.value;
    if (cons) {
      setMaxConnection(cons);
    }
  };

  const handleMaxConsPerIPChange = (event) => {
    const cons = event?.target?.value;
    if (cons) {
      setMaxConnectionPerIP(cons);
    }
  };

  const handleAnonymousLogin = (event) => {
    const anonymous = event?.target?.checked;
    if (anonymous !== undefined) {
      setAnonymousEnabled(anonymous);
    }
  };
  const handleAnonymousFolder = (event) => {
    const folder = event?.target?.value;
    if (folder) {
      setAnonymousFolder(folder);
    }
  };

  const handleAddTimestampChange = (event) => {
    const timestamp = event?.target?.checked;
    if (timestamp !== undefined) {
      setAddTimestamp(timestamp);
    }
  };

  const handleAddTimestampMilliseconds = (event) => {
    const timestampMilliseconds = event?.target?.checked;
    if (timestampMilliseconds) {
      setAddTimestampMilliseconds(timestampMilliseconds);
    }
  };

  const handleFTPChange = () => {
    const newFTP = {
      ...ftp,
    };

    dispatch(updateFastDataFTP({ newFTP }));
  };

  const usersColumnData = [
    {
      accessorKey: "username",
      header: "User",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "password",
      header: "Password",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "shared_folder",
      header: "Shared Folder",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];
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
        <h2>FTP</h2>
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && <JSONTree data={ftp} />}

        <form onSubmit={handleFTPChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Binding IP address of FTP server:</FormLabel>

                <TextField
                  type="text"
                  label="IP Address"
                  helperText="FTP server address"
                  value={serverIP}
                  required={true}
                  onChange={handleServerIPChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  options={["standard", "multi-thread", "multi-process"]}
                  sx={{ width: 300 }}
                  label="server type"
                  value={serverType}
                  onChange={(event, newValue) => handleTypeChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Type" />
                  )}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel>FTP server port:</FormLabel>

                <TextField
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Port number"
                  /*  variant="outlined"
                                size="small" */
                  value={serverPort}
                  onChange={handleServerPortChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel>
                  Maximum number of connection to ftp server:
                </FormLabel>

                <TextField
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Max connection"
                  /*  variant="outlined"
                                size="small" */
                  value={maxConnection}
                  onChange={handleMaxConsChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel>
                  Maximum number of connection to ftp server from the same IP
                  address:
                </FormLabel>

                <TextField
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Max connection with the same ip"
                  /*  variant="outlined"
                                size="small" */
                  value={maxConnectionPerIP}
                  onChange={handleMaxConsPerIPChange}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Allow anonymous login:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Anonymous login</Typography>

                  <Switch
                    checked={anonymousEnabled}
                    onChange={handleAnonymousLogin}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {anonymousEnabled ? (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Anonymous folder name:</FormLabel>

                    <TextField
                      type="text"
                      label="folder name"
                      helperText="Folder name for anonymous users"
                      value={anonymousFolder}
                      required={true}
                      onChange={handleAnonymousFolder}
                    />
                  </FormControl>
                  <Divider />
                </>
              ) : (
                <>
                  <FormLabel>Users:</FormLabel>

                  <Table
                    tableData={usersTableData}
                    setTableData={setUsersTableData}
                    columnsData={usersColumnData}
                  />

                  <Divider />
                </>
              )}

              {/* <FormLabel>Routes:</FormLabel>

              <Table
                tableData={routeTableData}
                setTableData={setRouteTableData}
                columnsData={routesColumnData}
              />

              <Divider /> */}
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
              {/*  <FormControl fullWidth>
                <FormLabel>NTP Server:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Use NTP from Gatemanager</Typography>

                  <Switch checked={customNTP} onChange={handleNTPChange} />

                  <Typography>Use Custom NTP Server</Typography>
                </Stack>
              </FormControl>

              <Divider />

              {customNTP === true && (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      label="Custom NTP"
                      helperText="Custom NTP server address"
                      defaultValue={customerNetwork?.ntp}
                      onChange={handleCustomNTPChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )} */}
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Add timestamp to file name:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Add timestamp</Typography>

                  <Switch
                    checked={addTimestamp}
                    onChange={handleAddTimestampChange}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {addTimestamp && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Add also millieconds to timestamp:</FormLabel>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Add milliseconds</Typography>

                      <Switch
                        checked={addTimestampMilliseconds}
                        onChange={handleAddTimestampMilliseconds}
                      />
                    </Stack>
                  </FormControl>

                  <Divider />
                </>
              )}
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
