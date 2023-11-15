import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import {
  updateFastData,
  updateFastDataFTP,
} from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import Table from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
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
import {
  ftp_blob_table_desc,
  ftp_connection_ftp,
  ftp_connection_ftp_desc,
  ftp_connection_ip,
  ftp_connection_ip_desc,
  ftp_custom_port_desc,
  ftp_ipaddress_desc,
  ftp_server_type_desc,
  ftp_timestamp_file_desc,
  ftp_timestamp_millisecond_desc,
  ftp_users_desc,
} from "../../../utils/titles";
import { nonNullItemsCheck } from "../../../utils/utils";
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
    if (data && data?.length !== 0) {
      data?.forEach((item, index) => {
        const file =
          Object.keys(item)?.length !== 0 ? Object.keys(item)[0] : "";
        const folder = item[file];
        arrayOfObjects.push({
          [key1]: file,
          [key2]: folder,
        });
      });
    }

    return arrayOfObjects;
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  //Server
  const [serverIP, setServerIP] = useState(ftp?.server?.ip_address || "");
  const [serverType, setServerType] = useState(ftp?.server?.type || "standard");
  const [customPortEnable, setCustomPortEnable] = useState(
    ftp?.server?.custom_port
  );
  const [serverPort, setServerPort] = useState(ftp?.server?.port);
  const [maxConnection, setMaxConnection] = useState(
    ftp?.server?.max_cons || 25
  );
  const [maxConnectionPerIP, setMaxConnectionPerIP] = useState(
    ftp?.server?.max_cons_per_ip || 5
  );

  //Users
  const [usersTableData, setUsersTableData] = useState(
    ftp?.server?.users || []
  );
  //File timestamp
  const [addTimestamp, setAddTimestamp] = useState(
    ftp?.file_timestamp?.add_timestamp_to_filename
  );
  const [addTimestampMilliseconds, setAddTimestampMilliseconds] = useState(
    ftp?.file_timestamp?.add_milliseconds_to_timestamp
  );

  //Blob settings
  const [blobTableData, setBlobTableData] = useState(
    getArrayOfObjects(ftp?.blob_settings, "file_name", "blob_folder") || []
  );

  //Update React states
  useEffect(() => {
    setServerIP(ftp?.server?.ip_address || "");
    setServerType(ftp?.server?.type || "standard");
    setCustomPortEnable(ftp?.server?.custom_port);
    setServerPort(ftp?.server?.port);
    setMaxConnection(ftp?.server?.max_cons);
    setMaxConnectionPerIP(ftp?.server?.max_cons_per_ip);
    setUsersTableData(ftp?.server?.users || []);
    setBlobTableData(
      getArrayOfObjects(ftp?.blob_settings, "file_name", "blob_folder") || []
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

  const handleFTPChange = (event) => {
    event.preventDefault();
    let blobSettingsArray = [];
    if (blobTableData?.length !== 0) {
      blobTableData?.map((item) =>
        blobSettingsArray.push({
          [item?.file_name?.trim()]: item?.blob_folder?.trim(),
        })
      );
    }
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
      blob_settings: blobSettingsArray,
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `FTP configuration save correctly`,
    });
    dispatch(updateFastDataFTP(newFTP));
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
  const usersValidation= {
    username: nonNullItemsCheck,
    password: nonNullItemsCheck,
    shared_folder: nonNullItemsCheck
  }
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
  const blobValidation = {
    file_name: nonNullItemsCheck,
    blob_folder: nonNullItemsCheck
  }

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
                <FormLabel title={ftp_ipaddress_desc}>
                  Binding IP address of FTP server:
                </FormLabel>

                <TextField
                  title={ftp_ipaddress_desc}
                  type="text"
                  label="IP Address"
                  helperText="FTP server address"
                  value={serverIP || ""}
                  required={true}
                  onChange={handleServerIPChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth title={ftp_server_type_desc}>
                <Autocomplete
                  disablePortal
                  options={["standard", "multi-thread", "multi-process"]}
                  sx={{ width: 300 }}
                  label="server type"
                  value={serverType || "standard"}
                  onChange={(event, newValue) => handleTypeChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Type" />
                  )}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel title={ftp_custom_port_desc}>Custom port:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Port: {customPortEnable ? serverPort : 21}
                  </Typography>

                  <Switch
                    title={ftp_custom_port_desc}
                    checked={customPortEnable || false}
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
                      value={serverPort || 21}
                      onChange={handleServerPortChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}

              <FormControl fullWidth>
                <FormLabel title={ftp_connection_ftp_desc}>
                  Maximum number of connection to ftp server:
                </FormLabel>

                <TextField
                  title={ftp_connection_ftp_desc}
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Max connection"
                  /*  variant="outlined"
                                size="small" */
                  value={maxConnection || 5}
                  onChange={handleMaxConsChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel title={ftp_connection_ip_desc}>
                  Maximum number of connection to ftp server from the same IP
                  address:
                </FormLabel>

                <TextField
                  title={ftp_connection_ip_desc}
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Max connection with the same ip"
                  /*  variant="outlined"
                                size="small" */
                  value={maxConnectionPerIP || 5}
                  onChange={handleMaxConsPerIPChange}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormLabel title={ftp_users_desc}>Users:</FormLabel>

              <Table
                tableData={usersTableData || []}
                setTableData={setUsersTableData}
                columnsData={usersColumnData}
                validationObject={usersValidation}
              />

              <Divider />
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormLabel title={ftp_blob_table_desc}>Blob settings:</FormLabel>

              <Table
                tableData={blobTableData || []}
                setTableData={setBlobTableData}
                columnsData={blobColumnsData}
                validationObject={blobValidation}
              />

              <Divider />
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={ftp_timestamp_file_desc}>
                  Add timestamp to file name:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Add timestamp</Typography>

                  <Switch
                    title={ftp_timestamp_file_desc}
                    checked={addTimestamp || false}
                    onChange={handleAddTimestampChange}
                  />
                </Stack>
              </FormControl>

              <Divider />

              {addTimestamp && (
                <>
                  <FormControl fullWidth>
                    <FormLabel title={ftp_timestamp_millisecond_desc}>
                      Add also millieconds to timestamp:
                    </FormLabel>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Add milliseconds</Typography>

                      <Switch
                        title={ftp_timestamp_millisecond_desc}
                        checked={addTimestampMilliseconds || false}
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
