import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCustomerNetwork } from "../../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CachedIcon from "@mui/icons-material/Cached";
import Table from "../../../components/Table/Table";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

const dummy_wireless = ["wireless1", "wireless2", "wireless3", "wireless4"];

export default function ExternalNetwork() {
  const customerNetwork = useSelector(
    (state) => state.system?.network?.customer
  );

  const dispatch = useDispatch();
  console.log(customerNetwork);
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = [
    "Connection parameters",
    "Static Routes",
    "NTP",
    "NAT",
    "Port alias",
    "Firewall rules",
    "Port forwarding",
    "JSON",
  ];
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

  const getArrayOfObjects = (data, complex, key1, key2) => {
    let arrayOfObjects = [];
    const keys = Object.keys(data);
    if (!complex && keys && keys.length !== 0) {
      keys.map((item, index) => {
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

  const [wifiTableData, setWifiTableData] = useState(
    getArrayOfObjects(customerNetwork?.wireless, false, "ssid", "password")
  );

  const [routeTableData, setRouteTableData] = useState(
    getArrayOfObjects(customerNetwork?.routes, false, "subnet", "gateway")
  );

  const [aliasTableData, setAliasTableData] = useState(
    getArrayOfObjects(customerNetwork?.ALIAS, false, "alias", "value")
  );

  const [portsAllowedTableData, setPortsAllowedTableData] = useState(
    getArrayOfObjects(
      customerNetwork?.PORTS_TCP_SERVER_WAN,
      false,
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

  console.log(routeTableData);

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
    <Container>
      <h2>Network</h2>
      <SecondaryNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        navbarItems={navbarItems}
      />
      {currentTab === 7 && <JSONTree data={customerNetwork} />}

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

            {connectionType === "wireless" && (
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
                            <MenuItem key={Math.random() + item} value={item}>
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
                <Table
                  tableData={wifiTableData}
                  setTableData={setWifiTableData}
                  columnsData={wifiColumnData}
                  selectableObjectData={wifiSelectableObjectData}
                />
              </>
            )}

            <Divider />
          </>
        )}

        {currentTab === 1 && (
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

        {currentTab === 2 && (
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

        {currentTab === 3 && (
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

        {currentTab === 4 && (
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

        {currentTab === 5 && (
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

        {currentTab === 6 && (
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
  );
}
