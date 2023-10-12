import { useState, useContext, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import {
  updateCustomerNetwork,
  updatePingResult,
} from "../../../utils/redux/reducers";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { test_connection } from "../../../utils/api";
import { getArrayOfObjects } from "../../../utils/utils";
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
import {
  network_alis_desc,
  network_connection_desc,
  network_defgateway_desc,
  network_dns_desc,
  network_firewall_desc,
  network_forwarding_desc,
  network_ipaddress_desc,
  network_machine_internet_desc,
  network_nat_feature_desc,
  network_ntp_custom_desc,
  network_ntp_server_desc,
  network_ping_address_desc,
  network_ping_list_debugger,
  network_ping_list_desc,
  network_ping_number_desc,
  network_static_routes_desc,
  network_typeconnection_desc,
} from "../../../utils/titles";

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
    customerNetwork?.INPUT_NAT
  );

  useEffect(() => {
    setIPAddress(customerNetwork?.static?.ip);
    setDefaultGateway(customerNetwork?.static?.gateway);
    setDNSServer(customerNetwork?.static?.dns);
    setCustomNTP(customerNetwork?.ntp?.length !== 0 ? true : false);
    setNTPAddress(customerNetwork?.ntp);
    setNATFeatures(customerNetwork?.nat);
    setWifiTableData(
      getArrayOfObjects(customerNetwork?.wireless, "ssid", "password")
    );
    setMachineToInternet(customerNetwork?.machine_to_internet);
    setConnection(customerNetwork?.dhcp ? "dhcp" : "static");
    setConnectionType(customerNetwork?.if_wan_medium);
    setRouteTableData(
      getArrayOfObjects(customerNetwork?.routes, "subnet", "gateway")
    );
    setAliasTableData(
      getArrayOfObjects(customerNetwork?.ALIAS, "alias", "value")
    );
    setPortsAllowedTableData(
      getArrayOfObjects(
        customerNetwork?.PORTS_TCP_SERVER_WAN,
        "external_tcp_ports",
        "source"
      )
    );
    setInputNATTableData(customerNetwork?.INPUT_NAT);
  }, [customerNetwork]);

  const handleConnectionChange = (event) => {
    setConnection(event.target.value);
  };
  const handleIPAddressChange = (event) => {
    const ip_addr = event?.target?.value?.split(",") || event?.target?.value;
    setIPAddress(ip_addr);
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

  if (customerNetwork?.dhcp && customerNetwork?.static?.ip?.length === 0) {
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "error",
      message: `Unable to acquire ip address for data sender `,
    });
  }

  const handleAddHostList = () => {
    const newHost = currentHost ? currentHost : undefined;
    if (!newHost || newHost.length === 0 || newHost.trim() === "") {
      return;
    }
    const oldHostList = new Set(hostList);
    oldHostList.add(newHost.trim());
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
      type: "password",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
      size: 80,
    },
  ];

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
                <FormLabel title={network_connection_desc}>
                  Connection:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={connection || ""}
                  required={true}
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
                <FormLabel title={network_ipaddress_desc}>
                  IP Address:
                </FormLabel>

                <TextField
                  type="text"
                  label="IP Address"
                  helperText="Ip device address"
                  value={ipAddress || ""}
                  disabled={connection === "dhcp"}
                  required={connection === "dhcp" ? false : true}
                  onChange={handleIPAddressChange}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel title={network_defgateway_desc}>
                  Default Gateway:
                </FormLabel>

                <TextField
                  type="text"
                  label="Default Gateway"
                  helperText="Default gateway address"
                  disabled={connection === "dhcp"}
                  required={connection === "dhcp" ? false : true}
                  value={defaultGateway || ""}
                  onChange={handleDefaultGatewayChange}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel title={network_dns_desc}>DNS server:</FormLabel>

                <TextField
                  type="text"
                  label="DNS Server"
                  helperText="DNS server address"
                  disabled={connection === "dhcp"}
                  required={connection === "dhcp" ? false : true}
                  value={dnsServer || ""}
                  onChange={handleDNSServerChnage}
                />
              </FormControl>
              <Divider />
              <FormControl fullWidth>
                <FormLabel title={network_typeconnection_desc}>
                  Connection type:
                </FormLabel>

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
                    label="Ethernet"
                  />
                  <FormControlLabel
                    value="wireless"
                    control={<Radio />}
                    label="Wireless"
                  />
                </RadioGroup>
              </FormControl>

              {connectionType === "wireless" && (
                <>
                  {customerNetwork.essid &&
                  customerNetwork?.essid.length !== 0 ? (
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
                            {customerNetwork?.essid.map((item) => {
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

                          <Button onClick={handleAddSSID} variant="contained">
                            Add SSID
                          </Button>
                        </Stack>
                      </FormControl>
                    </>
                  ) : (
                    <>
                      <Typography>
                        No ESSID found. Check your connection settings, apply
                        changes and reload configuration
                      </Typography>
                    </>
                  )}

                  <FormLabel>Wifi:</FormLabel>
                  <CustomTable
                    tableData={wifiTableData || []}
                    setTableData={setWifiTableData}
                    columnsData={wifiColumnData}
                    //selectableObjectData={wifiSelectableObjectData}
                  />
                  <Divider />
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
                  <FormLabel title={network_ping_address_desc}>
                    Add new address to ping test:
                  </FormLabel>

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
                <FormLabel title={network_ping_number_desc}>
                  Ping number:
                </FormLabel>

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
                  <FormLabel title={network_ping_list_desc}>
                    Ping list:
                  </FormLabel>
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
                    <FormLabel title={network_ping_list_debugger}>
                      External PC network debugger:
                    </FormLabel>
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
                              let colorLabel = "white";
                              for (const key in item[ip]) {
                                if (item[ip][key]?.result !== true) {
                                  colorLabel = "red";
                                }
                              }
                              return (
                                <Fragment key={Math.random()}>
                                  <ListItemButton
                                    onClick={(event) =>
                                      handleExpandableListHosts(event, ip)
                                    }
                                    key={Math.random()}
                                  >
                                    <ListItemIcon key={Math.random()}>
                                      <LabelImportantIcon key={Math.random()} />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={ip}
                                      key={Math.random()}
                                      style={{ color: colorLabel }}
                                    />
                                    {expandedListHosts.includes(ip) ? (
                                      <ExpandLess key={Math.random()} />
                                    ) : (
                                      <ExpandMore key={Math.random()} />
                                    )}
                                  </ListItemButton>
                                  <Collapse
                                    in={expandedListHosts.includes(ip)}
                                    timeout="auto"
                                    unmountOnExit
                                    key={Math.random()}
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
                                            <Fragment key={Math.random()}>
                                              <ListItemButton
                                                onClick={(event) =>
                                                  handleExpandableListPingNumber(
                                                    event,
                                                    ip,
                                                    pingNumber
                                                  )
                                                }
                                                sx={{ pl: 5 }}
                                                key={Math.random()}
                                              >
                                                <ListItemIcon
                                                  key={Math.random()}
                                                >
                                                  <DvrIcon
                                                    key={Math.random()}
                                                  />
                                                </ListItemIcon>
                                                <ListItemText
                                                  primary={pingNumber}
                                                  key={Math.random()}
                                                />
                                                {expandedListPingNumber.includes(
                                                  `${ip}.${pingNumber}`
                                                ) ? (
                                                  <ExpandLess
                                                    key={Math.random()}
                                                  />
                                                ) : (
                                                  <ExpandMore
                                                    key={Math.random()}
                                                  />
                                                )}
                                              </ListItemButton>
                                              <Collapse
                                                in={expandedListPingNumber.includes(
                                                  `${ip}.${pingNumber}`
                                                )}
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
                                                    sx={{ pl: 10 }}
                                                    key={Math.random()}
                                                  >
                                                    <ListItemIcon
                                                      key={Math.random()}
                                                    >
                                                      Result:
                                                    </ListItemIcon>
                                                    <ListItemText
                                                      primary={
                                                        result
                                                          ? goodStatus()
                                                          : badStatus()
                                                      }
                                                      key={Math.random()}
                                                    />
                                                  </ListItemButton>
                                                  <ListItemButton
                                                    sx={{ pl: 10 }}
                                                    key={Math.random()}
                                                  >
                                                    <ListItemIcon
                                                      key={Math.random()}
                                                    >
                                                      RTT
                                                    </ListItemIcon>
                                                    <ListItemText
                                                      primary={
                                                        result ? rtt : "None"
                                                      }
                                                      key={Math.random()}
                                                    />
                                                  </ListItemButton>
                                                </List>
                                              </Collapse>
                                            </Fragment>
                                          );
                                        }
                                      )}
                                  </Collapse>
                                </Fragment>
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
              <FormLabel title={network_static_routes_desc}>Routes:</FormLabel>

              <CustomTable
                tableData={routeTableData || []}
                setTableData={setRouteTableData}
                columnsData={routesColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
                <FormLabel title={network_ntp_server_desc}>
                  NTP Server:
                </FormLabel>

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
                      title={network_ntp_custom_desc}
                      type="text"
                      label="Custom NTP"
                      helperText="Custom NTP server address"
                      value={customerNetwork?.ntp || ""}
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
                <FormLabel title={network_nat_feature_desc}>
                  NAT feature:
                </FormLabel>

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
                    <FormLabel title={network_machine_internet_desc}>
                      Machine to internet:
                    </FormLabel>
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
              <FormLabel title={network_alis_desc}>Alias:</FormLabel>

              <CustomTable
                tableData={aliasTableData || []}
                setTableData={setAliasTableData}
                columnsData={aliasColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab === 6 && (
            <>
              <FormLabel title={network_firewall_desc}>
                Set TCP ports rules in input WAN:
              </FormLabel>

              <CustomTable
                tableData={portsAllowedTableData || []}
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
                  <FormLabel title={network_forwarding_desc}>
                    Foreward TCP port:
                  </FormLabel>

                  <CustomTable
                    tableData={inputNATTableData || []}
                    setTableData={setInputNATTableData}
                    columnsData={inputNatTableColumns}
                  />
                </>
              ) : (
                <>
                  <div>Nat features must be enabled</div>
                </>
              )}
            </>
          )}

          {currentTab !== 1 && currentTab !== 8 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
