import { useState } from "react";
import { Container, Card, Divider, CardContent } from "@mui/material";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import BackButton from "../../components/BackButton/BackButton";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SecondaryNavbar from "../../components/SecondaryNavbar/SecondaryNavbar";

export default function Info() {
  const a4gateHelp = [
    "Dashboard Guide",
    "Change a4GATE Hostname",
    "Connect to machine network",
    "Connect to plant network",
    "Add a Static Route",
    "Use NTP custom server",
    "Test connection",
    "Create OPCUA IoT Gateway",
    "FTP Server configuration"
  ];
  const [currentTab, setCurrentTab] = useState(0);

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
              <Container>
                <div style={{ margin: "10px 0px" }}>
                  <h2 style={{ fontWeight: 800, fontSize: 30 }}>Info</h2>
                </div>
                <SecondaryNavbar
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  navbarItems={a4gateHelp}
                />
                <div
                  style={{
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: 10,
                  }}
                >
                   {currentTab === 0 && (
                    <iframe
                      src="/img/info/dashboard-guide.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to change hostname"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 1 && (
                    <iframe
                      src="/img/info/change-hostname.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to change hostname"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 2 && (
                    <iframe
                      src="/img/info/connect-to-machine-network.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to connect to machine network"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 3 && (
                    <iframe
                      src="/img/info/connect-to-plant-network.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to connect to machine network"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 4 && (
                    <iframe
                      src="/img/info/add-static-route.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to Add a Static Route"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 5 && (
                    <iframe
                      src="/img/info/ntp-settings.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to use NTP custom server"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 6 && (
                    <iframe
                      src="/img/info/test-connection.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to do Test connection"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 7 && (
                    <iframe
                      src="/img/info/create-opcua-gateway.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to create an OPCUA IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                   {currentTab === 8 && (
                    <iframe
                      src="/img/info/ftp-server.html"
                      height="500px"
                      width="900px"
                      allowFullScreen
                      title="How to create an OPCUA IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                </div>
              </Container>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
