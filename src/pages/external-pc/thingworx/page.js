import React, { useState, useEffect, useContext, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateThingworx } from "../../../utils/redux/reducers";
import {
  get_iot_gtws_http_client_enabled,
  get_iot_gtws_http_client_disabled,
  enable_http_client_iot_gateway,
  disable_http_client_iot_gateway,
  twx_connection_diagnostic,
} from "../../../utils/api";
import SaveButton from "../../../components/SaveButton/SaveButton";
import BackButton from "../../../components/BackButton/BackButton";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { JSONTree } from "react-json-tree";
import CustomTable from "../../../components/Table/Table";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import SettingsRemoteIcon from "@mui/icons-material/SettingsRemote";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  TextField,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  MenuItem,
  Typography,
  Grid,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import {
  Visibility,
  VisibilityOff,
  CloudUploadOutlined,
} from "@mui/icons-material";
import BlurOffIcon from "@mui/icons-material/BlurOff";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import {
  thingworx_agent_desc,
  thingworx_appkey_desc,
  thingworx_iotkep_desc,
  thingworx_ipaddress_desc,
  thingworx_manage_iot_desc,
  thingworx_remote_config_desc,
} from "../../../utils/titles";

/**
 * Represents a React component for managing IoT gateways and remote things.
 *
 * @returns {React.Component} The Thingworx component.
 */
export default function Thingworx() {
  const thingworx = useSelector((state) => state.services?.thingworx);

  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  const loaderContext = useContext(LoadingContext);

  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const superUser = useContext(SuperUserContext)[0];

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? [
        "Connection",
        "Remote Things",
        "Manage Iot Gateways",
        "Agent Logs",
        "JSON",
      ]
    : ["Connection", "Remote Things", "Manage Iot Gateways", "Agent Logs"];

  const getArrayFromThingObject = (thingObject) => {
    let arrayFromThingsObject = [];

    if (thingObject && Object.keys(thingObject).length !== 0) {
      Object.keys(thingObject).map((item, index) =>
        arrayFromThingsObject.push({
          iot_gateway: Object.keys(thingObject[`${item}`])[0],
          thing_name: item,
        })
      );
    }

    return arrayFromThingsObject;
  };

  const [thingworxHost, setThingworxHost] = useState(thingworx?.host);
  const [thingworxAppkey, setThingworxAppkey] = useState(thingworx?.appkey);
  const [iotGatewaysList, setIotGatewaysList] = useState({});
  const [iotGatewaysListDisabled, setIotGatewaysListDisabled] = useState({});
  const [iotGateway, setIotGateway] = useState();
  const [thingsTableData, setThingsTableData] = useState(
    getArrayFromThingObject(thingworx?.things, "iot_gateway", "thing_name")
  );

  useEffect(() => {
    setThingworxHost(thingworx?.host);
    setThingworxAppkey(thingworx?.appkey);
    setThingsTableData(getArrayFromThingObject(thingworx?.things));
  }, [thingworx]);
  const [agentDiagnosis, setAgentDiagnosis] = useState({});

  const [expandedList, setExpandedList] = useState([]);

  const agentDiagnosisHandler = () => {
    if (!agentDiagnosis) {
      return;
    }
    if (agentDiagnosis.appkey_NOT_set) {
      return "Appkey not set!";
    } else if (agentDiagnosis.server_NOT_set) {
      return "Server not set!";
    } else if (agentDiagnosis.server_name_dns_resolve === false) {
      return "Cannot resolve DNS!";
    } else if (agentDiagnosis.server_ip_reachable === false) {
      return "Server is not reachable!";
    } else if (
      agentDiagnosis.connection_error &&
      agentDiagnosis.connection_error.trim().length !== 0
    ) {
      return agentDiagnosis.connection_error;
    } else {
      return true;
    }
  };

  /*   const highlightedContent = highlightText(
    agentDiagnosisHandler(),
    searchText === " " ? "" : searchText
  ); */

  const [showAppkey, setShowAppkey] = useState(false);
  const handleClickShowPassword = () => setShowAppkey((show) => !show);

  useEffect(() => {
    (async () => {
      loaderContext[1](true);
      const iotGatewaysEnabled = await get_iot_gtws_http_client_enabled();
      const iotGatewaysDisabled = await get_iot_gtws_http_client_disabled();
      const agentConnectionInfo = await twx_connection_diagnostic();
      console.log("get IoT gateways");
      if (
        iotGatewaysEnabled &&
        iotGatewaysDisabled &&
        Object.keys(iotGatewaysEnabled).length !== 0
      ) {
        setIotGatewaysList(iotGatewaysEnabled);
        setIotGatewaysListDisabled(iotGatewaysDisabled);
      } else if (
        iotGatewaysEnabled &&
        iotGatewaysDisabled &&
        Object.keys(iotGatewaysEnabled).length === 0
      ) {
        setIotGatewaysList(iotGatewaysEnabled);
        setIotGatewaysListDisabled(iotGatewaysDisabled);
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on Kepware IoT Gateway loading`,
        });
      }
      if (agentConnectionInfo) {
        setAgentDiagnosis(agentConnectionInfo);
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on Thingworx agent diagnosis `,
        });
      }
      loaderContext[1](false);
    })();
  }, []);

  const handleSentinelHostChange = (event) => {
    setThingworxHost(event?.target?.value);
  };
  const handleAppkeyChange = (event) => {
    setThingworxAppkey(event?.target?.value);
  };
  const handleIotGatewaysChange = (event) => {
    setIotGateway(event?.target?.value);
  };
  const handleExpandableList = (event, name) => {
    const oldList = [...expandedList];
    if (oldList.includes(name)) {
      setExpandedList((prevItems) => prevItems.filter((item) => item !== name));
    } else {
      oldList.push(name);
      setExpandedList(oldList);
    }
  };

  const handleIotGatewaysReloadChange = async () => {
    loaderContext[1](true);
    const iotGatewaysEnabled = await get_iot_gtws_http_client_enabled();
    const iotGatewaysDisabled = await get_iot_gtws_http_client_disabled();
    console.log("get IoT gateways");
    if (
      iotGatewaysEnabled &&
      iotGatewaysDisabled &&
      Object.keys(iotGatewaysEnabled).length !== 0
    ) {
      setIotGatewaysList(iotGatewaysEnabled);
      setIotGatewaysListDisabled(iotGatewaysDisabled);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware IoT gateways loaded`,
      });
    } else if (
      iotGatewaysEnabled &&
      iotGatewaysDisabled &&
      Object.keys(iotGatewaysEnabled).length === 0
    ) {
      setIotGatewaysList(iotGatewaysEnabled);
      setIotGatewaysListDisabled(iotGatewaysDisabled);
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

  const handleTestConnection = async () => {
    loaderContext[1](true);
    const agentConnectionInfo = await twx_connection_diagnostic();
    console.log("get agents info");
    if (agentConnectionInfo) {
      setAgentDiagnosis(agentConnectionInfo);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Thingworx agent connection status requested`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on Thingworx agent diagnosis `,
      });
    }
    loaderContext[1](false);
  };

  const handleEnableIotGateway = async (name) => {
    let iotGatewaDisabledList = undefined;
    const result = await enable_http_client_iot_gateway(name);

    if (!result?.enabled) {
      return;
    }
    iotGatewaDisabledList = { ...iotGatewaysListDisabled };
    setIotGatewaysList((prevData) => ({
      ...prevData,
      [`${name}`]: iotGatewaDisabledList[`${name}`],
    }));
    delete iotGatewaDisabledList[`${name}`];
    setIotGatewaysListDisabled(iotGatewaDisabledList);
  };

  const handleDisableIotGateway = async (name) => {
    let iotGatewaList = undefined;
    const result = await disable_http_client_iot_gateway(name);
    if (result?.enabled) {
      return;
    }
    iotGatewaList = { ...iotGatewaysList };
    setIotGatewaysListDisabled((prevData) => ({
      ...prevData,
      [`${name}`]: iotGatewaList[`${name}`],
    }));
    delete iotGatewaList[`${name}`];
    setIotGatewaysList(iotGatewaList);
  };

  const handleThingworxChange = (event) => {
    event.preventDefault();

    let thingsTWX = {};

    thingsTableData.map(
      (item, index) =>
        (thingsTWX[`${item?.thing_name}`] = {
          [`${item?.iot_gateway}`]: `fromkepware/${item?.thing_name}`,
        })
    );

    const newThingworx = {
      host: thingworxHost,
      appkey: thingworxAppkey,
      enabled: true,
      things: thingsTWX || {},
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Thingworx configuration save correctly`,
    });
    dispatch(updateThingworx(newThingworx));
  };

  const thingsColumnData = [
    {
      accessorKey: "iot_gateway",
      header: "IoT Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "thing_name",
      header: "Remote Thing Name",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];
  /**
   * Extracts the value of the "thingName" parameter from the given input string.
   *
   * @param {string} inputString - The input string from which to extract the "thingName" parameter.
   * @returns {string} - The extracted "thingName" value, or an empty string if "thingName=" is not present in the input string.
   */
  function extractThingName(inputString) {
    const startIndex = inputString.indexOf("thingName=");
    if (startIndex !== -1) {
      const extractedString = inputString.substring(startIndex + 10); // The length of "thingName=" is 10
      return extractedString;
    }
    return ""; // Returns an empty string if "thingName=" is not present in the input string
  }

  const handleAddRemoteThing = () => {
    setThingsTableData((prevData) => [
      ...prevData,
      {
        iot_gateway: iotGateway,
        thing_name: extractThingName(iotGatewaysList[`${iotGateway}`]),
      },
    ]);
  };

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Thingworx" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && superUser && <JSONTree data={thingworx} />}

        <form onSubmit={handleThingworxChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={thingworx_ipaddress_desc}>
                  Server:
                </FormLabel>

                <TextField
                  title={thingworx_ipaddress_desc}
                  type="text"
                  label="Server"
                  helperText="Sentinel server endpoint"
                  value={thingworxHost || ""}
                  required={true}
                  onChange={handleSentinelHostChange}
                />
              </FormControl>
              <Divider />

              <FormControl fullWidth>
                <InputLabel
                  htmlFor="outlined-adornment-password"
                  title={thingworx_appkey_desc}
                >
                  Appkey *
                </InputLabel>
                <OutlinedInput
                  title={thingworx_appkey_desc}
                  id="outlined-adornment-password"
                  type={showAppkey ? "text" : "password"}
                  required={true}
                  value={thingworxAppkey || ""}
                  onChange={handleAppkeyChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onMouseDown={handleClickShowPassword}
                        onMouseUp={handleClickShowPassword}
                        edge="end"
                      >
                        {showAppkey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                <FormHelperText>
                  Unique string Sentinel authentication
                </FormHelperText>
              </FormControl>
              <Divider />
            </>
          )}
          {currentTab === 1 && (
            <>
              <FormLabel>Connect a Local Thing to a Remote Thing</FormLabel>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <TextField
                    title={thingworx_iotkep_desc}
                    select
                    label="Choose iot gateway from Kepware"
                    defaultValue=""
                    onChange={handleIotGatewaysChange}
                  >
                    {iotGatewaysList &&
                      Object.keys(iotGatewaysList).length !== 0 &&
                      Object.keys(iotGatewaysList)
                        .filter(
                          (element) =>
                            iotGatewaysList[element].includes(
                              "http://127.0.0.1:8001"
                            ) ||
                            iotGatewaysList[element].includes(
                              "http://localhost:8001"
                            )
                        )
                        .map((item) => {
                          return (
                            <MenuItem key={Math.random() + item} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                  </TextField>
                </FormControl>
                <IconButton
                  onClick={handleIotGatewaysReloadChange}
                  aria-label="reload"
                  className="rotate-on-hover"
                >
                  <CachedIcon />
                </IconButton>
                <Button onClick={handleAddRemoteThing} variant="contained">
                  Add
                </Button>
              </Stack>

              <FormLabel title={thingworx_remote_config_desc}>
                Remote Things configuration
              </FormLabel>

              <CustomTable
                title={thingworx_remote_config_desc}
                tableData={thingsTableData}
                setTableData={setThingsTableData}
                columnsData={thingsColumnData}
              />

              <Divider />
            </>
          )}
          {currentTab === 2 && (
            <>
              <FormLabel title={thingworx_manage_iot_desc}>
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
                  <h3>Enabled IoT Gateways for Thingworx</h3>
                  <Divider />
                  <Grid
                    container
                    rowSpacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 1 }}
                  >
                    <TableContainer sx={{ height: 150 }}>
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                      >
                        <TableBody>
                          {iotGatewaysList &&
                            Object.keys(iotGatewaysList).length !== 0 &&
                            Object.keys(iotGatewaysList)
                              .filter(
                                (element) =>
                                  iotGatewaysList[element].includes(
                                    "http://127.0.0.1:8001"
                                  ) ||
                                  iotGatewaysList[element].includes(
                                    "http://localhost:8001"
                                  )
                              )
                              .map((iotGatewayName) => {
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
                                            iotGatewayName
                                          );
                                        }}
                                        size="small"
                                      >
                                        Disable
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
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
                  <h3>Disabled IoT Gateways for Thingworx</h3>
                  <Divider />
                  <Grid
                    container
                    rowSpacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 1 }}
                  >
                    <TableContainer sx={{ height: 150 }}>
                      <Table
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                      >
                        <TableBody>
                          {iotGatewaysListDisabled &&
                            Object.keys(iotGatewaysListDisabled).length !== 0 &&
                            Object.keys(iotGatewaysListDisabled)
                              .filter(
                                (element) =>
                                  iotGatewaysListDisabled[element].includes(
                                    "http://127.0.0.1:8001"
                                  ) ||
                                  iotGatewaysListDisabled[element].includes(
                                    "http://localhost:8001"
                                  )
                              )
                              .map((iotGatewayName) => {
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
                                            iotGatewayName
                                          );
                                        }}
                                        size="small"
                                      >
                                        Enable
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          {currentTab === 3 && (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <FormLabel title={thingworx_agent_desc}>
                  Thingworx agent logs:
                </FormLabel>
                <AppBar position="static" sx={{ background: "#1F293F" }}>
                  <Toolbar>
                    <Button
                      title={thingworx_agent_desc}
                      variant="contained"
                      onClick={handleTestConnection}
                      endIcon={<CloudUploadOutlined />}
                    >
                      Test connection
                    </Button>
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="open drawer"
                      sx={{ ml: 2 }}
                    >
                      {agentDiagnosis && agentDiagnosis["TW_is_connected"] ? (
                        <CheckCircleOutlineOutlinedIcon color="success" />
                      ) : (
                        <DangerousOutlinedIcon color="error" />
                      )}
                    </IconButton>
                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                    ></Typography>
                  </Toolbar>
                  <Box component="main" sx={{ p: 3 }}>
                    {agentDiagnosisHandler() !== true && (
                      <>
                        <Divider />

                        <Typography
                          variant="h6"
                          noWrap
                          component="div"
                          sx={{ flexGrow: 1, color: "red" }}
                        >
                          Error messages
                        </Typography>
                        <Typography
                          sx={{
                            backgroundColor: "orange",
                            maxHeight: 400,
                            overflowY: "auto",
                          }}
                        >
                          {agentDiagnosisHandler()}
                        </Typography>
                      </>
                    )}

                    <Divider />

                    <Typography
                      variant="h6"
                      noWrap
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      Remote Things
                    </Typography>
                    <List
                      sx={{
                        width: "100%",
                      }}
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                    >
                      {agentDiagnosis &&
                        agentDiagnosis["Bound_Thing_Properties"] &&
                        agentDiagnosis["Bound_Thing_Properties"].length !== 0 &&
                        agentDiagnosis["Bound_Thing_Properties"].map(
                          (item, index) => {
                            const rtName = Object.keys(item)[0];
                            return (
                              <Fragment key={Math.random()}>
                                <ListItemButton
                                  onClick={(event, name) =>
                                    handleExpandableList(event, rtName)
                                  }
                                  key={Math.random()}
                                >
                                  <ListItemIcon key={Math.random()}>
                                    <SettingsRemoteIcon />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={rtName}
                                    key={Math.random()}
                                  />
                                  {expandedList.includes(rtName) ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </ListItemButton>
                                <Collapse
                                  in={expandedList.includes(rtName)}
                                  timeout="auto"
                                  unmountOnExit
                                  key={Math.random()}
                                >
                                  <List
                                    component="div"
                                    disablePadding
                                    key={Math.random()}
                                  >
                                    <ListItemButton
                                      sx={{ pl: 5 }}
                                      key={Math.random()}
                                    >
                                      <ListItemIcon key={Math.random()}>
                                        <DoneAllIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={`TW Bound Properties: ${item[rtName]["TW_Bound_Properties"]} `}
                                        key={Math.random()}
                                      />
                                    </ListItemButton>
                                    <ListItemButton
                                      sx={{ pl: 5 }}
                                      key={Math.random()}
                                    >
                                      <ListItemIcon key={Math.random()}>
                                        <CallMergeIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={`Ingestion Properties: ${item[rtName]["Ingestion_Properties"]} `}
                                        key={Math.random()}
                                      />
                                    </ListItemButton>
                                    <ListItemButton
                                      sx={{ pl: 5 }}
                                      key={Math.random()}
                                    >
                                      <ListItemIcon key={Math.random()}>
                                        <PendingOutlinedIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={`Pending Updates: ${item[rtName]["Pending_Updates"]} `}
                                        key={Math.random()}
                                      />
                                    </ListItemButton>
                                  </List>
                                </Collapse>
                              </Fragment>
                            );
                          }
                        )}
                    </List>
                    <Divider />

                    <Typography
                      variant="h7"
                      noWrap
                      component="div"
                      sx={{ flexGrow: 1 }}
                    >
                      {agentDiagnosis && agentDiagnosis["Agent_version"]
                        ? `Agent version: ${agentDiagnosis["Agent_version"]}`
                        : "Agent version not defined"}
                    </Typography>
                  </Box>
                </AppBar>
              </Box>
            </>
          )}
          {(currentTab === 0 || currentTab === 1) && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
