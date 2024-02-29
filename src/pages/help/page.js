import { useState, useContext } from "react";
import { Container, Card, Divider, CardContent } from "@mui/material";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import Box from "@mui/material/Box";
import SecondaryNavbar from "../../components/SecondaryNavbar/SecondaryNavbar";
import { SuperUserContext } from "../../utils/context/SuperUser";

export default function Help() {
  const a4gateHelp = [
    "Dashboard Guide",
    "Update Hostname",
    "Data Collector Network Guide",
    "Kepware Guide",
    "Create Thingworx IoT Gateway",
    "Create OPCUA IoT Gateway",
    "Create HTTP IoT Gateway",
    "Create Matrix IoT Gateway",
    "Data Sender Network Guide",
    "Sitemanager Guide",
    "Thingworx Guide",
    "HTTP Server Guide",
    "OPCUA Server Guide",
    "Fast-Data FTP Guide",
    "Fast-Data HTTP Guide",
    "Reload functions"
  ];
  const adminHelp = [
    "Fast-Data Matrix Guide",
    "Advanced Guide",
    "Manage Users",
    "Back-Channel Guide",
    "Archive Guide",
    "Network Scan Exception",
    "Kepware Advanced Operations"
  ];

  const [currentTab, setCurrentTab] = useState(0);

  const [currentAdminTab, setCurrentAdminTab] = useState(0);

  const superUser = useContext(SuperUserContext);

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
                  <h2 style={{ fontWeight: 800, fontSize: 30 }}>Help</h2>
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
                      src="/img/info/DashboardGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Dashboard Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 1 && (
                    <iframe
                      src="/img/info/UpdateA4GATEHostname.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Update Hostname"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}    
                  {currentTab === 2 && (
                    <iframe
                      src="/img/info/DataCollectorNetworkGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Data Collector Network Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 3 && (
                    <iframe
                      src="/img/info/KepwareGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Kepware Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 4 && (
                    <iframe
                      src="/img/info/CreateThingworxIoTGateway.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Create Thingworx IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 5 && (
                    <iframe
                      src="/img/info/CreateOPCUAIoTGateway.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Create OPCUA IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 6 && (
                    <iframe
                      src="/img/info/CreateHTTPIoTGateway.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Create HTTP IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 7 && (
                    <iframe
                      src="/img/info/CreateMatrixIoTGateway.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Create Matrix IoT Gateway"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 8 && (
                    <iframe
                      src="/img/info/DataSenderNetworkGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Data Sender Network Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 9 && (
                    <iframe
                      src="/img/info/SitemanagerGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Sitemanager Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 10 && (
                    <iframe
                      src="/img/info/ThingworxGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Thingworx Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 11 && (
                    <iframe
                      src="/img/info/HTTPServerGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="HTTP Server Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 12 && (
                    <iframe
                      src="/img/info/OPCUADataSenderGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="OPCUA Server Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 13 && (
                    <iframe
                      src="/img/info/Fast-DataFTPGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="FTP Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 14 && (
                    <iframe
                      src="/img/info/Fast-DataHTTPGuide.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="Fast-Data HTTP Guide"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                  {currentTab === 15 && (
                    <iframe
                      src="/img/info/ReloadFunctions.html"
                      height="800px"
                      width="900px"
                      allowFullScreen
                      title="'...' functions"
                      style={{ overflowY: "scroll" }}
                    ></iframe>
                  )}
                </div>

                {superUser[0] && (
                  <>
                  <h3 style={{ fontWeight: 800, fontSize: 20 }}>Admin section</h3>

                    <SecondaryNavbar
                      currentTab={currentAdminTab}
                      setCurrentTab={setCurrentAdminTab}
                      navbarItems={adminHelp}
                    />
                    <div
                      style={{
                        backgroundColor: "white",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: 10,
                      }}
                    >
                      {currentAdminTab === 0 && (
                        <iframe
                          src="/img/info/Fast-DataMatrixGuide.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Matrix Guide"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                      {currentAdminTab === 1 && (
                        <iframe
                          src="/img/info/AdvancedGuide.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Advanced Guide"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                       {currentAdminTab === 2 && (
                        <iframe
                          src="/img/info/ManageUsersGuide.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Manage Users"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                       {currentAdminTab === 3 && (
                        <iframe
                          src="/img/info/Back-ChannelGuide.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Back-Channel Guide"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                       {currentAdminTab === 4 && (
                        <iframe
                          src="/img/info/ArchiveGuide.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Archive Guide"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                      {currentAdminTab === 5 && (
                        <iframe
                          src="/img/info/NetworkScanException.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Network Scan Exception"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                      {currentAdminTab === 6 && (
                        <iframe
                          src="/img/info/KepwareAdvancedOperations.html"
                          height="800px"
                          width="900px"
                          allowFullScreen
                          title="Kepware Advanced Operations"
                          style={{ overflowY: "scroll" }}
                        ></iframe>
                      )}
                    </div>
                  </>
                )}
              </Container>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
