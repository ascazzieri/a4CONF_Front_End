import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHostName, updateThingNames } from "../../utils/redux/reducers";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import JSONPretty from "react-json-pretty";
import { LoadingContext } from "../../utils/context/Loading";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import DoNotDisturbOnOutlinedIcon from "@mui/icons-material/DoNotDisturbOnOutlined";
import {
  machines_connected,
  monitor_logs_isWorking,
  monitor_a4monitor_status,
  is_B_ready,
  check_bidir,
} from "../../utils/api";
import {
  Grid,
  Card,
  CardContent,
  Container,
  FormControl,
  TextField,
  Divider,
  FormLabel,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function Dashboard() {
  const hostname = useSelector((state) => state?.system?.hostname);

  const pcb_is_connected = useSelector(
    (state) => state?.system?.network?.customer?.static
  );

  const plugins_status = useSelector((state) => state?.services);

  console.log(plugins_status);

  const dispatch = useDispatch();

  const location = useLocation();

  const loaderContext = useContext(LoadingContext);

  //const dashboardPage = currentURLArray.filter((item) => item === "dashboard");

  const [hostName, setHostName] = useState(hostname);
  const [dashboardStatus, setDashboardStatus] = useState({});

  /* if (Object.keys(dashboardStatus).length === 0) {
    loaderContext[1](true);
  } else {
    loaderContext[1](false);
  } */

  useEffect(() => {
    if (Object.keys(dashboardStatus).length === 0) {
      loaderContext[1](true); // Imposta lo stato di caricamento iniziale
    } else {
      loaderContext[1](false); // Non è più in fase di caricamento
    }
  }, [dashboardStatus, loaderContext]);

  const handleHostNameChange = () => {
    const newHostName = {
      customer: hostName?.customer,
      industrial: hostName?.industrial,
    };
    dispatch(updateHostName({ newHostName }));
  };

  const goodStatus = () => {
    return (
      <CheckCircleOutlineOutlinedIcon sx={{ color: "green", fontSize: 20 }} />
    );
  };
  const badStatus = () => {
    return <DangerousOutlinedIcon sx={{ color: "red", fontSize: 21 }} />;
  };

  const [count, setCount] = useState(0);
  const [isInDashboard, setIsInDashboard] = useState(false);

  useEffect(() => {
    let timer;

    if (isInDashboard) {
      timer = setInterval(async () => {
        const machinesConnected = await machines_connected();
        const monitorLogsIsWorking = await monitor_logs_isWorking();
        const a4monitorStatus = await monitor_a4monitor_status();
        const isBReady = await is_B_ready();
        const checkBidir = await check_bidir();
        setDashboardStatus((prevState) => ({
          ...prevState,
          is_B_ready: isBReady,
          bidir: checkBidir,
          monitor_terafence_status: monitorLogsIsWorking,
          a4monitor_status: a4monitorStatus,
          machines: machinesConnected,
        }));
        setCount((prevCount) => prevCount + 1);
      }, 5000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isInDashboard]);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setIsInDashboard(true);
    } else {
      setIsInDashboard(false);
    }
  }, [location.pathname]);

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1, mt: 0, pt: 0 }} disableGutters>
        <Card sx={{ flexGrow: 1, mt: 0, pt: 0 }}>
          <CardContent>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <FormLabel>a4GATE serial number:</FormLabel>

                    <TextField
                      type="text"
                      label="a4GATE hostname"
                      helperText="Write a4GATE serial number S/N"
                      className="a4gate-hostname-form"
                      value={
                        hostName?.industrial === hostName?.customer
                          ? hostName?.industrial
                          : "a4GATE hostname of PCA and PCB do not match. Please insert S/N as hostname and restart a4GATE"
                      }
                      required={true}
                      onChange={(event) => {
                        setHostName({
                          industrial: event?.target?.value,
                          customer: event?.target?.value,
                        });
                      }}
                    />
                  </FormControl>
                  <Button variant="contained" onClick={handleHostNameChange}>
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid container columns={{ xs: 4, sm: 12, md: 12 }}>
              <Grid
                item
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>a4GATE Status</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 2 }}
                  style={{ overflowY: "auto" }}
                >
                  <Grid item xs={6}>
                    <div>PCB Ready</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.is_B_ready?.ready
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>PCB Network</div>
                  </Grid>
                  <Grid item xs={6}>
                    {pcb_is_connected?.connected ? goodStatus() : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Bidirectionality</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.bidir !== undefined &&
                    !dashboardStatus?.bidir["a4GATE.U2U.BIDIR"] ? (
                      <DoNotDisturbOnOutlinedIcon
                        sx={{ color: "red", fontSize: 20 }}
                      />
                    ) : (
                      <div style={{ color: "green" }}>
                        {dashboardStatus?.bidir &&
                          dashboardStatus?.bidir["a4GATE.U2U.RT"]}
                      </div>
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Kepware</div>
                  </Grid>
                  <Grid item xs={6}>
                    {plugins_status?.kepware?.server_runtime ? goodStatus() : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>IoT Gateway</div>
                  </Grid>
                  <Grid item xs={6}>
                  {plugins_status?.kepware?.server_iotgateway ? goodStatus() : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Config API</div>
                  </Grid>
                  <Grid item xs={6}>
                  {plugins_status?.kepware?.config_api_service ? goodStatus() : badStatus()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Services</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 2 }}
                  style={{ overflowY: "auto" }}
                >
                  <Grid item xs={6}>
                    <div>a4Monitor</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.a4monitor_status?.status
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Back Channel</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.monitor_terafence_status?.tf_bchnld
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Data Transfer</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.monitor_terafence_status?.tf_http_xfer
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Configuration</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.monitor_terafence_status?.tf_cfgmng
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Broker</div>
                  </Grid>
                  <Grid item xs={6}>
                    {dashboardStatus?.monitor_terafence_status?.mosquitto
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Plugins</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 2 }}
                >
                  <Grid item xs={6}>
                    <div>Sitemanager</div>
                  </Grid>
                  <Grid item xs={6}>
                    {plugins_status?.sitemanager?.connected
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>Thingworx</div>
                  </Grid>
                  <Grid item xs={6}>
                    {plugins_status?.thingworx?.connected
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>OPCUA Server</div>
                  </Grid>
                  <Grid item xs={6}>
                    {plugins_status?.opcua?.running
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid item xs={6}>
                    <div>HTTP Server</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>value</div>
                  </Grid>
                  <Grid item xs={6}>
                    <div>Fast Data</div>
                  </Grid>
                  <Grid item xs={6}>
                    {plugins_status?.fastdata?.running
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "0px 20px",
                }}
              >
                <h3>Device Connected</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 2, maxHeight: 300, overflowY: "auto" }}
                >
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableBody>
                        {dashboardStatus?.machines &&
                          dashboardStatus?.machines.length !== 0 &&
                          dashboardStatus?.machines.map((item) => {
                            return (
                              <TableRow
                                hover
                                key={item.channel + item.device + Math.random()}
                              >
                                <TableCell align="center">
                                  {`${item?.channel}.${item?.device}`}
                                </TableCell>
                                <TableCell align="center">
                                  {item?.connected ? goodStatus() : badStatus()}
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
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
