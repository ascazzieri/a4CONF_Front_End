import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import {
  updateCustomerNetwork,
  updatePingResult,
} from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { test_connection } from "../../../utils/api";
import { LoadingContext } from "../../../utils/context/Loading";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TableBody,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import NetworkPingIcon from "@mui/icons-material/NetworkPing";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import DvrIcon from "@mui/icons-material/Dvr";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DataArrayIcon from "@mui/icons-material/DataArray";

const dummy_wireless = ["wireless1", "wireless2", "wireless3", "wireless4"];

export default function ExternalNetwork() {
  const customerNetwork = useSelector(
    (state) => state.system?.network?.customer
  );

  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(0);
  const superUser = useContext(SuperUserContext)[0];
  const navbarItems = superUser
    ? [
        "Connection parameters",
        "Test connection",
        "Static Routes",
        "NTP",
        "NAT",
        "Port alias",
        "Firewall rules",
        "Port forwarding",
        "JSON",
      ]
    : [
        "Connection parameters",
        "Test connection",
        "Static Routes",
        "NTP",
        "NAT",
        "Port alias",
        "Firewall rules",
        "Port forwarding",
      ];
  const [expandedListHosts, setExpandedListHosts] = useState([]);
  const [expandedListPingNumber, setExpandedListPingNumber] = useState([]);

  const goodStatus = () => {
    return (
      <CheckCircleOutlineOutlinedIcon sx={{ color: "green", fontSize: 20 }} />
    );
  };
  const badStatus = () => {
    return <DangerousOutlinedIcon sx={{ color: "red", fontSize: 21 }} />;
  };

  const loaderContext = useContext(LoadingContext);
  const snackBarContext = useContext(SnackbarContext);
  const [ipAddress, setIPAddress] = useState(customerNetwork?.static?.ip);
  const [defaultGateway, setDefaultGateway] = useState(
    customerNetwork?.static?.gateway
  );
  const [dnsServer, setDNSServer] = useState(customerNetwork?.static?.dns);
  const [wifi, setWifi] = useState("");
  const [customNTP, setCustomNTP] = useState(
    customerNetwork?.ntp?.length !== 0 ? true : false
  );
  const [ntpAddress, setNTPAddress] = useState(customerNetwork?.ntp);
  const [NATFeatures, setNATFeatures] = useState(customerNetwork?.nat);
  const [machineToInternet, setMachineToInternet] = useState(
    customerNetwork?.machine_to_internet
  );
  const [connection, setConnection] = useState(
    customerNetwork?.dhcp ? "dhcp" : "static"
  );
  const [connectionType, setConnectionType] = useState(
    customerNetwork?.if_wan_medium
  );

  const [hostList, setHostList] = useState([]);
  const [currentHost, setCurrentHost] = useState("");
  const [testPingNumber, setTestPingNumber] = useState(3);

  const [connectionTest, setConnectionTest] = useState();

  const getArrayOfObjects = (data, key1, key2) => {
    let arrayOfObjects = [];
    const keys = Object.keys(data);
    if (keys && keys.length !== 0) {
      keys.forEach((item, index) => {
        arrayOfObjects.push({
          [`${key1}`]: item,
          [`${key2}`]: data[item]?.toString()?.replace(",", ", "),
        });
      });
    }

    return arrayOfObjects;
  };

  const getArrayOfInputNAT = (data) => {
    let arrayOfObjects = [];
    data.map((item, index) => {
      arrayOfObjects.push({
        IP_EXT: item?.IP_EXT,
        PORT_EXT: item?.PORT_EXT,
        IP_DST: item?.IP_DST,
        PORT_DST: item?.PORT_DST,
        SOURCE: item?.SOURCE.toString().split(","),
      });
    });
    return arrayOfObjects;
  };
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const [wifiTableData, setWifiTableData] = useState(
    getArrayOfObjects(customerNetwork?.wireless, "ssid", "password")
  );

  const [routeTableData, setRouteTableData] = useState(
    getArrayOfObjects(customerNetwork?.routes, "subnet", "gateway")
  );

  const [aliasTableData, setAliasTableData] = useState(
    getArrayOfObjects(customerNetwork?.ALIAS, "alias", "value")
  );

  const [portsAllowedTableData, setPortsAllowedTableData] = useState(
    getArrayOfObjects(
      customerNetwork?.PORTS_TCP_SERVER_WAN,
      "external_tcp_ports",
      "source"
    )
  );

  const [inputNATTableData, setInputNATTableData] = useState(
    getArrayOfInputNAT(customerNetwork?.INPUT_NAT)
  );
  const handleConnectionChange = (event) => {
    setConnection(event.target.value);
  };
  const handleIPAddressChange = (event) => {
    setIPAddress(event.target.value);
  };
  const handleDefaultGatewayChange = (event) => {
    setDefaultGateway(event.target.value);
  };
  const handleDNSServerChnage = (event) => {
    setDNSServer(event.target.value);
  };
  const handleConnectionTypeChange = (event) => {
    setConnectionType(event.target.value);
  };
  const handleWifiChange = (event) => {
    setWifi(event.target.value);
  };
  const handleAddSSID = () => {
    setWifiTableData((prevData) => [...prevData, { ssid: wifi, password: "" }]);
  };

  const handleNTPChange = (event) => {
    setCustomNTP(event.target.checked);
  };
  const handleCustomNTPChange = (event) => {
    setNTPAddress(event.target.value);
  };

  const handleNATChange = (event) => {
    setNATFeatures(event.target.checked);
  };

  const handleMTIChange = (event) => {
    setMachineToInternet(event.target.checked);
  };

  const handleExpandableListHosts = (event, ip) => {
    const oldList = [...expandedListHosts];
    if (oldList.includes(ip)) {
      setExpandedListHosts((prevItems) =>
        prevItems.filter((item) => item !== ip)
      );
    } else {
      oldList.push(ip);
      setExpandedListHosts(oldList);
    }
  };
  const handleExpandableListPingNumber = (event, ip, number) => {
    const oldList = [...expandedListPingNumber];
    if (oldList.includes(`${ip}.${number}`)) {
      setExpandedListPingNumber((prevItems) =>
        prevItems.filter((item) => item !== `${ip}.${number}`)
      );
    } else {
      oldList.push(`${ip}.${number}`);
      setExpandedListPingNumber(oldList);
    }
  };

  const handleTestConnection = async () => {
    loaderContext[1](true);
    const connection = await test_connection({
      n_ping: testPingNumber,
      ip_addresses: [hostList],
    });

    console.log("test PCB connection");

    if (connection) {
      setConnectionTest(connection);
      dispatch(updatePingResult(connection));
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Test results received`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on PCB connection test`,
      });
    }
    loaderContext[1](false);
  };

  const handleAddHostList = () => {
    const newHost = currentHost ? currentHost : undefined;
    if (newHost.trim() === "") {
      return;
    }
    const oldHostList = new Set(hostList);
    oldHostList.add(newHost);
    setHostList(Array.from(oldHostList));
  };
  const handleHostListDelete = () => {
    const newHostList = hostList.filter((item) => item !== currentHost);
    setHostList(newHostList);
  };

  const handleCustomerChange = (event) => {
    event.preventDefault();

    let wifiObject = {};
    if (wifiTableData.length !== 0) {
      wifiTableData.map(
        (item, index) => (wifiObject[`${item?.ssid}`] = item?.password)
      );
    }

    let routes = {};
    if (routeTableData.length !== 0) {
      routeTableData.map(
        (item, index) => (routes[`${item?.subnet}`] = item?.gateway)
      );
    }

    let alias = {};
    if (aliasTableData.length !== 0) {
      aliasTableData.map(
        (item, index) =>
          (alias[`${item?.alias}`] =
            !isNaN(parseInt(item?.value)) &&
            !item?.value.includes("/") &&
            !item?.value.includes('"') &&
            !item?.value.includes("'") !== 0
              ? parseInt(item?.value)
              : item?.value)
      );
    }

    let portsAllowed = {};
    if (portsAllowedTableData.length !== 0) {
      portsAllowedTableData.map(
        (item, index) =>
          (portsAllowed[`${item?.external_tcp_ports}`] = [
            !isNaN(parseInt(item?.source)) &&
            !item?.source.includes("/") &&
            !item?.source.includes('"') &&
            !item?.source.includes("'") !== 0
              ? parseInt(item?.source)
              : item?.source,
          ])
      );
    }

    const newCustomer = {
      dhcp: connection === "static" ? false : true,
      static: {
        ip: ipAddress,
        dns: dnsServer,
        gateway: defaultGateway,
      },
      if_wan_medium: connectionType,
      wireless: wifiObject,
      routes: routes,
      ntp: customNTP ? ntpAddress : [],
      nat: NATFeatures,
      machine_to_internet: machineToInternet,
      ALIAS: alias,
      PORTS_TCP_SERVER_WAN: portsAllowed,
      INPUT_NAT: inputNATTableData,
      firewall_enabled: customerNetwork?.firewall_enabled,
    };
    dispatch(updateCustomerNetwork({ newCustomer }));
  };

  const wifiColumnData = [
    {
      accessorKey: "ssid",
      header: "SSID",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "password",
      header: "PASSWORD",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  const wifiSelectableObjectData = {
    enabled: true,
    accessorKey: "ssid",
    data: dummy_wireless,
  };

  const routesColumnData = [
    {
      accessorKey: "subnet",
      header: "Subnet",
      enableColumnOrdering: true,
      enableEditing: false, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "gateway",
      header: "Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  const aliasColumnData = [
    {
      accessorKey: "alias",
      header: "Alias",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "value",
      header: "Value",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  const portsAllowedColumnData = [
    {
      accessorKey: "external_tcp_ports",
      header: "External TCP Ports",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "source",
      header: "Source",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  const portsAllowedSelectableObjectData = {
    enabled: true,
    accessorKey: "external_tcp_ports",
    data: aliasTableData,
    internal_key: "alias",
  };

  const inputNatTableColumns = [
    {
      accessorKey: "IP_EXT",
      header: "External IP (optional)",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "PORT_EXT",
      header: "External port",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "IP_DST",
      header: "Destination IP",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "PORT_DST",
      header: "Destination Port (optional)",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: "SOURCE",
      header: "Source",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Network" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 8 && superUser && <JSONTree data={customerNetwork} />}

        <form onSubmit={handleCustomerChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Connection:</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={connection}
                  onChange={handleConnectionChange}
                >
                  <FormControlLabel
                    value="static"
                    control={<Radio />}
                    label="Static"
                  />
                  <FormControlLabel
                    value="dhcp"
                    control={<Radio />}
                    label="DHCP"
                  />
                </RadioGroup>
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <FormLabel>IP Address:</FormLabel>

                <TextField
                  type="text"
                  label="IP Address"
                  helperText="Ip device address"
                  defaultValue={ipAddress}
                  required={true}
                  onChange={handleIPAddressChange}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel>Default Gateway:</FormLabel>

                <TextField
                  type="text"
                  label="Default Gateway"
                  helperText="Default gateway address"
                  defaultValue={defaultGateway}
                  onChange={handleDefaultGatewayChange}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel>DNS server:</FormLabel>

                <TextField
                  type="text"
                  label="DNS Server"
                  helperText="DNS server address"
                  defaultValue={dnsServer}
                  onChange={handleDNSServerChnage}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel>Connection type:</FormLabel>

                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={connectionType}
                  onChange={handleConnectionTypeChange}
                >
                  <FormControlLabel
                    value="ethernet"
                    control={<Radio />}
                    label="Static"
                  />
                  <FormControlLabel
                    value="wireless"
                    control={<Radio />}
                    label="Wireless"
                  />
                </RadioGroup>
              </FormControl>

              {connectionType === "wireless" &&
                customerNetwork?.essid &&
                customerNetwork?.essid.length !== 0 && (
                  <>
                    <FormControl fullWidth>
                      <Stack
                        direction="row"
                        spacing={3}
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <TextField
                          select
                          label="Add network"
                          helperText="Choose from the wireless network list ad add SSID and password to the table below"
                          defaultValue={""}
                          onChange={handleWifiChange}
                        >
                          {customerNetwork?.essid &&
                            customerNetwork?.essid.length !== 0 &&
                            customerNetwork?.essid.map((item) => {
                              return (
                                <MenuItem
                                  key={Math.random() + item}
                                  value={item}
                                >
                                  {item}
                                </MenuItem>
                              );
                            })}
                        </TextField>

                        <IconButton aria-label="reload">
                          <CachedIcon />
                        </IconButton>

                        <Button onClick={handleAddSSID} variant="contained">
                          Add SSID
                        </Button>
                      </Stack>
                    </FormControl>

                    <FormLabel>Wifi:</FormLabel>
                    <CustomTable
                      tableData={wifiTableData}
                      setTableData={setWifiTableData}
                      columnsData={wifiColumnData}
                      selectableObjectData={wifiSelectableObjectData}
                    />
                    <Divider />
                  </>
                )}
              {connectionType === "wireless" &&
                (!customerNetwork.essid ||
                  customerNetwork?.essid.length !== 0) && (
                  <>
                    <Typography>
                      No ESSID found. Check your connection settings, apply
                      changes and reload configuration
                    </Typography>
                  </>
                )}

              <Divider />
            </>
          )}
          {currentTab === 1 && (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel>Add new address to ping test:</FormLabel>

                  <TextField
                    type="text"
                    label="Add address"
                    helperText="Create a hosts list of all the address you want to ping"
                    value={currentHost}
                    onChange={(event) => {
                      setCurrentHost(event?.target?.value);
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleAddHostList}>
                  Add
                </Button>
              </Stack>
              <Divider />

              <FormControl>
                <FormLabel>FTP server port:</FormLabel>

                <TextField
                  type="number"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  label="Ping number"
                  value={testPingNumber}
                  onChange={(event) => {
                    setTestPingNumber(event?.target?.value);
                  }}
                />
              </FormControl>
              <Divider />

              {hostList && hostList.length !== 0 && (
                <>
                  <FormLabel>Ping list:</FormLabel>
                  <TableContainer sx={{ maxHeight: 250, overflowY: "auto" }}>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {hostList &&
                          hostList.length !== 0 &&
                          hostList.map((address) => {
                            return (
                              <TableRow hover key={address + Math.random()}>
                                <TableCell
                                  align="center"
                                  key={address + Math.random()}
                                >
                                  {address}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  key={address + Math.random()}
                                >
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => {
                                      handleHostListDelete(address);
                                    }}
                                    key={address + Math.random()}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Divider />
                </>
              )}
              {hostList && hostList.length !== 0 && (
                <>
                  <Box sx={{ flexGrow: 1 }}>
                    <FormLabel>External PC network debugger:</FormLabel>
                    <AppBar position="static" sx={{ background: "#1F293F" }}>
                      <Toolbar>
                        <Button
                          variant="contained"
                          onClick={handleTestConnection}
                          endIcon={<NetworkPingIcon />}
                        >
                          Test connection
                        </Button>
                        <IconButton
                          size="large"
                          edge="start"
                          color="inherit"
                          aria-label="open drawer"
                          sx={{ ml: 2 }}
                        ></IconButton>
                        <Typography
                          variant="h6"
                          noWrap
                          component="div"
                          sx={{
                            flexGrow: 1,
                            display: { xs: "none", sm: "block" },
                          }}
                        ></Typography>
                      </Toolbar>
                      <Box component="main" sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          noWrap
                          component="div"
                          sx={{ flexGrow: 1 }}
                        >
                          {connectionTest
                            ? "Ping result"
                            : "Press the button above to make pings towards selected addresses"}
                        </Typography>
                        <List
                          sx={{
                            width: "100%",
                          }}
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                        >
                          {connectionTest &&
                            connectionTest.length !== 0 &&
                            connectionTest.map((item, index) => {
                              const ip = Object.keys(item)[0] || undefined;
                              if (!ip) {
                                return <>Error on loading ping test results</>;
                              }
                              return (
                                <>
                                  <ListItemButton
                                    onClick={(event) =>
                                      handleExpandableListHosts(event, ip)
                                    }
                                  >
                                    <ListItemIcon>
                                      <LabelImportantIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={ip} />
                                    {expandedListHosts.includes(ip) ? (
                                      <ExpandLess />
                                    ) : (
                                      <ExpandMore />
                                    )}
                                  </ListItemButton>
                                  <Collapse
                                    in={expandedListHosts.includes(ip)}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    {ip &&
                                      item[ip] &&
                                      Object.keys(item[ip]).length !== 0 &&
                                      Object.keys(item[ip]).map(
                                        (pingNumber) => {
                                          const result =
                                            item[ip][pingNumber]?.result;
                                          const rtt = result
                                            ? item[ip][pingNumber]?.rtt
                                            : undefined;
                                          return (
                                            <>
                                              <ListItemButton
                                                onClick={(event) =>
                                                  handleExpandableListPingNumber(
                                                    event,
                                                    ip,
                                                    pingNumber
                                                  )
                                                }
                                                sx={{ pl: 5 }}
                                              >
                                                <ListItemIcon>
                                                  <DvrIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                  primary={pingNumber}
                                                />
                                                {expandedListPingNumber.includes(
                                                  `${ip}.${pingNumber}`
                                                ) ? (
                                                  <ExpandLess />
                                                ) : (
                                                  <ExpandMore />
                                                )}
                                              </ListItemButton>
                                              <Collapse
                                                in={expandedListPingNumber.includes(
                                                  `${ip}.${pingNumber}`
                                                )}
                                                timeout="auto"
                                                unmountOnExit
                                              >
                                                <List
                                                  component="div"
                                                  disablePadding
                                                >
                                                  <ListItemButton
                                                    sx={{ pl: 10 }}
                                                  >
                                                    <ListItemIcon>
                                                      Result:
                                                    </ListItemIcon>
                                                    <ListItemText
                                                      primary={
                                                        result
                                                          ? goodStatus()
                                                          : badStatus()
                                                      }
                                                    />
                                                  </ListItemButton>
                                                  <ListItemButton
                                                    sx={{ pl: 10 }}
                                                  >
                                                    <ListItemIcon>
                                                      RTT
                                                    </ListItemIcon>
                                                    <ListItemText
                                                      primary={
                                                        result ? rtt : "None"
                                                      }
                                                    />
                                                  </ListItemButton>
                                                </List>
                                              </Collapse>
                                            </>
                                          );
                                        }
                                      )}
                                  </Collapse>
                                </>
                              );
                            })}
                        </List>
                        <Divider />
                      </Box>
                    </AppBar>
                  </Box>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormLabel>Routes:</FormLabel>

              <Table
                tableData={routeTableData}
                setTableData={setRouteTableData}
                columnsData={routesColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
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
              )}
            </>
          )}

          {currentTab === 4 && (
            <>
              <FormControl fullWidth>
                <FormLabel>NAT feature:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Disable NAT</Typography>

                  <Switch checked={NATFeatures} onChange={handleNATChange} />

                  <Typography>Enable NAT</Typography>
                </Stack>

                <Typography>
                  In outgoing connections, internal IPs will be replaced with
                  a4GATE external IP
                </Typography>
              </FormControl>

              <Divider />

              {NATFeatures && (
                <>
                  <FormControl fullWidth>
                    <FormLabel>Machine to internet:</FormLabel>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>Disable</Typography>
                      <Switch
                        checked={machineToInternet}
                        onChange={handleMTIChange}
                      />
                      <Typography>Enable</Typography>
                    </Stack>
                    <Typography>
                      Machine network can reach external network
                    </Typography>
                  </FormControl>

                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 5 && (
            <>
              <FormLabel>Alias:</FormLabel>

              <Table
                tableData={aliasTableData}
                setTableData={setAliasTableData}
                columnsData={aliasColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab === 6 && (
            <>
              <FormLabel>Set TCP ports rules in input WAN:</FormLabel>

              <Table
                tableData={portsAllowedTableData}
                setTableData={setPortsAllowedTableData}
                columnsData={portsAllowedColumnData}
                selectableObjectData={portsAllowedSelectableObjectData}
              />

              <Divider />
            </>
          )}

          {currentTab === 7 && (
            <>
              {NATFeatures ? (
                <>
                  <div style={{ backgroundColor: "red" }}>
                    <FormLabel>Foreward TCP port:</FormLabel>

                    <Table
                      tableData={inputNATTableData}
                      setTableData={setInputNATTableData}
                      columnsData={inputNatTableColumns}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>Nat features must be enabled</div>
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
