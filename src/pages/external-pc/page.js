import { useState, useEffect } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import {
  updateExternalPC,
  updateSitemanagerEnable,
  updateThingworxEnable,
  updateOPCServerEnable,
  updateHTTPServerEnable,
} from "../../utils/redux/reducers";
import { JSONTree } from "react-json-tree";
import VerticalTab from "../../components/VerticalTab/VerticalTab";
import {
  Grid,
  Card,
  CardContent,
  Container,
  Typography,
  FormControlLabel,
  Box,
  Switch,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RouterIcon from "@mui/icons-material/Router";
import BackupIcon from "@mui/icons-material/Backup";
import PublicIcon from "@mui/icons-material/Public";
import ShareIcon from "@mui/icons-material/Share";
import HttpIcon from "@mui/icons-material/Http";

export default function ExternalPC() {
  const externalPCReboot = useSelector((state) => state?.system.reboot);
  const serviceStatus = useSelector((state) => state?.services);

  const [sitemanagerEnabled, setSitemanagerEnabled] = useState(
    serviceStatus?.sitemanager?.enabled
  );

  const [thingworxEnabled, setThingworxEnabled] = useState(
    serviceStatus?.thingworx?.enabled
  );

  const [opcuaServerEnabled, setOPCUAServerEnabled] = useState(
    serviceStatus?.opcua
  );

  const [httpServerEnabled, setHTTPServerEnabled] = useState(
    serviceStatus?.http?.enabled
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateSitemanagerEnable(sitemanagerEnabled));
  }, [sitemanagerEnabled, dispatch]);

  useEffect(() => {
    updateThingworxEnable(thingworxEnabled);
  }, [thingworxEnabled, dispatch]);

  useEffect(() => {
    updateOPCServerEnable(opcuaServerEnabled);
  }, [opcuaServerEnabled, dispatch]);

  useEffect(() => {
    updateHTTPServerEnable(httpServerEnabled);
  }, [httpServerEnabled, dispatch]);

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/external-pc/${name}`);
  };

  const handleExternalPCChange = () => {
    const newExternalPC = {
      reboot: false,
    };
    dispatch(updateExternalPC({ newExternalPC }));
  };

  const tabsData = [
    "Network",
    "Sitemanager",
    "Thingworx",
    "OPCUA-Server",
    "HTTP-Server",
  ];

  if (currentURLArray.length === 2) {
    const cardIcon = { fontSize: 80, color: "#0d6efd" };

    return (
      <ErrorCacher>
        <Container sx={{ flexGrow: 1 }} disableGutters>
          <Card sx={{ mt: 1 }}>
            <CardContent>
              <Grid container columns={{ xs: 4, sm: 12, md: 12 }}>
                <Grid
                  item
                  xs={2}
                  sm={6}
                  md={4}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="network"
                    onClick={() => handleClick("network")}
                  >
                    <PublicIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        Network
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Connect PCB to plant network
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={6}
                  md={4}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  {sitemanagerEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="sitemanager"
                      onClick={() => handleClick("sitemanager")}
                    >
                      <RouterIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
                        <Typography variant="h7" component="div">
                          Sitemanager
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ p: 1 }}
                        >
                          Configure remote assistance
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                      name="http-server"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={sitemanagerEnabled}
                              onChange={(event) => {
                                setSitemanagerEnabled(event?.target?.checked);
                              }}
                            />
                          }
                          label="Remote assistance disabled"
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={6}
                  md={4}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  {thingworxEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="thingworx"
                      onClick={() => handleClick("thingworx")}
                    >
                      <BackupIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
                        <Typography variant="h7" component="div">
                          Thingworx
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ p: 1 }}
                        >
                          Configure Sentinel communication
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                      name="http-server"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={thingworxEnabled}
                              onChange={(event) => {
                                setThingworxEnabled(event?.target?.checked);
                              }}
                            />
                          }
                          label="Thingworx agent disabled"
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
              <Grid container columns={{ xs: 4, sm: 12, md: 12 }}>
                <Grid
                  item
                  xs={2}
                  sm={6}
                  md={6}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  {opcuaServerEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="opcua-server"
                      onClick={() => handleClick("opcua-server")}
                    >
                      <ShareIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
                        <Typography variant="h7" component="div">
                          OPCUA Server
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ p: 1 }}
                        >
                          Expose data via OPCUA server
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                      name="http-server"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={opcuaServerEnabled}
                              onChange={(event) => {
                                setOPCUAServerEnabled(event?.target?.checked);
                              }}
                            />
                          }
                          label="OPCUA server disabled"
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={6}
                  md={6}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  {httpServerEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="http-server"
                      onClick={() => handleClick("http-server")}
                    >
                      <HttpIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
                        <Typography variant="h7" component="div">
                          HTTP Server
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ p: 1 }}
                        >
                          Expose data via HTTP server
                        </Typography>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                      name="http-server"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={httpServerEnabled}
                              onChange={(event) => {
                                setHTTPServerEnabled(event?.target?.checked);
                              }}
                            />
                          }
                          label="HTTP server disabled"
                          sx={{ verticalAlign: "middle" }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </ErrorCacher>
    );
  }

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Box
              sx={{
                flexGrow: 1,
                bgcolor: "background.paper",
                display: "flex",
                pb: 2,
              }}
            >
              <Outlet />
            </Box>
            {/* <VerticalTab tabsData={tabsData} root="external-pc">
              <Outlet />
            </VerticalTab> */}
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <JSONTree data={externalPCReboot} />
                <button onClick={handleExternalPCChange}>
                  Change External PC
                </button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent style={{ paddingBottom: 16 }}>
                {/* <VerticalTabs tabsData={tabsData} /> */}
                <h3>Qui ci metto altro</h3>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ErrorCacher>
  );
}
