import { useSelector, useDispatch } from "react-redux";
import { updateInternalPC } from "../../utils/redux/reducers";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import JSONPretty from "react-json-pretty";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Container,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CableIcon from "@mui/icons-material/Cable";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ServiceHandler from "../../components/ServiceHandler/ServiceHandler";

export default function InternalPC() {
  const internalPC = useSelector((state) => state?.system);

  let onlyInternalPC = Object.keys(internalPC)
    .filter(
      (key) => key !== "network" && key !== "hostname" && key !== "reboot"
    )
    .reduce((obj, key) => {
      obj[key] = internalPC[key];
      return obj;
    }, {});
  const dispatch = useDispatch();

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/internal-pc/${name}`);
  };

  const handleInternalPCChange = () => {
    const newInternalPC = {
      onlyinternal: true,
      toProduction: true,
    };
    dispatch(updateInternalPC({ newInternalPC }));
  };

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
                  md={6}
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
                    onLoad={() => console.log("loaded")}
                  >
                    <CableIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        Network
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Connect PCA to machine network
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
                    onClick={() => handleClick("kepware")}
                  >
                    <CompareArrowsIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        Kepware
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Set-up machine communication
                      </Typography>
                    </CardContent>
                  </Card>
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
            {/* <VerticalTab tabsData={tabsData} root="internal-pc">
              <Outlet />
            </VerticalTab> */}
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent>
                <JSONPretty data={onlyInternalPC} />
                <button onClick={handleInternalPCChange}>
                  Change External PC
                </button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%" }}>
              <CardContent style={{ paddingBottom: 16 }}>
                {/* <VerticalTabs tabsData={tabsData} /> */}
                <ServiceHandler />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ErrorCacher>
  );
}
