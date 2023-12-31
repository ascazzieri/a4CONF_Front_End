import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import {
  updateFastData,
  updateFastDataHTTP,
} from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import Table from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import {
  Autocomplete,
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
import {
  fast_http_blob_table_desc,
  fast_http_file_desc,
  fast_http_host_desc,
  fast_http_port_desc,
  fast_http_suffix_desc,
} from "../../../utils/titles";
import { nonNullItemsCheck } from "../../../utils/utils";
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
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
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
  const handleCustomPortEnableChange = (event) => {
    setCustomPortEnable(event?.target?.checked);
  };
  const handleServerPortChange = (event) => {
    setServerPort(event?.target?.value);
  };

  const handleServerPathChange = (event) => {
    setServerPath(event?.target?.value);
  };

  const handleAddSuffixEnableChange = (event) => {
    setAddFileSuffixEnable(event?.target?.checked);
  };

  const handleAddSuffixFormatChange = (event) => {
    setAddFileSuffixFormat(event?.target?.value);
  };

  const handleHTTPChange = (event) => {
    event.preventDefault();

    let blobSettingsObject = {};
    if (blobTableData?.length !== 0) {
      blobTableData?.forEach((item) => {
        const fileName = item?.file_name?.trim();
        const blobFolder = item?.blob_folder?.trim();

        blobSettingsObject[fileName] = blobFolder;
      });
    }

    // Trasforma l'oggetto temporaneo in un array
    const blobSettingsArray = Object.keys(blobSettingsObject).map(
      (fileName) => ({
        [fileName]: blobSettingsObject[fileName],
      })
    );
    const parsedPort = parseInt(serverPort);
    if (!parsedPort) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Maximum number of connection is not a number`,
      });
      return;
    }

    const newHTTP = {
      ...http,
      http_server: {
        host: serverBind,
        custom_port: customPortEnable,
        port: customPortEnable ? parsedPort : 8080,
        path: serverPath,
      },
      add_file_suffix: {
        enabled: addFileSuffixEnable,
        suffix: addFileSuffixFormat,
      },
      blob_settings: blobSettingsArray,
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `HTTP configuration save correctly`,
    });
    dispatch(updateFastDataHTTP(newHTTP));
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
  const blobValidation = {
    file_name: nonNullItemsCheck,
    blob_folder: nonNullItemsCheck,
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="HTTP" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 3 && superUser && <JSONTree data={http} />}

        <form onSubmit={handleHTTPChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={fast_http_host_desc}>
                  Binding IP address of HTTP server:
                </FormLabel>

                <Autocomplete
                  disablePortal
                  title={fast_http_host_desc}
                  options={["127.0.0.1", "0.0.0.0"]}
                  label="Host binding"
                  value={serverBind || "0.0.0.0"}
                  onChange={(event, newValue) => {
                    setServerBind(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="HTTP server bind addresses" />
                  )}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel title={fast_http_port_desc}>Custom port:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Port: {customPortEnable ? serverPort : 8080}
                  </Typography>

                  <Switch
                    title={fast_http_port_desc}
                    checked={customPortEnable || false}
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
                      value={serverPort || ""}
                      onChange={handleServerPortChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}

              <FormControl fullWidth>
                <FormLabel title={fast_http_file_desc}>HTTP path:</FormLabel>

                <TextField
                  title={fast_http_file_desc}
                  type="text"
                  label="HTTP path"
                  helperText="Write http path in order to receive files from the sender agent"
                  value={serverPath || ""}
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
                <FormLabel title={fast_http_suffix_desc}>
                  Add file suffix:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Switch
                    title={fast_http_suffix_desc}
                    checked={addFileSuffixEnable || false}
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
                      value={addFileSuffixFormat || ""}
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
              <FormLabel title={fast_http_blob_table_desc}>
                Blob settings:
              </FormLabel>

              <Table
                tableData={blobTableData}
                setTableData={setBlobTableData}
                columnsData={blobColumnsData}
                validationObject={blobValidation}
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
