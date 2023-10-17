import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateHostName, updateThingNames } from "../../utils/redux/reducers";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { LoadingContext } from "../../utils/context/Loading";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
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
  Stack,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Popover from "@mui/material/Popover";
import { useLocation } from "react-router-dom";
import { Typography } from "antd";
import {
  a4gate_status_desc,
  a4monitor_desc,
  back_channel_desc,
  bidir_desc,
  broker_desc,
  configuration_desc,
  data_sender_network_desc,
  data_sender_ready_desc,
  data_transfer_desc,
  device_connected_desc,
  fast_data_board_desc,
  host_name_desc,
  http_server_board_desc,
  kepserver_desc,
  opcua_server_board_desc,
  plugins_desc,
  sitemanager_board_desc,
  thingworx_board_desc,
  version_desc,
} from "../../utils/titles";

export default function Dashboard() {
  const system = useSelector((state) => state?.system);

  const pcb_is_connected = useSelector(
    (state) => state?.system?.network?.customer?.static
  );

  const plugins_status = useSelector((state) => state?.services);

  const dispatch = useDispatch();

  const location = useLocation();

  const loaderContext = useContext(LoadingContext);

  const snackBarContext = useContext(SnackbarContext);

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  //const dashboardPage = currentURLArray.filter((item) => item === "dashboard");

  const [hostName, setHostName] = useState(
    system?.hostname?.industrial === system?.hostname?.customer
      ? system?.hostname?.industrial
      : ""
  );
  const [dashboardStatus, setDashboardStatus] = useState({});
  useEffect(() => {
    setHostName(
      system?.hostname?.industrial === system?.hostname?.customer
        ? system?.hostname?.industrial
        : ""
    );
  }, [system]);
  useEffect(() => {
    if (dashboardStatus && Object.keys(dashboardStatus).length === 0) {
      loaderContext[1](true); // Imposta lo stato di caricamento iniziale
    } else {
      loaderContext[1](false); // Non è più in fase di caricamento
    }
  }, [dashboardStatus, loaderContext]);

  const handleHostNameChange = () => {
    const newHostName = {
      customer: hostName?.trim(),
      industrial: hostName?.trim(),
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
  let hostNameHelperText = "";

  if (!hostName) {
    hostNameHelperText = "Write a4GATE serial number S/N";
  } else if (hostName === "") {
    hostNameHelperText =
      "a4GATE hostname of Data Collector and Data Sender do not match. Please insert S/N as hostname and restart a4GATE";
  }
  const [isInDashboard, setIsInDashboard] = useState(false);
  const [kepwareAnchor, setKepwareAnchor] = useState(null);
  const [fastDataAnchor, setFastDataAnchor] = useState(null);
  const [versionWarningAnchor, setVersionWarningAnchor] = useState(null);

  if (system?.u2u?.firmware?.check === false) {
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "error",
      message: `U2U firmare version is not compatible! Please contact a4GATE support`,
    });
  }

  const handleOpenKepware = (event) => {
    setKepwareAnchor(event.currentTarget);
  };
  const handleOpenFastData = (event) => {
    setFastDataAnchor(event.currentTarget);
  };
  const handleOpenVersionWarning = (event) => {
    setVersionWarningAnchor(event.currentTarget);
  };

  const handleKepwareClose = () => {
    setKepwareAnchor(null);
  };
  const handleFastDataClose = () => {
    setFastDataAnchor(null);
  };
  const handleCloseVersionWarning = (event) => {
    setVersionWarningAnchor(null);
  };

  const kepwareOpen = Boolean(kepwareAnchor);
  const fastDataOpen = Boolean(fastDataAnchor);
  const versionWarningOpen = Boolean(versionWarningAnchor);

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
      }, 10000);
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
            <Grid container>
              <Grid
                xs={12}
                sm={12}
                md={12}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                  padding: "5px 20px",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={2}
                >
                  <FormControl fullWidth>
                    <FormLabel title={host_name_desc}>
                      a4GATE serial number:
                    </FormLabel>

                    <TextField
                      title={host_name_desc}
                      type="text"
                      label="a4GATE hostname"
                      helperText={hostNameHelperText}
                      className="a4gate-hostname-form"
                      value={hostName || ""}
                      required={true}
                      onChange={(event) => {
                        setHostName(event?.target?.value);
                      }}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={handleHostNameChange}
                    style={{ marginTop: 20 }}
                  >
                    Save
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                xs={2}
                sm={12}
                md={6}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                }}
              >
                <h3 title={a4gate_status_desc}>a4GATE Status</h3>
                <Divider />

                <Grid container style={{ overflowY: "auto" }}>
                  <Grid container md={6}>
                    <Grid xs={6} sx={{ p: 1 }}>
                      <div title={data_sender_ready_desc}>
                        Data Sender ready
                      </div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.is_B_ready?.ready
                        ? goodStatus()
                        : badStatus()}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1 }}>
                      <div title={data_sender_network_desc}>
                        Data Sender network
                      </div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {pcb_is_connected?.connected ? goodStatus() : badStatus()}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1 }}>
                      <div title={bidir_desc}>Bidir.</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1 }}>
                      {dashboardStatus?.bidir !== undefined &&
                      dashboardStatus?.bidir !== null ? (
                        dashboardStatus?.bidir["a4GATE_U2U_BIDIR"] ? (
                          <>
                            <div style={{ color: "green" }}>
                              {dashboardStatus?.bidir &&
                                dashboardStatus?.bidir["a4GATE_U2U_RT"]}
                            </div>
                          </>
                        ) : (
                          <div style={{ color: "red" }}>Closed</div>
                        )
                      ) : (
                        "..."
                      )}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1 }}>
                      <Button
                        sx={{ mb: 1, mt: 0 }}
                        variant="contained"
                        onClick={handleOpenKepware}
                        title={kepserver_desc}
                      >
                        KepServer
                      </Button>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {plugins_status?.kepware?.server_runtime &&
                      plugins_status?.kepware?.server_iotgateway &&
                      plugins_status?.kepware?.config_api_service
                        ? goodStatus()
                        : badStatus()}
                    </Grid>
                    <Popover
                      open={kepwareOpen}
                      anchorEl={kepwareAnchor}
                      onClose={handleKepwareClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <Grid
                        container
                        rowSpacing={3}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ p: 2, pb: 0 }}
                      >
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          <div>Kepware Runtime</div>
                        </Grid>
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          {plugins_status?.kepware?.server_runtime !== undefined
                            ? plugins_status?.kepware?.server_runtime
                              ? goodStatus()
                              : badStatus()
                            : "..."}
                        </Grid>
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          <div>IoT Gateway</div>
                        </Grid>
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          {plugins_status?.kepware?.server_iotgateway !==
                          undefined
                            ? plugins_status?.kepware?.server_iotgateway
                              ? goodStatus()
                              : badStatus()
                            : "..."}
                        </Grid>
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          <div>Config API</div>
                        </Grid>
                        <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                          {plugins_status?.kepware?.config_api_service !==
                          undefined
                            ? plugins_status?.kepware?.config_api_service
                              ? goodStatus()
                              : badStatus()
                            : "..."}
                        </Grid>
                      </Grid>
                    </Popover>
                    <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                      <div style={{ marginBottom: 5 }} title={version_desc}>
                        Version:
                      </div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1 }}>
                      {system?.a4updater_version?.industrial == null ||
                      system?.a4updater_version?.customer == null ? (
                        "..."
                      ) : system?.a4updater_version?.industrial ===
                        system?.a4updater_version?.customer ? (
                        system?.a4updater_version?.industrial
                      ) : (
                        <>
                          <Button
                            sx={{ mb: 1, mt: 0 }}
                            variant="contained"
                            color="error"
                            onClick={handleOpenVersionWarning}
                          >
                            Error!
                          </Button>
                        </>
                      )}
                    </Grid>
                    <Popover
                      open={versionWarningOpen}
                      anchorEl={versionWarningAnchor}
                      onClose={handleCloseVersionWarning}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      <div style={{ padding: 10, textAlign: "center" }}>
                        <Typography style={{ color: "white" }}>
                          The software version of Internal PC and External PC do
                          not match!
                        </Typography>
                      </div>
                    </Popover>
                  </Grid>
                  <Grid container md={6}>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      <div title={a4monitor_desc}>a4Monitor</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.a4monitor_status !== null &&
                      dashboardStatus?.a4monitor_status !== undefined
                        ? dashboardStatus?.a4monitor_status === true
                          ? goodStatus()
                          : badStatus()
                        : "..."}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      <div title={back_channel_desc}>Back Channel</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.monitor_terafence_status?.tf_bchnld !==
                        null &&
                      dashboardStatus?.monitor_terafence_status?.tf_bchnld !==
                        undefined
                        ? dashboardStatus?.monitor_terafence_status
                            ?.tf_bchnld === true
                          ? goodStatus()
                          : badStatus()
                        : "..."}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      <div title={data_transfer_desc}>Data Transfer</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.monitor_terafence_status
                        ?.tf_http_xfer !== null &&
                      dashboardStatus?.monitor_terafence_status
                        ?.tf_http_xfer !== undefined
                        ? dashboardStatus?.monitor_terafence_status
                            ?.tf_http_xfer === true
                          ? goodStatus()
                          : badStatus()
                        : "..."}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      <div title={configuration_desc}>Configuration</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.monitor_terafence_status?.tf_cfgmng !==
                        null &&
                      dashboardStatus?.monitor_terafence_status?.tf_cfgmng !==
                        undefined
                        ? dashboardStatus?.monitor_terafence_status
                            ?.tf_cfgmng === true
                          ? goodStatus()
                          : badStatus()
                        : "..."}
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      <div title={broker_desc}>Broker</div>
                    </Grid>
                    <Grid xs={6} sx={{ p: 1.5 }}>
                      {dashboardStatus?.monitor_terafence_status?.mosquitto !==
                        null &&
                      dashboardStatus?.monitor_terafence_status?.mosquitto !==
                        undefined
                        ? dashboardStatus?.monitor_terafence_status
                            ?.mosquitto === true
                          ? goodStatus()
                          : badStatus()
                        : "..."}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                }}
              >
                <h3 title={plugins_desc}>Plugins</h3>
                <Divider />
                <Grid container style={{ overflowY: "auto" }}>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <div title={sitemanager_board_desc}>Sitemanager</div>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    {plugins_status?.sitemanager?.connected
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <div title={thingworx_board_desc}>Thingworx</div>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    {plugins_status?.thingworx?.connected
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <div title={opcua_server_board_desc}>OPCUA Server</div>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    {plugins_status?.opcua?.running
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <div title={http_server_board_desc}>HTTP Server</div>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <div>value</div>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    <Button
                      title={fast_data_board_desc}
                      variant="contained"
                      sx={{ mb: 1, mt: 0 }}
                      onClick={handleOpenFastData}
                    >
                      Fast Data
                    </Button>
                  </Grid>
                  <Grid xs={6} sx={{ p: 1.5 }}>
                    {plugins_status?.fastdata?.running
                      ? goodStatus()
                      : badStatus()}
                  </Grid>
                  <Popover
                    open={fastDataOpen}
                    anchorEl={fastDataAnchor}
                    onClose={handleFastDataClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Grid
                      container
                      rowSpacing={3}
                      justifyContent="center"
                      alignItems="center"
                      sx={{ p: 2, pb: 0 }}
                    >
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        <div>Fast Data FTP</div>
                      </Grid>
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        {plugins_status?.fastdata?.industrial?.ftp?.running
                          ? goodStatus()
                          : badStatus()}
                      </Grid>
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        <div>Fast Data HTTP</div>
                      </Grid>
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        {plugins_status?.fastdata?.industrial?.http?.running
                          ? goodStatus()
                          : badStatus()}
                      </Grid>
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        <div>Fast Data Matrix</div>
                      </Grid>
                      <Grid xs={6} sx={{ p: 1, textAlign: "center" }}>
                        {plugins_status?.fastdata?.customer?.matrix?.running
                          ? goodStatus()
                          : badStatus()}
                      </Grid>
                    </Grid>
                  </Popover>
                </Grid>
              </Grid>
              <Grid
                xs={2}
                sm={6}
                md={3}
                style={{
                  textAlign: "center",
                  border: "1px inset white",
                }}
              >
                <h3 title={device_connected_desc}>Connected Device</h3>
                <Divider />
                <Grid
                  container
                  rowSpacing={2}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ maxHeight: 300, overflowY: "auto", overflowX: "auto" }}
                >
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                      <TableBody>
                        {dashboardStatus?.machines &&
                          dashboardStatus?.machines?.length !== 0 &&
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
