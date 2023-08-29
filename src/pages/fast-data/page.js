import { useState, useEffect } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import { updateFastDataServices } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Switch,
  FormControlLabel,
  Stack,
} from "@mui/material";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import HttpOutlinedIcon from "@mui/icons-material/HttpOutlined";
import GridOnIcon from "@mui/icons-material/GridOn";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
export default function FastData() {
  const fastData = useSelector((state) => state?.services?.fastdata);

  const [ftpEnabled, setFTPEnabled] = useState(
    fastData?.industrial?.ftp?.enabled
  );

  const [httpEnabled, setHTTPEnabled] = useState(
    fastData?.industrial?.http?.enabled
  );

  const [matrixEnabled, setMatrixEnabled] = useState(
    fastData?.customer?.matrix?.enabled
  );

  const dispatch = useDispatch();

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const navigate = useNavigate();

  const handleClick = (name) => {
    navigate(`/fast-data/${name}`);
  };

  const handleFastDataServicesChange = () => {
    const newFastData = {
      ftp: ftpEnabled,
      http: httpEnabled,
      matrix: matrixEnabled,
    };
    dispatch(updateFastDataServices({ newFastData }));
  };

  const goodStatus = () => {
    return (
      <CheckCircleOutlineOutlinedIcon sx={{ color: "green", fontSize: 20 }} />
    );
  };
  const badStatus = () => {
    return <DangerousOutlinedIcon sx={{ color: "red", fontSize: 21 }} />;
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
                  md={4}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  <Card
                    sx={{ height: 200, width: 250 }}
                    className="menu-cards"
                    name="FTP"
                    onClick={() => handleClick("ftp")}
                  >
                    <DriveFileMoveOutlinedIcon sx={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        FTP
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Exchange data by FTP method
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
                    name="HTTP"
                    onClick={() => handleClick("http")}
                  >
                    <HttpOutlinedIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        HTTP
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Exchange data by HTTP method
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
                    onClick={() => handleClick("matrix")}
                  >
                    <GridOnIcon style={cardIcon} />
                    <CardContent sx={{ pt: 0 }} className="internal-menu-cards">
                      <Typography variant="h7" component="div">
                        Matrix
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ p: 1 }}
                      >
                        Exchange data by Matrix method
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
                  md={4}
                  style={{
                    textAlign: "center",
                    padding: "0px 20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 2 }}
                    style={{ overflowY: "auto" }}
                  >
                    <Grid item xs={6}>
                      <div>Enabled</div>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Switch checked={ftpEnabled} />}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <div>FTP Running</div>
                    </Grid>
                    <Grid item xs={6}>
                      {fastData?.industrial?.ftp?.running
                        ? goodStatus()
                        : badStatus()}
                    </Grid>
                  </Grid>
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
                  <Grid
                    container
                    rowSpacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 2 }}
                    style={{ overflowY: "auto" }}
                  >
                    <Grid item xs={6}>
                      <div>Enabled</div>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Switch checked={httpEnabled} />}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <div>HTTP Running</div>
                    </Grid>
                    <Grid item xs={6}>
                      {fastData?.industrial?.http?.running
                        ? goodStatus()
                        : badStatus()}
                    </Grid>
                  </Grid>
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
                  <Grid
                    container
                    rowSpacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 2 }}
                    style={{ overflowY: "auto" }}
                  >
                    <Grid item xs={6}>
                      <div>Enabled</div>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={<Switch checked={matrixEnabled} />}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <div>Matrix Running</div>
                    </Grid>
                    <Grid item xs={6}>
                      {fastData?.customer?.matrix?.running
                        ? goodStatus()
                        : badStatus()}
                    </Grid>
                  </Grid>
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
            <Outlet />
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
