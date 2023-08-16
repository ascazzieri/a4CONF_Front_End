import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateThingworx } from "../../../utils/redux/reducers";
import {
  get_iot_gtws_http_client_enabled,
  get_iot_gtws_http_client_disabled,
  enable_http_client_iot_gateway,
  disable_http_client_iot_gateway,
  twx_connection_diagnostic,
} from "../../../utils/api";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import CustomTable from "../../../components/Table/Table";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
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
  InputBase,
  Grid,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Visibility,
  VisibilityOff,
  ThumbUpOffAltOutlined,
  ThumbDownAltOutlined,
  CloudUploadOutlined,
  PendingOutlined,
} from "@mui/icons-material";
import BlurOffIcon from "@mui/icons-material/BlurOff";
import BlurOnIcon from "@mui/icons-material/BlurOn";
/** @type {*} */
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

/** @type {*} */
const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const HighlightedText = styled("span")({
  background: "#7F899E",
  fontWeight: "bold",
});

/** @type {*} */
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

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

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = [
    "Connection",
    "Remote Things",
    "Manage Iot Gateways",
    "Agent Logs",
    "JSON",
  ];

  const getArrayFromThingObject = (thingObject) => {
    let arrayFromThingsObject = [];

    Object.keys(thingObject).map((item, index) =>
      arrayFromThingsObject.push({
        iot_gateway: Object.keys(thingObject[`${item}`])[0],
        thing_name: item,
      })
    );

    return arrayFromThingsObject;
  };

  const [thingworxHost, setThingworxHost] = useState(thingworx?.host);
  const [thingworxAppkey, setThingworxAppkey] = useState(thingworx?.appkey);
  const [iotGatewaysList, setIotGatewaysList] = useState({});
  const [iotGatewaysListDisabled, setIotGatewaysListDisabled] = useState({});
  const [iotGateway, setIotGateway] = useState();
  const [thingsTableData, setThingsTableData] = useState(
    getArrayFromThingObject(thingworx?.things)
  );
  const [agentDiagnosis, setAgentDiagnosis] = useState({});

  const [expandedList, setExpandedList] = useState([]);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  /**
   * Highlights a specific search term within a given text.
   *
   * @param {string} text - The original text.
   * @param {string} search - The term to be highlighted.
   * @returns {Array|string} - The modified array of words or the original text if no match found.
   */
  const highlightText = (text, search) => {
    if (text?.length === 0) {
      return "";
    } else {
      const regex = new RegExp(`(${search})`, "gi");
      return text.split(regex).map((word, index) => {
        if (word.toLowerCase() === search.toLowerCase()) {
          return <HighlightedText key={index}>{word}</HighlightedText>;
        }
        return word;
      });
    }
  };
  const highlightedContent = highlightText(
    agentDiagnosis["Error Message"] &&
      agentDiagnosis["Error Message"].length !== 0
      ? agentDiagnosis["Error Message"]
      : "",
    searchText === " " ? "" : searchText
  );

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
    dispatch(updateThingworx({ newThingworx }));
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
    <Container>
      <h2>Thingworx</h2>
      <SecondaryNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        navbarItems={navbarItems}
      />
      {currentTab === 4 && <JSONTree data={thingworx} />}

      <form onSubmit={handleThingworxChange}>
        {currentTab === 0 && (
          <>
            <FormControl fullWidth>
              <FormLabel>IP Address:</FormLabel>

              <TextField
                type="text"
                label="Host"
                helperText="Sentinel server endpoint"
                defaultValue={thingworxHost}
                required={true}
                onChange={handleSentinelHostChange}
              />
            </FormControl>
            <Divider />

            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Appkey *
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showAppkey ? "text" : "password"}
                required={true}
                defaultValue={thingworxAppkey}
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
              <FormHelperText id="outlined-weight-helper-text">
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

            <FormLabel>Remote Things configuration</FormLabel>

            <CustomTable
              tableData={thingsTableData}
              setTableData={setThingsTableData}
              columnsData={thingsColumnData}
            />

            <Divider />
          </>
        )}
        {currentTab === 2 && (
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
                    <Table stickyHeader aria-label="sticky table" size="small">
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
                                        handleDisableIotGateway(iotGatewayName);
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
                    <Table stickyHeader aria-label="sticky table" size="small">
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
                                        handleEnableIotGateway(iotGatewayName);
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
              <FormLabel>Thingworx agent logs:</FormLabel>
              <AppBar position="static" sx={{ background: "#1F293F" }}>
                <Toolbar>
                  <Button
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
                    {agentDiagnosis && agentDiagnosis["TW is connected"] ? (
                      <ThumbUpOffAltOutlined color="success" />
                    ) : (
                      <ThumbDownAltOutlined color="error" />
                    )}
                  </IconButton>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                  ></Typography>
                  {agentDiagnosis &&
                    agentDiagnosis["Error Message"].trim().length !== 0 && (
                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ "aria-label": "search" }}
                          value={searchText}
                          onChange={handleSearch}
                        />
                      </Search>
                    )}
                </Toolbar>
                <Box component="main" sx={{ p: 3 }}>
                  {agentDiagnosis &&
                    agentDiagnosis["Error Message"].trim().length !== 0 && (
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
                        <Typography sx={{backgroundColor: "orange", maxHeight: 400, overflowY: "auto"}}>{highlightedContent}</Typography>
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
                      agentDiagnosis["Bound Thing Properties"] &&
                      agentDiagnosis["Bound Thing Properties"].length !== 0 &&
                      agentDiagnosis["Bound Thing Properties"].map(
                        (item, index) => {
                          const rtName = Object.keys(item)[0];
                          return (
                            <>
                              <ListItemButton
                                onClick={(event, name) =>
                                  handleExpandableList(event, rtName)
                                }
                              >
                                <ListItemIcon>
                                  <SettingsRemoteIcon />
                                </ListItemIcon>
                                <ListItemText primary={rtName} />
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
                              >
                                <List component="div" disablePadding>
                                  <ListItemButton sx={{ pl: 5 }}>
                                    <ListItemIcon>
                                      <DoneAllIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`TW Bound Properties: ${item[rtName]["TW Bound Properties"]} `}
                                    />
                                  </ListItemButton>
                                  <ListItemButton sx={{ pl: 5 }}>
                                    <ListItemIcon>
                                      <CallMergeIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`Ingestion Properties: ${item[rtName]["Ingestion Properties"]} `}
                                    />
                                  </ListItemButton>
                                  <ListItemButton sx={{ pl: 5 }}>
                                    <ListItemIcon>
                                      <PendingOutlinedIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={`Pending Updates: ${item[rtName]["Pending Updates"]} `}
                                    />
                                  </ListItemButton>
                                </List>
                              </Collapse>
                            </>
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
                    Agent version:{" "}
                    {agentDiagnosis && agentDiagnosis["Agent version"]
                      ? agentDiagnosis["Agent version"]
                      : "not defined"}
                  </Typography>
                </Box>
              </AppBar>
            </Box>
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
