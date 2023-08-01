import { useSelector, useDispatch } from "react-redux";
import { updateInternalPC } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import VerticalTab_2 from "../../components/VerticalTab/VerticalTab";
import {
  Grid,
  Card,
  CardContent,
  Container,
  FormControl,
  TextField,
  Divider,
  FormLabel,
} from "@mui/material";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Container sx={{ flexGrow: 1 }} disableGutters>
      <Card>
        <CardContent>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} wrap>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                margin: 10,
              }}
            >
              <h3>PCB</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Ready</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Network</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={8}
              style={{
                textAlign: "center",
                border: "1px inset white",
                margin: 10,
              }}
            >
              <FormControl fullWidth>
                <FormLabel>Hostname:</FormLabel>

                <TextField
                  type="text"
                  label="Hostname:"
                  helperText="a4GATE serial number S/N"
                  value={""}
                  required={true}
                  onChange={() => {}}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }} wrap>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                margin: 10,
              }}
            >
              <h3>Services</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Sitemanager</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Thingworx</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>OPCUA Server</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Http Server</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Fast Data</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              style={{
                textAlign: "center",
                border: "1px inset white",
                margin: 10,
              }}
            >
              <h3>Terafence</h3>
              <Divider />
              <Grid
                container
                rowSpacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>a4Monitor</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Back Channel</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Data Transfer</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Configuration Service</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>Broker</div>
                </Grid>
                <Grid item xs={6} style={{ padding: 0 }}>
                  <div style={{ padding: 5 }}>value</div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
