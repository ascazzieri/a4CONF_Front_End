import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHTTPServer } from "../../../utils/redux/reducers";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { JSONTree } from "react-json-tree";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { LoadingContext } from "../../../utils/context/Loading";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import {
  get_iot_gtws_for_http_server_enabled_read,
  get_iot_gtws_for_http_server_disabled_read,
  get_iot_gtws_for_http_server_enabled_write,
  get_iot_gtws_for_http_server_disabled_write,
  enable_http_client_iot_gateway,
  disable_http_client_iot_gateway,
  enable_http_server_iot_gateway,
  disable_http_server_iot_gateway,
} from "../../../utils/api";
import {
  Autocomplete,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Stack,
  Typography,
  Switch,
  IconButton,
  Grid,
  TableContainer,
  TableBody,
  Table,
  TableRow,
  TableCell,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import {
  http_gateway_read_desc,
  http_gateway_write_desc,
  http_manage_desc,
  http_remote_things_desc,
  http_security_desc,
  http_server_port_desc,
} from "../../../utils/titles";
import { getQueuePending, nonNullItemsCheck } from "../../../utils/utils";

export default function HTTPServer() {
  const http = useSelector((state) => state?.services?.http);
  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  const loaderContext = useContext(LoadingContext);

  const superUser = useContext(SuperUserContext)[0];

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? [
        "Expose Iot Gateway",
        "Manage Iot Gateways",
        "Host",
        "Port",
        "Security",
        "JSON",
      ]
    : ["Expose Iot Gateway", "Manage Iot Gateways", "Host", "Port", "Security"];

  const getArrayOfObjectsHTTP = (data, key1, key2) => {
    let arrayOfObjects = [];
    if (data && data.length !== 0) {
      data.forEach((item, index) => {
        arrayOfObjects.push({
          [`${key1}`]: item,
          mode: key2,
        });
      });
    }
    return arrayOfObjects;
  };

  const [iotGatewaysFromList, setIotGatewaysFromList] = useState([]);
  const [iotGatewaysFromListDisabled, setIotGatewaysFromListDisabled] =
    useState([]);
  const [iotGatewayFrom, setIotGatewayFrom] = useState();

  const [iotGatewaysFromTableData, setIotGatewaysFromTableData] = useState(
    getArrayOfObjectsHTTP(http?.iotgw?.from, "iot_gateway", "read only")
  );

  const [iotGatewaysToList, setIotGatewaysToList] = useState([]);
  const [iotGatewaysToListDisabled, setIotGatewaysToListDisabled] = useState(
    []
  );
  const [iotGatewayTo, setIotGatewayTo] = useState();

  const [iotGatewaysToTableData, setIotGatewaysToTableData] = useState(
    getArrayOfObjectsHTTP(http?.iotgw?.to, "iot_gateway", "read & write")
  );
  const [customPortEnable, setCustomPortEnable] = useState(
    http?.custom_port_enable
  );
  const [customPort, setCustomPort] = useState(http?.port || 8080);

  const [hostBinding, setHostBinding] = useState(http?.host || "127.0.0.1");
  const [showServerPassword, setShowServerPassword] = useState();
  const [enableTLS, setEnableTLS] = useState(http?.enable_tls);
  const [serverAuth, setServerAuth] = useState(
    http?.authentication?.enabled || false
  );
  const [serverUsername, setServerUsername] = useState(
    http?.authentication?.username
  );
  const [serverPassword, setServerPassword] = useState(
    http?.authentication?.password
  );

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  useEffect(() => {
    setIotGatewaysFromTableData(
      getArrayOfObjectsHTTP(http?.iotgw?.from, "iot_gateway", "read only")
    );
    setIotGatewaysToTableData(
      getArrayOfObjectsHTTP(http?.iotgw?.to, "iot_gateway", "read & write")
    );
    setCustomPortEnable(http?.custom_port_enable);
    setCustomPort(http?.port || 8080);
    setHostBinding(http?.host || "127.0.0.1");
    setEnableTLS(http?.enable_tls);
    setServerAuth(http?.authentication?.enabled || false);
    setServerUsername(http?.authentication?.username);
    setServerPassword(http?.authentication?.password);
  }, [http]);

  useEffect(() => {
    (async () => {
      try {
        loaderContext[1](true);
        const iotGatewaysFromEnabled =
          await get_iot_gtws_for_http_server_enabled_read();
        const iotGatewaysFromDisabled =
          await get_iot_gtws_for_http_server_disabled_read();
        const iotGatewaysToEnabled =
          await get_iot_gtws_for_http_server_enabled_write();
        const iotGatewaysToDisabled =
          await get_iot_gtws_for_http_server_disabled_write();
        console.log("get IoT gateways");
        if (
          iotGatewaysFromEnabled?.length !== 0 ||
          iotGatewaysToEnabled?.length !== 0
        ) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Kepware IoT gateways loaded`,
          });
        } else if (
          iotGatewaysFromEnabled?.length === 0 &&
          iotGatewaysToEnabled?.length === 0
        ) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Kepware enabled IoT gateways not found`,
          });
        }
        setIotGatewaysFromList(iotGatewaysFromEnabled);
        setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
        setIotGatewaysToList(iotGatewaysToEnabled);
        setIotGatewaysToListDisabled(iotGatewaysToDisabled);
      } catch (e) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to load kepware IoT gateways`,
        });
      } finally {
        if (getQueuePending() === 0) {
          loaderContext[1](false);
        }
      }
    })();
  }, []);

  const handleCustomPortEnableChange = (event) => {
    setCustomPortEnable(event?.target?.checked);
  };
  const handleCustomPortChange = (event) => {
    setCustomPort(event?.target?.value);
  };
  const handleServerAuthChange = (event) => {
    setServerAuth(event?.target?.checked);
  };
  const handleEnableTLSChange = (event) => {
    setEnableTLS(event?.target?.checked);
  };
  const handleIotGatewaysReloadChange = async (direction) => {
    try {
      loaderContext[1](true);
      let iotGateways = undefined;
      if (direction === "from") {
        iotGateways = await get_iot_gtws_for_http_server_enabled_read();
      } else if (direction === "to") {
        iotGateways = await get_iot_gtws_for_http_server_enabled_write();
      }
      console.log("get IoT gateways");
      if (iotGateways) {
        if (direction === "from") {
          setIotGatewaysFromList(iotGateways);
        } else if (direction === "to") {
          setIotGatewaysToList(iotGateways);
        }
        if (iotGateways?.length !== 0) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Kepware IoT gateways loaded`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Kepware IoT gateways not found`,
          });
        }
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to load Kepware Iot gateways`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleRefreshAllIotGateways = async () => {
    try {
      loaderContext[1](true);
      const iotGatewaysFromEnabled =
        await get_iot_gtws_for_http_server_enabled_read();
      const iotGatewaysFromDisabled =
        await get_iot_gtws_for_http_server_disabled_read();
      const iotGatewaysToEnabled =
        await get_iot_gtws_for_http_server_enabled_write();
      const iotGatewaysToDisabled =
        await get_iot_gtws_for_http_server_disabled_write();
      console.log("get IoT gateways");
      if (
        iotGatewaysFromEnabled?.length !== 0 ||
        iotGatewaysToEnabled?.length !== 0
      ) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Kepware IoT gateways loaded`,
        });
      } else if (
        iotGatewaysFromEnabled?.length === 0 &&
        iotGatewaysToEnabled?.length === 0
      ) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Kepware enabled IoT gateways not found`,
        });
      }
      setIotGatewaysFromList(iotGatewaysFromEnabled);
      setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
      setIotGatewaysToList(iotGatewaysToEnabled);
      setIotGatewaysToListDisabled(iotGatewaysToDisabled);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to load Kepware IoT gateways`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleEnableIotGateway = async (name, permission) => {
    try {
      if (permission === "from") {
        loaderContext[1](true);

        const result = await enable_http_client_iot_gateway(name);

        if (result?.enabled !== true) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred while trying to enable IoT Gateway`,
          });
          return;
        }
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `IoT Gateway: ${name} correctly enabled`,
        });
        let enabledIotGatewaysFromList =
          iotGatewaysFromList?.length !== 0 ? [...iotGatewaysFromList] : [];
        enabledIotGatewaysFromList.push(name);
        setIotGatewaysFromList(Array.from(new Set(enabledIotGatewaysFromList)));
        let disabledIotGatewaysFromList = iotGatewaysFromListDisabled?.filter(
          (item) => item !== name
        );
        setIotGatewaysFromListDisabled(disabledIotGatewaysFromList);
      } else if (permission === "to") {
        loaderContext[1](true);

        const result = await enable_http_server_iot_gateway(name);

        if (result?.enabled !== true) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred while trying to enable IoT Gateway`,
          });
          return;
        }
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `IoT Gateway: ${name} correctly enabled`,
        });
        let enabledIotGatewaysToList =
          iotGatewaysToList?.length !== 0 ? [...iotGatewaysToList] : [];
        enabledIotGatewaysToList.push(name);
        setIotGatewaysToList(Array.from(new Set(enabledIotGatewaysToList)));
        let disabledIotGatewaysToList = iotGatewaysToListDisabled?.filter(
          (item) => item !== name
        );
        setIotGatewaysToListDisabled(disabledIotGatewaysToList);
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to enable IoT Gateway`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };
  /**
   * Disables an IoT gateway based on the provided name and permission.
   *
   * @param {string} name - The name of the IoT gateway to disable.
   * @param {string} permission - The permission type ("from" or "to").
   * @returns {void}
   */

  const handleDisableIotGateway = async (name, permission) => {
    try {
      loaderContext[1](true);
      if (permission === "from") {
        const result = await disable_http_client_iot_gateway(name);

        if (result?.enabled !== false) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred while trying to disable IoT Gateway`,
          });
          return;
        }
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `IoT Gateway: ${name} correctly disabled`,
        });
        let disabledIotGatewaysFromList =
          iotGatewaysFromListDisabled?.length !== 0
            ? [...iotGatewaysFromListDisabled]
            : [];
        disabledIotGatewaysFromList.push(name);
        setIotGatewaysFromListDisabled(
          Array.from(new Set(disabledIotGatewaysFromList))
        );
        let enabledIotGatewaysFromList = iotGatewaysFromList?.filter(
          (item) => item !== name
        );
        setIotGatewaysFromList(enabledIotGatewaysFromList);
      } else if (permission === "to") {
        const result = await disable_http_server_iot_gateway(name);

        if (result?.enabled !== false) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred while trying to disable IoT Gateway`,
          });
          return;
        }
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `IoT Gateway: ${name} correctly disabled`,
        });
        let disabledIotGatewaysFromList =
          iotGatewaysToListDisabled?.length !== 0
            ? [...iotGatewaysToListDisabled]
            : [];
        disabledIotGatewaysFromList.push(name);
        setIotGatewaysToListDisabled(
          Array.from(new Set(disabledIotGatewaysFromList))
        );
        let enabledIotGatewaysToList = iotGatewaysToList?.filter(
          (item) => item !== name
        );
        setIotGatewaysToList(enabledIotGatewaysToList);
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to manage IoT gateway`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };
  /**
   * This code snippet is a part of a larger function/component named `OPCServer`.
   * It is responsible for adding a new IoT gateway to the table data.
   *
   * @function handleAddIotGatewayFrom
   * @description Adds a new IoT gateway to the table data by updating the state variable `iotGatewaysFromTableData`.
   * @returns {void}
   */
  const handleAddIotGatewayFrom = () => {
    setIotGatewaysFromTableData((prevData) => [
      ...prevData,
      {
        iot_gateway: iotGatewayFrom,
        mode: "read only",
      },
    ]);
  };

  const handleAddIotGatewayTo = () => {
    setIotGatewaysToTableData((prevData) => [
      ...prevData,
      {
        iot_gateway: iotGatewayTo,
        mode: "read & write",
      },
    ]);
  };

  const handleHTTPServerChange = (event) => {
    event.preventDefault();
    const iot_gateway_from = iotGatewaysFromTableData?.map(
      (item) => item?.iot_gateway
    );
    const iot_gateway_to = iotGatewaysToTableData?.map(
      (item) => item?.iot_gateway
    );

    const parsedPort = parseInt(customPort);
    if (!parsedPort) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `HTTP server port is not a number`,
      });
      return;
    }

    const newHTTPServer = {
      ...http,
      custom_port_enable: customPortEnable,
      port: customPortEnable ? parsedPort : 8080,
      enable_tls: enableTLS,
      authentication: {
        enabled: serverAuth,
        username: serverUsername,
        password: serverPassword,
      },
      iotgw: {
        from: iot_gateway_from ? iot_gateway_from : [],
        to: iot_gateway_to ? iot_gateway_to : [],
      },
      host: hostBinding,
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `HTTP Server configuration save correctly`,
    });
    dispatch(updateHTTPServer(newHTTPServer));
  };

  /**
   * This code snippet defines the `iotGatewaysColumnData` array, which contains configuration data for columns in a table.
   * Each object in the array represents a column and includes properties such as `accessorKey`, `header`, `enableColumnOrdering`, `enableEditing`, and `enableSorting`.
   * The `accessorKey` property specifies the key used to access the data for the column.
   * The `header` property specifies the header text for the column.
   * The `enableColumnOrdering` property specifies whether column ordering is enabled for the column.
   * The `enableEditing` property specifies whether editing is enabled for the column.
   * The `enableSorting` property specifies whether sorting is enabled for the column.
   */

  const iotGatewaysColumnData = [
    {
      accessorKey: "iot_gateway",
      header: "IoT Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "mode",
      header: "Permission",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
    },
  ];
  const iotGatewaysValidation = {
    iot_gateway: nonNullItemsCheck,
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="HTTP Server" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 5 && superUser && <JSONTree data={http} />}

        <form onSubmit={handleHTTPServerChange}>
          {currentTab === 0 && (
            <>
              <FormLabel title={http_gateway_read_desc}>
                Expose IoT gateways with HTTP Server only in read mode
              </FormLabel>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    options={iotGatewaysFromList}
                    onChange={(event, newValue) => {
                      setIotGatewayFrom(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        title={http_gateway_read_desc}
                        {...params}
                        label="IoT Gateways for HTTP server read only list"
                      />
                    )}
                  />
                </FormControl>
                <IconButton
                  onClick={() => {
                    handleIotGatewaysReloadChange("from");
                  }}
                  aria-label="reload"
                  className="rotate-on-hover"
                >
                  <CachedIcon />
                </IconButton>
                <Button onClick={handleAddIotGatewayFrom} variant="contained">
                  Add
                </Button>
              </Stack>

              <FormLabel title={http_remote_things_desc}>
                IoT Gateway exposed in read only mode
              </FormLabel>

              <CustomTable
                tableData={iotGatewaysFromTableData}
                setTableData={setIotGatewaysFromTableData}
                columnsData={iotGatewaysColumnData}
                validationObject={iotGatewaysValidation}
                staticValue="read only"
              />

              <Divider />

              <FormLabel title={http_gateway_write_desc}>
                Expose IoT gateways with HTTP Server in read and write mode
              </FormLabel>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={iotGatewaysToList}
                    onChange={(event, newValue) => {
                      setIotGatewayTo(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        title={http_gateway_write_desc}
                        {...params}
                        label="IoT Gateways for HTTP server read and write list"
                      />
                    )}
                  />
                </FormControl>
                <IconButton
                  onClick={() => {
                    handleIotGatewaysReloadChange("to");
                  }}
                  aria-label="reload"
                  className="rotate-on-hover"
                >
                  <CachedIcon />
                </IconButton>
                <Button onClick={handleAddIotGatewayTo} variant="contained">
                  Add
                </Button>
              </Stack>

              <FormLabel title={http_remote_things_desc}>
                IoT Gateway exposed in read and write mode
              </FormLabel>

              <CustomTable
                tableData={iotGatewaysToTableData}
                setTableData={setIotGatewaysToTableData}
                columnsData={iotGatewaysColumnData}
                validationObject={iotGatewaysValidation}
                staticValue="read & write"
              />

              <Divider />
            </>
          )}
          {currentTab === 1 && (
            <>
              <FormLabel title={http_manage_desc}>
                Kepware IoT Gateways list for HTTP Server with read only
                permission
              </FormLabel>
              <Divider />
              <Button
                onClick={handleRefreshAllIotGateways}
                variant="outlined"
                endIcon={<CachedIcon />}
              >
                Refresh
              </Button>
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "2px inset white",
                  padding: "5px 20px",
                }}
              >
                <h3>Enable/Disable IoT Gateways for HTTP Server (readonly)</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysFromList &&
                          iotGatewaysFromList?.length !== 0 &&
                          iotGatewaysFromList?.map((iotGatewayName) => {
                            return (
                              <TableRow hover key={iotGatewayName}>
                                <TableCell align="center">
                                  {iotGatewayName}
                                </TableCell>
                                <TableCell align="center">
                                  <Switch
                                    checked={true}
                                    variant="contained"
                                    color="secondary"
                                    onChange={() => {
                                      handleDisableIotGateway(
                                        iotGatewayName,
                                        "from"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {iotGatewaysFromListDisabled &&
                          iotGatewaysFromListDisabled?.length !== 0 &&
                          iotGatewaysFromListDisabled?.map((iotGatewayName) => {
                            return (
                              <TableRow hover key={iotGatewayName}>
                                <TableCell align="center">
                                  {iotGatewayName}
                                </TableCell>
                                <TableCell align="center">
                                  <Switch
                                    checked={false}
                                    variant="contained"
                                    color="secondary"
                                    onChange={() => {
                                      handleEnableIotGateway(
                                        iotGatewayName,
                                        "from"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>

              <Divider />

              <FormLabel title={http_manage_desc}>
                Kepware IoT Gateways list for HTTP Server with read and write
                permission
              </FormLabel>
              <Divider />
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "2px inset white",
                  padding: "5px 20px",
                }}
              >
                <h3>
                  Enable/Disable IoT Gateways for HTTP Server (read & write)
                </h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysToList &&
                          iotGatewaysToList?.length !== 0 &&
                          iotGatewaysToList?.map((iotGatewayName) => {
                            return (
                              <TableRow hover key={iotGatewayName}>
                                <TableCell align="center">
                                  {iotGatewayName}
                                </TableCell>
                                <TableCell align="center">
                                  <Switch
                                    checked={true}
                                    variant="contained"
                                    color="secondary"
                                    onChange={() => {
                                      handleDisableIotGateway(
                                        iotGatewayName,
                                        "to"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {iotGatewaysToListDisabled &&
                          iotGatewaysToListDisabled?.length !== 0 &&
                          iotGatewaysToListDisabled?.map((iotGatewayName) => {
                            return (
                              <TableRow hover key={iotGatewayName}>
                                <TableCell align="center">
                                  {iotGatewayName}
                                </TableCell>
                                <TableCell align="center">
                                  <Switch
                                    checked={false}
                                    variant="contained"
                                    color="secondary"
                                    onChange={() => {
                                      handleEnableIotGateway(
                                        iotGatewayName,
                                        "to"
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </>
          )}
          {currentTab === 2 && (
            <>
              <FormControl fullWidth>
                <Autocomplete
                  disablePortal
                  options={["127.0.0.1", "0.0.0.0"]}
                  value={hostBinding || ""}
                  onChange={(event, newValue) => {
                    setHostBinding(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select HTTP host address binding"
                    />
                  )}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={http_server_port_desc}>
                  HTTP Server Port:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Use Default Port {customPortEnable ? "" : 8080}
                  </Typography>

                  <Switch
                    title={http_server_port_desc}
                    checked={customPortEnable || false}
                    onChange={handleCustomPortEnableChange}
                  />
                  <Typography>
                    Use Custom Port {customPortEnable ? customPort : ""}
                  </Typography>
                </Stack>
              </FormControl>

              <Divider />

              {customPortEnable && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Custom Port:</FormLabel>

                    <TextField
                      type="text"
                      label="Custom Port"
                      helperText="Use this port for HTTP Server tag exposure"
                      value={customPort || 8080}
                      onChange={handleCustomPortChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 4 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Enable/Disable Transport Layer Security:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Disable TLS</Typography>

                  <Switch
                    checked={enableTLS}
                    onChange={handleEnableTLSChange}
                  />

                  <Typography>Enable TLS</Typography>
                </Stack>
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel title={http_security_desc}>
                  Enable/Disable HTTP Server authentication:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Disable</Typography>

                  <Switch
                    title={http_security_desc}
                    checked={serverAuth}
                    onChange={handleServerAuthChange}
                  />

                  <Typography>Enable</Typography>
                </Stack>
              </FormControl>

              <Divider />

              {serverAuth && (
                <>
                  <FormLabel>Authentication:</FormLabel>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      label="HTTP Server Username"
                      value={serverUsername || ""}
                      required={true}
                      onChange={(event) => {
                        setServerUsername(event?.target?.value);
                      }}
                    />
                  </FormControl>

                  <Divider />

                  <FormControl fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password-http-server">
                      HTTP Server Password*
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-http-server"
                      type={showServerPassword ? "text" : "password"}
                      required={true}
                      value={serverPassword || ""}
                      onChange={(event) => {
                        setServerPassword(event?.target?.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onMouseDown={() =>
                              setShowServerPassword((prevValue) => !prevValue)
                            }
                            onMouseUp={() =>
                              setShowServerPassword((prevValue) => !prevValue)
                            }
                            edge="end"
                          >
                            {showServerPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab !== 1 && currentTab !== 5 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
