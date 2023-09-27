import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastData } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import Table from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import {
  Container,
  Divider,
  FormControl,
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
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Server", "Security", "Blob settings", "File timestamp", "JSON"]
    : ["Server", "Security", "Blob settings", "File timestamp"];

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
  const [customPortEnable, setCustomPortEnable] = useState(
    ftp?.server?.custom_port
  );
  const [serverPort, setServerPort] = useState(ftp?.server?.port);
  const [maxConnection, setMaxConnection] = useState(ftp?.server?.max_cons);
  const [maxConnectionPerIP, setMaxConnectionPerIP] = useState(
    ftp?.server?.max_cons_per_ip
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
    setCustomPortEnable(ftp?.server?.custom_port);
    setServerPort(ftp?.server?.port);
    setMaxConnection(ftp?.server?.max_cons);
    setMaxConnectionPerIP(ftp?.server?.max_cons_per_ip);
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

  const handleAddTimestampChange = (event) => {
    const timestamp = event?.target?.checked;
    if (timestamp !== undefined) {
      setAddTimestamp(timestamp);
    }
  };

  const handleAddTimestampMilliseconds = (event) => {
    const timestampMilliseconds = event?.target?.checked;
    if (timestampMilliseconds !== undefined) {
      setAddTimestampMilliseconds(timestampMilliseconds);
    }
  };

  const handleFTPChange = () => {
    const newFTP = {
      ...ftp,
      server: {
        ip_address: serverIP,
        type: serverType,
        custom_port: customPortEnable,
        port: serverPort,
        max_cons: maxConnection,
        max_cons_per_ip: maxConnectionPerIP,
        users: usersTableData,
      },
      file_timestamp: {
        add_timestamp_to_filename: addTimestamp,
        add_milliseconds_to_timestamp: addTimestampMilliseconds,
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

    dispatch(updateFastData({ industrial: { ftp: newFTP } }));
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
        <BackButton pageTitle="FTP" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && superUser && <JSONTree data={ftp} />}

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
                <FormLabel>Custom port:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Port: {customPortEnable ? serverPort : 21}
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
                </>
              )}

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
              <FormLabel>Users:</FormLabel>

              <Table
                tableData={usersTableData}
                setTableData={setUsersTableData}
                columnsData={usersColumnData}
              />

              <Divider />
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

          {currentTab !== 4 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
