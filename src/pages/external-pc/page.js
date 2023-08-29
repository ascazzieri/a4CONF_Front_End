import { useState, useEffect } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import { updateExternalPC } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import VerticalTab from "../../components/VerticalTab/VerticalTab";
import {
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import RouterIcon from "@mui/icons-material/Router";
import BackupIcon from "@mui/icons-material/Backup";
import PublicIcon from "@mui/icons-material/Public";
import ShareIcon from "@mui/icons-material/Share";
import HttpIcon from "@mui/icons-material/Http";

export default function ExternalPC() {
  const externalPCReboot = useSelector((state) => state?.system.reboot);

  const dispatch = useDispatch();

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
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="sitemanager"
                    onClick={() => handleClick("sitemanager")}
                  >
                    <RouterIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        Remote Assistance
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
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="thingworx"
                    onClick={() => handleClick("thingworx")}
                  >
                    <BackupIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
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
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="opcua-server"
                    onClick={() => handleClick("opcua-server")}
                  >
                    <ShareIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
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
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="http-server"
                    onClick={() => handleClick("http-server")}
                  >
                    <HttpIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {/*           <Grid container spacing={2}>
            <Grid item xs={4} sx={{ display: "flex" }}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <JSONPretty data={externalOnly} />
                  <button onClick={handleExternalPCChange}>
                    Change External PC
                  </button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={8} sx={{ display: "flex" }}>
              <Card sx={{ width: "100%" }}>
                <CardContent style={{ paddingBottom: 16 }}>
                  <VerticalTabs tabsData={tabsData} />
                  <h3>Qui ci metto altro</h3>
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}
        </Container>
      </ErrorCacher>
    );
  }

  return (
    <ErrorCacher>
      <Container sx={{ flexGrow: 1 }} disableGutters>
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <VerticalTab tabsData={tabsData} root="external-pc">
              <Outlet />
            </VerticalTab>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <JSONPretty data={externalPCReboot} />
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
