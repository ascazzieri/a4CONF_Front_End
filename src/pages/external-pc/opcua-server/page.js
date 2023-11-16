import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOPCServer } from "../../../utils/redux/reducers";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import {
  getArrayOfObjects,
  getQueuePending,
  nonNullItemsCheck,
} from "../../../utils/utils";
import { JSONTree } from "react-json-tree";
import CustomTable from "../../../components/Table/Table";
import { LoadingContext } from "../../../utils/context/Loading";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import BackButton from "../../../components/BackButton/BackButton";
import {
  get_iot_gtws_opcua_reading_enabled,
  get_iot_gtws_opcua_reading_disabled,
  get_iot_gtws_opcua_reading_writing_enabled,
  get_iot_gtws_opcua_reading_writing_disabled,
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
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import {
  opcua_host_address_desc,
  opcua_iot_gateway_desc,
  opcua_iot_gateway_write_desc,
  opcua_manage_readgate_desc,
  opcua_manage_writegate_desc,
  opcua_rt_configuration,
  opcua_security_desc,
  opcua_server_port_desc,
  opcua_shift_fromkep_desc,
  opcua_shift_tokep_desc,
} from "../../../utils/titles";

export default function OPCServer() {
  const opcua = useSelector((state) => state?.services?.opcua);
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
        "Shift nodes",
        "Host",
        "Port",
        "Security",
        "JSON",
      ]
    : [
        "Expose Iot Gateway",
        "Manage Iot Gateways",
        "Shift nodes",
        "Host",
        "Port",
        "Security",
      ];

  const getArrayOfObjectsOPCUA = (data, key1, key2) => {
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
    getArrayOfObjectsOPCUA(opcua?.iotgw?.from, "iot_gateway", "read only")
  );

  const [iotGatewaysToList, setIotGatewaysToList] = useState([]);
  const [iotGatewaysToListDisabled, setIotGatewaysToListDisabled] = useState(
    []
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
  const [hostBinding, setHostBinding] = useState(opcua?.opcua?.host);
  const [usersTableData, setUsersTableData] = useState(
    getArrayOfObjects(opcua?.security?.users, "username", "password")
  );
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  useEffect(() => {
    setIotGatewaysFromTableData(
      getArrayOfObjectsOPCUA(opcua?.iotgw?.from, "iot_gateway", "read only")
    );
    setIotGatewaysToTableData(
      getArrayOfObjectsOPCUA(opcua?.iotgw?.to, "iot_gateway", "read & write")
    );
    setShiftFromKepware(opcua?.shift_property_to_kepware);
    setShiftToKepware(opcua?.shift_property_to_kepware);
    setCustomPortEnable(opcua?.opcua?.custom_port_enable);
    setCustomPort(opcua?.opcua?.custom_port);
    setServerAuth(opcua?.security?.user_auth);
    setHostBinding(opcua?.opcua?.host);
    setUsersTableData(
      getArrayOfObjects(opcua?.security?.users, "username", "password")
    );
  }, [opcua]);

  useEffect(() => {
    (async () => {
      try {
        loaderContext[1](true);
        const iotGatewaysFromEnabled =
          await get_iot_gtws_opcua_reading_enabled();
        const iotGatewaysFromDisabled =
          await get_iot_gtws_opcua_reading_disabled();
        const iotGatewaysToEnabled =
          await get_iot_gtws_opcua_reading_writing_enabled();
        const iotGatewaysToDisabled =
          await get_iot_gtws_opcua_reading_writing_disabled();
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
          message: `An erro occurred while trying to load Kepware IoT gateways`,
        });
      } finally {
        if (getQueuePending() === 0) {
          loaderContext[1](false);
        }
      }
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
    try {
      loaderContext[1](true);
      let iotGateways = undefined;
      if (direction === "from") {
        iotGateways = await get_iot_gtws_opcua_reading_enabled();
      } else if (direction === "to") {
        iotGateways = await get_iot_gtws_opcua_reading_writing_enabled();
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
        message: `An error occurred while trying to load Kepware IoT gateways`,
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
      const iotGatewaysFromEnabled = await get_iot_gtws_opcua_reading_enabled();
      const iotGatewaysFromDisabled =
        await get_iot_gtws_opcua_reading_disabled();
      const iotGatewaysToEnabled =
        await get_iot_gtws_opcua_reading_writing_enabled();
      const iotGatewaysToDisabled =
        await get_iot_gtws_opcua_reading_writing_disabled();
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
        message: `An error occurred while trying to load Kewpare IoT gateways`,
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
        message: `An error occurred while trying to manage IoT gateway`,
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
      if (permission === "from") {
        loaderContext[1](true);
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
        loaderContext[1](true);
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

  const handleOPCUAServerChange = (event) => {
    event.preventDefault();
    const iot_gateway_from = iotGatewaysFromTableData?.map(
      (item) => item?.iot_gateway
    );
    const iot_gateway_to = iotGatewaysToTableData?.map(
      (item) => item?.iot_gateway
    );
    let usersData = {};
    if (usersTableData.length !== 0) {
      usersTableData?.map(
        (item, index) => (usersData[`${item?.username}`] = item?.password)
      );
    }

    const newOPCUAServer = {
      ...opcua,
      shift_property_from_kepware: shiftFromKepware,
      shift_property_to_kepware: shiftToKepware,
      opcua: {
        custom_port_enable: customPortEnable,
        custom_port: customPort,
        host: hostBinding,
      },
      iotgw: {
        from: iot_gateway_from ? iot_gateway_from : [],
        to: iot_gateway_to ? iot_gateway_to : [],
      },
      security: {
        user_auth: serverAuth,
        users: usersData,
      },
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `OPCUA Server configuration save correctly`,
    });
    dispatch(updateOPCServer(newOPCUAServer));
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
  const iotGatewayValidation = {
    iot_gateway: nonNullItemsCheck,
  };

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
  const usersValidation = {
    username: nonNullItemsCheck,
    password: nonNullItemsCheck,
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="OPCUA Server" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 6 && superUser && <JSONTree data={opcua} />}

        <form onSubmit={handleOPCUAServerChange}>
          {currentTab === 0 && (
            <>
              <FormLabel title={opcua_iot_gateway_desc}>
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
                    options={iotGatewaysFromList || []}
                    onChange={(event, newValue) => {
                      setIotGatewayFrom(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        title={opcua_iot_gateway_desc}
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

              <FormLabel title={opcua_rt_configuration}>
                IoT Gateway read mode exposed
              </FormLabel>

              <CustomTable
                tableData={iotGatewaysFromTableData}
                setTableData={setIotGatewaysFromTableData}
                columnsData={iotGatewaysColumnData}
                validationObject={iotGatewayValidation}
              />

              <Divider />

              <FormLabel title={opcua_iot_gateway_write_desc}>
                Expose IoT gateways with OPCUA Server in read and write mode
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
                    options={iotGatewaysToList || []}
                    onChange={(event, newValue) => {
                      setIotGatewayTo(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        title={opcua_iot_gateway_write_desc}
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

              <FormLabel title={opcua_rt_configuration}>
                IoT Gateway read and write mode exposed
              </FormLabel>

              <CustomTable
                tableData={iotGatewaysToTableData}
                setTableData={setIotGatewaysToTableData}
                columnsData={iotGatewaysColumnData}
                validationObject={iotGatewayValidation}
              />

              <Divider />
            </>
          )}
          {currentTab === 1 && (
            <>
              <FormLabel title={opcua_manage_readgate_desc}>
                Kepware IoT Gateways list for OPCUA Server with read only
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
                <h3>Enable/Disable IoT Gateways for OPCUA (readonly)</h3>
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

              <FormLabel title={opcua_manage_writegate_desc}>
                Kepware IoT Gateways list for OPCUA Server with read and write
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
                <h3>Enable/Disable IoT Gateways for OPCUA (read & write)</h3>
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
                <FormLabel title={opcua_shift_fromkep_desc}>
                  From Kepware:
                </FormLabel>

                <TextField
                  title={opcua_shift_fromkep_desc}
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="Shift from Kepware"
                  helperText="Shift OPCUA nodes (in order to exclude roots) from Kepware Iot Gateway"
                  value={shiftFromKepware || 0}
                  required={false}
                  onChange={handleShiftFromKepwareChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <FormLabel title={opcua_shift_tokep_desc}>
                  To Kepware:
                </FormLabel>

                <TextField
                  title={opcua_shift_tokep_desc}
                  type="number"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  label="Shift to Kepware"
                  helperText="Shift OPCUA nodes (in order to exclude roots) to Kepware Iot Gateway"
                  value={shiftToKepware || 0}
                  required={false}
                  onChange={handleShiftToKepwareChange}
                />
              </FormControl>
              <Divider />
            </>
          )}
          {currentTab === 3 && (
            <>
              <FormControl fullWidth title={opcua_host_address_desc}>
                <Autocomplete
                  disablePortal
                  options={["127.0.0.1", "0.0.0.0"]}
                  value={hostBinding || ""}
                  onChange={(event, newValue) => {
                    setHostBinding(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      title={opcua_host_address_desc}
                      {...params}
                      label="Select OPCUA host address binding"
                    />
                  )}
                />
              </FormControl>
              <Divider />
            </>
          )}
          {currentTab === 4 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={opcua_server_port_desc}>
                  OPCUA Server Port:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>
                    Use Default Port {customPortEnable ? "" : 4840}
                  </Typography>

                  <Switch
                    checked={customPortEnable}
                    onChange={handleCustomPortEnableChange}
                    title={opcua_server_port_desc}
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
                      helperText="Use this port for OPCUA Server tag exposure"
                      value={customPort || ""}
                      required={false}
                      onChange={handleCustomPortChange}
                    />
                  </FormControl>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 5 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={opcua_security_desc}>
                  Enable/Disable OPCUA Server authentication:
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Disable</Typography>

                  <Switch
                    title={opcua_security_desc}
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

                  <CustomTable
                    tableData={usersTableData}
                    setTableData={setUsersTableData}
                    columnsData={usersColumnData}
                    validationObject={usersValidation}
                  />

                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab !== 1 && currentTab !== 6 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
