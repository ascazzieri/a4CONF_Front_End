import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateIndustrialNetwork } from "../../../utils/redux/reducers";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CustomTable from "../../../components/Table/Table";
import {
  verifyIPCIDR,
  verifyIPnotbroadcast,
  verifyIP,
} from "../../../utils/utils";
import BackButton from "../../../components/BackButton/BackButton";
import { getArrayOfObjects } from "../../../utils/utils";
import { JSONTree } from "react-json-tree";
import SaveButton from "../../../components/SaveButton/SaveButton";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { ntp_resinc, ntp_start } from "../../../utils/api";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Table,
  Stack,
  TableContainer,
  TableCell,
  IconButton,
  TableBody,
  Typography,
  Switch,
  TableRow,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import {
  connection_network_desc,
  data_sender_syncro_desc,
  ipaddress_network_desc,
  ntp_custom_syncro_desc,
  ntp_server_address_desc,
  ntp_syncro_settings_desc,
  routes_network_desc,
  scan_exception_desc,
} from "../../../utils/titles";

export default function InternalNetwork() {
  const industrialNetwork = useSelector(
    (state) => state.system?.network?.industrial
  );
  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const loaderContext = useContext(LoadingContext);

  const superUser = useContext(SuperUserContext)[0];

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? [
        "Connection parameters",
        "Static Routes",
        "NTP",
        "Scan Exception",
        "JSON",
      ]
    : ["Connection parameters", "Static Routes", "NTP"];

  const [connection, setConnection] = useState(
    industrialNetwork?.dhcp ? "dhcp" : "static"
  );
  const [ipAddress, setIPAddress] = useState(industrialNetwork?.ip || []);

  const [routeTableData, setRouteTableData] = useState(
    getArrayOfObjects(industrialNetwork?.routes, "subnet", "gateway")
  );
  const [scanException, setScanException] = useState(
    industrialNetwork?.net_scan || []
  );
  const [currentScanException, setCurrentScanException] = useState();
  const [updateNTPfromB, setUpdateNTPFromB] = useState(
    industrialNetwork?.ntp?.update_from_B
  );
  const [customNTPAddress, setCustomNTPAddress] = useState(
    industrialNetwork?.ntp?.ip_addresses || []
  );

  useEffect(() => {
    setConnection(industrialNetwork?.dhcp ? "dhcp" : "static");
    setIPAddress(industrialNetwork?.ip || []);
    setRouteTableData(
      getArrayOfObjects(industrialNetwork?.routes, "subnet", "gateway")
    );
    setScanException(industrialNetwork?.net_scan || []);
    setUpdateNTPFromB(industrialNetwork?.ntp?.update_from_B);
    setCustomNTPAddress(industrialNetwork?.ntp?.ip_addresses || []);
  }, [industrialNetwork]);

  const handleConnectionChange = (event) => {
    setConnection(event?.target?.value);
  };
  const handleIPAddressChange = (event) => {
    const ip_addr = event?.target?.value?.split(",") || event?.target?.value;
    setIPAddress(ip_addr);
  };

  const handleAddScanException = () => {
    if (!currentScanException || currentScanException.trim() === "") {
      return;
    }

    // Creare una copia dell'array scanException
    const scanExceptionCopy = [...scanException];

    // Verificare se l'elemento è già presente nell'array
    if (!scanExceptionCopy.includes(currentScanException)) {
      // Se non è presente, aggiungerlo
      scanExceptionCopy.push(currentScanException);
      setScanException(scanExceptionCopy);
    }
  };

  const handleDeleteScanException = (value) => {
    const scanExceptionList = scanException.filter((item) => item !== value);
    setScanException(scanExceptionList);
  };

  const handleUpdateNTPFromBChange = (event) => {
    const checked = event?.target?.checked;
    setUpdateNTPFromB(checked);
  };
  const handleCustomNTPAddressChange = (event) => {
    const ip_addr = event?.target?.value?.split(",") || event?.target?.value;
    setCustomNTPAddress(ip_addr);
  };

  const handleResync = async () => {
    const ntpSettings = {
      update_from_B: updateNTPfromB,
      ip_addresses: customNTPAddress,
    };
    loaderContext[1](true);
    const res = await ntp_resinc(ntpSettings);
    if (res) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `NTP Syncronized`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred`,
      });
    }
    loaderContext[1](false);
  };
  const handleStart = async () => {
    const ntpSettings = {
      update_from_B: updateNTPfromB,
    };
    loaderContext[1](true);
    const res = await ntp_start(ntpSettings);
    if (res) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `NTP Syncronized`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred`,
      });
    }
    loaderContext[1](false);
  };

  const handleIndustrialChange = (event) => {
    event.preventDefault();

    if (
      !ipAddress?.every(verifyIPCIDR) ||
      !ipAddress?.every(verifyIPnotbroadcast)
    ) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Wrong IP address format for data collector`,
      });
      return;
    }

    let staticRoutes = {};
    if (routeTableData?.length !== 0) {
      routeTableData?.map(
        (item, index) => (staticRoutes[`${item?.subnet}`] = item?.gateway)
      );
    }
    Object.keys(staticRoutes)?.map((item) => item?.trim());
    Object.values(staticRoutes)?.map((item) => item?.trim());
    if (
      !Object.keys(staticRoutes)?.every(verifyIPCIDR) ||
      !Object.keys(staticRoutes)?.every(verifyIPnotbroadcast) ||
      !Object.values(staticRoutes)?.every(verifyIP)
    ) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Wrong IP address format for static routes`,
      });
      return;
    }
    customNTPAddress?.map((item) => item?.trim());
    if (updateNTPfromB === false && !customNTPAddress?.every(verifyIP)) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Wrong IP address format for ntp server ip addresses`,
      });
      return;
    }
    if (
      superUser &&
      (!scanException.every(verifyIPCIDR) ||
        !scanException.every(verifyIPnotbroadcast))
    ) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Wrong IP address format for scan exception`,
      });
      return;
    }
    const newIndustrial = {
      ...industrialNetwork,
      dhcp: connection === "static" ? false : true,
      ip: ipAddress?.map((item) => item.trim()),
      routes: staticRoutes,
      ntp: {
        update_from_B: updateNTPfromB,
        ip_addresses: customNTPAddress,
      },
      net_scan: scanException,
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Network configuration of data collector temporarly saved. Click Apply button to send changes to a4GATE`,
    });
    dispatch(updateIndustrialNetwork({ newIndustrial }));
  };

  const routesColumnData = [
    {
      accessorKey: "subnet",
      header: "Subnet",
      enableColumnOrdering: true,
      enableEditing: false, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "gateway",
      header: "Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Network"></BackButton>

        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 4 && superUser && <JSONTree data={industrialNetwork} />}

        <form onSubmit={handleIndustrialChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth required={true}>
                <FormLabel title={connection_network_desc}>
                  Connection:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  value={connection || ""}
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
                <FormLabel title={ipaddress_network_desc}>
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
                  title={ipaddress_network_desc}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormLabel title={routes_network_desc}>Routes:</FormLabel>

              <CustomTable
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
                <FormLabel title={ntp_syncro_settings_desc}>
                  NTP synchronization settings
                </FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Use custom NTP server</Typography>

                  <Switch
                    title={ntp_syncro_settings_desc}
                    checked={updateNTPfromB}
                    onChange={handleUpdateNTPFromBChange}
                  />

                  <Typography>Use Data Sender signal</Typography>
                </Stack>
              </FormControl>

              <Divider />

              {updateNTPfromB === false ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      title={ntp_server_address_desc}
                      type="text"
                      label="NTP Server address"
                      helperText="Insert IP address of NTP server on machine network"
                      value={customNTPAddress || ""}
                      onChange={handleCustomNTPAddressChange}
                    />
                  </FormControl>
                  <Divider />
                  <Grid container spacing={2}>
                    <Grid item xs={10}>
                      Synchronize NTP with custom server on machine network
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        onClick={handleResync}
                        endIcon={<AccessTimeOutlinedIcon />}
                      >
                        Synchronize
                      </Button>
                    </Grid>
                  </Grid>

                  <Divider />
                </>
              ) : (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={10} title={data_sender_syncro_desc}>
                      Synchronize NTP with Data Sender
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        variant="contained"
                        onClick={handleStart}
                        endIcon={<AccessTimeOutlinedIcon />}
                        title={data_sender_syncro_desc}
                      >
                        Synchronize
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider />
                </>
              )}
            </>
          )}

          {currentTab === 3 && (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel title={scan_exception_desc}>
                    Scan Exception list:
                  </FormLabel>

                  <TextField
                    type="text"
                    label="Scan Exception"
                    helperText="These ip will not be reported inside daily network scan"
                    value={currentScanException || ""}
                    required={false}
                    title={scan_exception_desc}
                    onChange={(event) => {
                      setCurrentScanException(event?.target?.value);
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleAddScanException}>
                  Add
                </Button>
              </Stack>

              <TableContainer sx={{ maxHeight: 250, overflowY: "auto" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableBody>
                    {scanException &&
                      scanException.length !== 0 &&
                      scanException.map((row) => {
                        return (
                          <TableRow hover key={row}>
                            <TableCell align="center">{row}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  handleDeleteScanException(row);
                                }}
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
          {currentTab !== 4 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
