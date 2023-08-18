import { useState, useEffect } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import { updateExternalPC } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import VerticalTab from "../../components/VerticalTab/VerticalTab";
import { Grid, Box, Card, CardContent, Container } from "@mui/material";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function ExternalPC() {
  const externalPC = useSelector((state) => state);

  let externalOnly = { reboot: externalPC?.system.reboot };

  const dispatch = useDispatch();

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

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
    return (
      <ErrorCacher>
        <div>
          <h2>Lista di elementi:</h2>
          <ul>
            <li>
              <Link to="/external-pc/network">Network</Link>
            </li>
            <li>
              <Link to="/external-pc/sitemanager">Sitemanager</Link>
            </li>
            <li>
              <Link to="/external-pc/thingworx">Thingworx</Link>
            </li>
            <li>
              <Link to="/external-pc/opcua-server">OPCUA Server</Link>
            </li>
            <li>
              <Link to="/external-pc/http-server">HTTP Server</Link>
            </li>
          </ul>
        </div>
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
