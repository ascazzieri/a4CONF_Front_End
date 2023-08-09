import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOPCServer } from "../../../utils/redux/reducers";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import CustomTable from "../../../components/Table/Table";
import { LoadingContext } from "../../../utils/context/Loading";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import {
  get_iot_gtws_opcua_reading_enabled,
  get_iot_gtws_opcua_reading_disabled,
  get_iot_gtws_opcua_reading_writing_enabled,
  get_iot_gtws_opcua_reading_writing_disabled,
  enable_http_client_iot_gateway,
  disable_http_client_iot_gateway,
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
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import BlurOffIcon from "@mui/icons-material/BlurOff";
import BlurOnIcon from "@mui/icons-material/BlurOn";

export default function OPCServer() {
  const opcua = useSelector((state) => state?.services?.opcua);
  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  const loaderContext = useContext(LoadingContext);

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = [
    "Expose Iot Gateway",
    "Manage Iot Gateways",
    "Shift nodes",
    "Port",
    "Security",
    "JSON",
  ];

  const getArrayOfObjects = (data, key1, key2) => {
    let arrayOfObjects = [];
    const keys = Object.keys(data);
    if (data) {
      keys.map((item, index) => {
        arrayOfObjects.push({
          [`${key1}`]: item,
          [`${key2}`]: data[item].toString(),
        });
      });
    }
    return arrayOfObjects;
  };
  const getArrayOfObjectsOPCUA = (data, key1, key2) => {
    let arrayOfObjects = [];
    if (data) {
      data.map((item, index) => {
        arrayOfObjects.push({
          [`${key1}`]: item,
          mode: key2,
        });
      });
    }
    return arrayOfObjects;
  };

  const [iotGatewaysFromList, setIotGatewaysFromList] = useState({});
  const [iotGatewaysFromListDisabled, setIotGatewaysFromListDisabled] =
    useState({});
  const [iotGatewayFrom, setIotGatewayFrom] = useState();

  const [iotGatewaysFromTableData, setIotGatewaysFromTableData] = useState(
    getArrayOfObjectsOPCUA(opcua?.iotgw?.from, "iot_gateway", "read only")
  );

  const [iotGatewaysToList, setIotGatewaysToList] = useState({});
  const [iotGatewaysToListDisabled, setIotGatewaysToListDisabled] = useState(
    {}
  );
  const [iotGatewayTo, setIotGatewayTo] = useState();

  const [iotGatewaysToTableData, setIotGatewaysToTableData] = useState(
    getArrayOfObjectsOPCUA(opcua?.iotgw?.to, "iot_gateway", "read & write")
  );

  const [shiftFromKepware, setShiftFromKepware] = useState(
    opcua?.shift_property_from_kepware
  );
  const [shiftToKepware, setShiftToKepware] = useState(
    opcua?.shift_property_to_kepware
  );
  const [customPortEnable, setCustomPortEnable] = useState(
    opcua?.opcua?.custom_port_enable
  );
  const [customPort, setCustomPort] = useState(opcua?.opcua?.custom_port);

  const [serverAuth, setServerAuth] = useState(opcua?.security?.user_auth);

  const [usersTableData, setUsersTableData] = useState(
    getArrayOfObjects(opcua?.security?.users, "username", "password")
  );

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  useEffect(() => {
    (async () => {
      loaderContext[1](true);
      const iotGatewaysFromEnabled = await get_iot_gtws_opcua_reading_enabled();
      const iotGatewaysFromDisabled =
        await get_iot_gtws_opcua_reading_disabled();
      const iotGatewaysToEnabled =
        await get_iot_gtws_opcua_reading_writing_enabled();
      const iotGatewaysToDisabled =
        await get_iot_gtws_opcua_reading_writing_disabled();
      console.log("get IoT gateways");
      if (
        iotGatewaysFromEnabled &&
        iotGatewaysToEnabled &&
        iotGatewaysFromDisabled &&
        iotGatewaysToDisabled &&
        Object.keys(iotGatewaysFromEnabled).length !== 0 &&
        Object.keys(iotGatewaysToEnabled).length !== 0
      ) {
        setIotGatewaysFromList(iotGatewaysFromEnabled);
        setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
        setIotGatewaysToList(iotGatewaysToEnabled);
        setIotGatewaysToListDisabled(iotGatewaysToDisabled);
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Kepware IoT gateways loaded`,
        });
      } else if (
        iotGatewaysFromEnabled &&
        iotGatewaysFromDisabled &&
        iotGatewaysToEnabled &&
        iotGatewaysToDisabled &&
        Object.keys(iotGatewaysFromEnabled).length === 0 &&
        Object.keys(iotGatewaysToEnabled).length === 0
      ) {
        setIotGatewaysFromList(iotGatewaysFromEnabled);
        setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
        setIotGatewaysToList(iotGatewaysToEnabled);
        setIotGatewaysToListDisabled(iotGatewaysToDisabled);
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Kepware enabled IoT gateways not found`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred during Kepware IoT Gateways loading`,
        });
      }
      loaderContext[1](false);
    })();
  }, []);

  const handleShiftFromKepwareChange = (event) => {
    setShiftFromKepware(event?.target?.value);
  };
  const handleShiftToKepwareChange = (event) => {
    setShiftToKepware(event?.target?.value);
  };
  const handleCustomPortEnableChange = (event) => {
    setCustomPortEnable(event?.target?.checked);
  };
  const handleCustomPortChange = (event) => {
    setCustomPort(event?.target?.value);
  };
  const handleServerAuthChange = (event) => {
    setServerAuth(event?.target?.checked);
  };
  const handleIotGatewaysReloadChange = async (direction) => {
    loaderContext[1](true);
    let iotGateways = undefined;
    if (direction === "from") {
      iotGateways = await get_iot_gtws_opcua_reading_enabled();
    } else if (direction === "to") {
      iotGateways = await get_iot_gtws_opcua_reading_writing_enabled();
    }
    console.log("get IoT gateways");
    if (iotGateways && Object.keys(iotGateways).length !== 0) {
      if (direction === "from") {
        setIotGatewaysFromList(iotGateways);
      } else if (direction === "to") {
        setIotGatewaysToList(iotGateways);
      }
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware IoT gateways loaded`,
      });
    } else if (iotGateways && !Object.keys(iotGateways).length === 0) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Kepware IoT gateways not found`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware IoT Gateways loading`,
      });
    }
    loaderContext[1](false);
  };

  const handleRefreshAllIotGateways = async () => {
    loaderContext[1](true);
    const iotGatewaysFromEnabled = await get_iot_gtws_opcua_reading_enabled();
    const iotGatewaysFromDisabled = await get_iot_gtws_opcua_reading_disabled();
    const iotGatewaysToEnabled =
      await get_iot_gtws_opcua_reading_writing_enabled();
    const iotGatewaysToDisabled =
      await get_iot_gtws_opcua_reading_writing_disabled();
    console.log("get IoT gateways");
    if (
      iotGatewaysFromEnabled &&
      iotGatewaysToEnabled &&
      iotGatewaysFromDisabled &&
      iotGatewaysToDisabled &&
      Object.keys(iotGatewaysFromEnabled).length !== 0 &&
      Object.keys(iotGatewaysToEnabled).length !== 0
    ) {
      setIotGatewaysFromList(iotGatewaysFromEnabled);
      setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
      setIotGatewaysToList(iotGatewaysToEnabled);
      setIotGatewaysToListDisabled(iotGatewaysToDisabled);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware IoT gateways loaded`,
      });
    } else if (
      iotGatewaysFromEnabled &&
      iotGatewaysFromDisabled &&
      iotGatewaysToEnabled &&
      iotGatewaysToDisabled &&
      Object.keys(iotGatewaysFromEnabled).length === 0 &&
      Object.keys(iotGatewaysToEnabled).length === 0
    ) {
      setIotGatewaysFromList(iotGatewaysFromEnabled);
      setIotGatewaysFromListDisabled(iotGatewaysFromDisabled);
      setIotGatewaysToList(iotGatewaysToEnabled);
      setIotGatewaysToListDisabled(iotGatewaysToDisabled);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Kepware enabled IoT gateways not found`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware IoT Gateways loading`,
      });
    }
    loaderContext[1](false);
  };

  const handleEnableIotGateway = async (name, permission) => {
    let iotGatewaDisabledList = undefined;
    const result = await enable_http_client_iot_gateway(name);

    if (!result?.enabled) {
      return;
    }
    if (permission === "from") {
      iotGatewaDisabledList = { ...iotGatewaysFromListDisabled };
      setIotGatewaysFromList((prevData) => ({
        ...prevData,
        [`${name}`]: iotGatewaDisabledList[`${name}`],
      }));
      delete iotGatewaDisabledList[`${name}`];
      setIotGatewaysFromListDisabled(iotGatewaDisabledList);
    } else if (permission === "to") {
      iotGatewaDisabledList = { ...iotGatewaysToListDisabled };
      setIotGatewaysToList((prevData) => ({
        ...prevData,
        [`${name}`]: iotGatewaDisabledList[`${name}`],
      }));
      delete iotGatewaDisabledList[`${name}`];
      setIotGatewaysToListDisabled(iotGatewaDisabledList);
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
    let iotGatewaList = undefined;
    const result = await disable_http_client_iot_gateway(name);

    if (result?.enabled) {
      return;
    }
    if (permission === "from") {
      iotGatewaList = { ...iotGatewaysFromList };
      setIotGatewaysFromListDisabled((prevData) => ({
        ...prevData,
        [`${name}`]: iotGatewaList[`${name}`],
      }));
      delete iotGatewaList[`${name}`];
      setIotGatewaysFromList(iotGatewaList);
    } else if (permission === "to") {
      iotGatewaList = { ...iotGatewaysFromList };
      setIotGatewaysToListDisabled((prevData) => ({
        ...prevData,
        [`${name}`]: iotGatewaList[`${name}`],
      }));
      delete iotGatewaList[`${name}`];
      setIotGatewaysToList(iotGatewaList);
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

  const handleOPCUAServerChange = () => {
    let usersData = {};
    if (usersTableData.length !== 0) {
      usersTableData.map(
        (item, index) => (usersData[`${item?.ssid}`] = item?.password)
      );
    }

    const newOPCUAServer = {
      enabled: false,
      shift_property_from_kepware: shiftFromKepware?.toString(),
      shift_property_to_kepware: shiftToKepware?.toString(),
      opcua: {
        custom_port_enable: customPortEnable,
        custom_port: customPort?.toString(),
      },
      security: {
        user_auth: serverAuth,
        users: usersData,
      },
    };
    dispatch(updateOPCServer({ newOPCUAServer }));
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

  /**
   * This code snippet defines an array of objects named 'usersColumnData' that represents the column data for a table.
   * Each object in the array represents a column and contains properties such as 'accessorKey', 'header', 'enableColumnOrdering',
   * 'enableEditing', and 'enableSorting'.
   * 
   * The 'accessorKey' property represents the key used to access the data for the column in each row of the table.
   * The 'header' property represents the header text for the column.
   * The 'enableColumnOrdering' property determines whether the column can be reordered by the user.
   * The 'enableEditing' property determines whether the column is editable.
   * The 'enableSorting' property determines whether the column can be sorted by the user.
   * 
   * This code can be used to define the column data for a table in a React application.
   * 
   * Example usage:
   * 
   * const usersColumnData = [
   *   {
   *     accessorKey: "username",
   *     header: "User",
   *     enableColumnOrdering: true,
   *     enableEditing: true, // disable editing on this column
   *     enableSorting: true,
   *   },
   *   {
   *     accessorKey: "password",
   *     header: "Password",
   *     enableColumnOrdering: true,
   *     enableEditing: true, // disable editing on this column
   *     enableSorting: true,
   *   },
   * ];
   */

  const usersColumnData = [
    {
      accessorKey: "username",
      header: "User",
      enableColumnOrdering: true,
      enableEditing: true, // disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "password",
      header: "Password",
      enableColumnOrdering: true,
      enableEditing: true, // disable editing on this column
      enableSorting: true,
    },
  ];

  return (
    <Container>
      <h2>OPCUA Server</h2>
      <SecondaryNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        navbarItems={navbarItems}
      />
      {currentTab === 5 && <JSONTree data={opcua} />}

      <form onSubmit={handleOPCUAServerChange}>
        {currentTab === 0 && (
          <>
            <FormLabel>
              Expose IoT gateways with OPCUA Server only in read mode
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
                  options={Object.keys(iotGatewaysFromList)}
                  onChange={(event, newValue) => {
                    setIotGatewayFrom(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="IoT Gateways for OPCUA server read only list"
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

            <FormLabel>Remote Things configuration</FormLabel>

            <CustomTable
              tableData={iotGatewaysFromTableData}
              setTableData={setIotGatewaysFromTableData}
              columnsData={iotGatewaysColumnData}
            />

            <Divider />

            <FormLabel>
              Expose IoT gateways with OPCUA Server in read and write mode
            </FormLabel>
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <FormControl fullWidth>
                {/* <TextField
                  select
                  label="Choose iot gateway from Kepware"
                  defaultValue=""
                  onChange={handleIotGatewaysToChange}
                >
                  {iotGatewaysToList &&
                    Object.keys(iotGatewaysToList).length !== 0 &&
                    Object.keys(iotGatewaysToList).map((item) => {
                      return (
                        <MenuItem key={Math.random() + item} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                </TextField> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Object.keys(iotGatewaysToList)}
                  onChange={(event, newValue) => {
                    setIotGatewayTo(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="IoT Gateways for OPCUA server read and write list"
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

            <FormLabel>Remote Things configuration</FormLabel>

            <CustomTable
              tableData={iotGatewaysToTableData}
              setTableData={setIotGatewaysToTableData}
              columnsData={iotGatewaysColumnData}
            />

            <Divider />
          </>
        )}
        {currentTab === 1 && (
          <>
            <FormLabel>
              Kepware IoT Gateways list for OPCUA Server with read only
              permission
            </FormLabel>
            <Grid
              container
              columns={{ xs: 4, sm: 12, md: 12 }}
              sx={{ mt: 5, mb: 5 }}
            >
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Enabled IoT Gateways for OPCUA (readonly)</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer sx={{ height: 150 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysFromList &&
                          Object.keys(iotGatewaysFromList).length !== 0 &&
                          Object.keys(iotGatewaysFromList).map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell align="center">
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      endIcon={<BlurOffIcon />}
                                      onClick={() => {
                                        handleDisableIotGateway(
                                          iotGatewayName,
                                          "from"
                                        );
                                      }}
                                      size="small"
                                    >
                                      Disable
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Disabled IoT Gateways for OPCUA (readonly)</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer sx={{ height: 150 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysFromListDisabled &&
                          Object.keys(iotGatewaysFromListDisabled).length !==
                            0 &&
                          Object.keys(iotGatewaysFromListDisabled).map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell
                                    align="center"
                                    style={{ color: "grey" }}
                                  >
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      endIcon={<BlurOnIcon />}
                                      onClick={() => {
                                        handleEnableIotGateway(
                                          iotGatewayName,
                                          "from"
                                        );
                                      }}
                                      size="small"
                                    >
                                      Enable
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
            <FormLabel>
              Kepware IoT Gateways list for OPCUA Server with read and write
              permission
            </FormLabel>
            <Grid
              container
              columns={{ xs: 4, sm: 12, md: 12 }}
              sx={{ mt: 5, mb: 5 }}
            >
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Enabled IoT Gateways for OPCUA (read & write)</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer sx={{ height: 150 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysToList &&
                          Object.keys(iotGatewaysToList).length !== 0 &&
                          Object.keys(iotGatewaysToList).map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell align="center">
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      endIcon={<BlurOffIcon />}
                                      onClick={() => {
                                        handleDisableIotGateway(
                                          iotGatewayName,
                                          "to"
                                        );
                                      }}
                                      size="small"
                                    >
                                      Disable
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Disabled IoT Gateways for OPCUA (read & write)</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer sx={{ height: 150 }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {iotGatewaysToListDisabled &&
                          Object.keys(iotGatewaysToListDisabled).length !== 0 &&
                          Object.keys(iotGatewaysToListDisabled).map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell
                                    align="center"
                                    style={{ color: "grey" }}
                                  >
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      endIcon={<BlurOnIcon />}
                                      onClick={() => {
                                        handleEnableIotGateway(
                                          iotGatewayName,
                                          "to"
                                        );
                                      }}
                                      size="small"
                                    >
                                      Enable
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {currentTab === 2 && (
          <>
            <FormControl fullWidth>
              <FormLabel>From Kepware:</FormLabel>

              <TextField
                type="text"
                inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                label="Shift from Kepware"
                helperText="Shift OPCUA nodes (in order to exclude roots) from Kepware Iot Gateway"
                defaultValue={shiftFromKepware}
                required={false}
                onChange={handleShiftFromKepwareChange}
              />
            </FormControl>
            <Divider />

            <FormControl fullWidth>
              <FormLabel>To Kepware:</FormLabel>

              <TextField
                type="number"
                label="Shift to Kepware"
                helperText="Shift OPCUA nodes (in order to exclude roots) to Kepware Iot Gateway"
                defaultValue={shiftToKepware}
                required={false}
                onChange={handleShiftToKepwareChange}
              />
            </FormControl>
            <Divider />
          </>
        )}
        {currentTab === 3 && (
          <>
            <FormControl fullWidth>
              <FormLabel>OPCUA Server Port:</FormLabel>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Use Default Port - 4840</Typography>

                <Switch
                  checked={customPortEnable}
                  onChange={handleCustomPortEnableChange}
                />

                <Typography>Use Custom Port</Typography>
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
                    helperText="Use this port for OPCUA Server tag exposure"
                    defaultValue={customPort}
                    required={false}
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
              <FormLabel>Enable/Disable OPCUA Server authentication:</FormLabel>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Disable</Typography>

                <Switch
                  checked={serverAuth}
                  onChange={handleServerAuthChange}
                />

                <Typography>Enable</Typography>
              </Stack>
            </FormControl>

            <Divider />

            {serverAuth && (
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
          </>
        )}

        <FormControl fullWidth>
          <Button type="submit" variant="contained">
            Invia
          </Button>
        </FormControl>
      </form>
    </Container>
  );
}
