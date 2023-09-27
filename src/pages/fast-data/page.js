import { useState, useEffect } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import { updateFastData } from "../../utils/redux/reducers";
import JSONPretty from "react-json-pretty";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Switch,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  Divider,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import HttpOutlinedIcon from "@mui/icons-material/HttpOutlined";
import GridOnIcon from "@mui/icons-material/GridOn";
import DangerousOutlinedIcon from "@mui/icons-material/DangerousOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SaveButton from "../../components/SaveButton/SaveButton";
export default function FastData() {
  const fastData = useSelector((state) => state?.services?.fastdata);

  const matrix = useSelector(
    (state) => state.services?.fastdata?.customer?.matrix
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const navigate = useNavigate();

  const [ftpEnabled, setFTPEnabled] = useState(
    fastData?.industrial?.ftp?.enabled
  );

  const [httpEnabled, setHTTPEnabled] = useState(
    fastData?.industrial?.http?.enabled
  );

  const [matrixEnabled, setMatrixEnabled] = useState(
    fastData?.customer?.matrix?.enabled
  );

  const [blobConnectionUrl, setBlobConnectionUrl] = useState(
    matrix?.blob_connection?.azure_url
  );
  const [blobConnectionSas, setBlobConnectionSas] = useState(
    matrix?.blob_connection?.azure_sas
  );

  const [showSaskey, setShowSaskey] = useState(false);
  const handleClickShowSas = () => setShowSaskey((show) => !show);

  useEffect(() => {
    setFTPEnabled(fastData?.industrial?.ftp?.enabled);
    setHTTPEnabled(fastData?.industrial?.http?.enabled);
    setMatrixEnabled(fastData?.customer?.matrix?.enabled);
  }, [fastData]);

  useEffect(() => {
    setBlobConnectionUrl(matrix?.blob_connection?.azure_url);
    setBlobConnectionSas(matrix?.blob_connection?.azure_sas);
  }, [matrix]);

  useEffect(() => {
    dispatch(updateFastData({ industrial: { ftp: { enabled: ftpEnabled } } }));
  }, [ftpEnabled, dispatch]);

  useEffect(() => {
    dispatch(
      updateFastData({ industrial: { http: { enabled: httpEnabled } } })
    );
  }, [httpEnabled, dispatch]);

  useEffect(() => {
    dispatch(
      updateFastData({ customer: { matrix: { enabled: matrixEnabled } } })
    );
  }, [matrixEnabled, dispatch]);

  const handleClick = (name) => {
    navigate(`/fast-data/${name}`);
  };

  const handleBlobConnectionUrlChange = (event) => {
    const blobUrl = event?.target?.value;
    if (blobUrl !== undefined) {
      setBlobConnectionUrl(blobUrl);
    }
  };

  const handleBlobConnectionSasChange = (event) => {
    const blobSas = event?.target?.value;
    if (blobSas !== undefined) {
      setBlobConnectionSas(blobSas);
    }
  };

  const handleMatrixChange = (e) => {
    e.preventDefault();
    const newMatrix = {
      ...matrix,
      blob_connection: {
        azure_url: blobConnectionUrl,
        azure_sas: blobConnectionSas,
      },
    };

    dispatch(updateFastData({ customer: { matrix: newMatrix } }));
  };

  if (currentURLArray.length === 2) {
    const cardIcon = { fontSize: 80, color: "#0d6efd" };

    return (
      <ErrorCacher>
        <Container sx={{ flexGrow: 1 }} disableGutters>
          <Card sx={{ mt: 1 }} className="fast-data-card">
            <CardContent>
              <form onSubmit={handleMatrixChange}>
                <FormControl fullWidth>
                  <FormLabel>Blob storage Url:</FormLabel>

                  <TextField
                    type="text"
                    label="Blob Url"
                    helperText="Blob storage Url"
                    value={blobConnectionUrl || ""}
                    required={true}
                    onChange={handleBlobConnectionUrlChange}
                  />
                </FormControl>

                <Divider />

                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-password">
                    Sas *
                  </InputLabel>
                  <OutlinedInput
                    type={showSaskey ? "text" : "password"}
                    required={true}
                    value={blobConnectionSas || ""}
                    onChange={handleBlobConnectionSasChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onMouseDown={handleClickShowSas}
                          onMouseUp={handleClickShowSas}
                          edge="end"
                        >
                          {showSaskey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  <FormHelperText id="outlined-weight-helper-text">
                    Unique athentication string for Microsoft Blob Storage
                  </FormHelperText>
                </FormControl>

                <Divider />
                <SaveButton />
              </form>

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
                  {ftpEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="FTP"
                      onClick={() => handleClick("ftp")}
                    >
                      <DriveFileMoveOutlinedIcon sx={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
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
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <Switch
                          checked={ftpEnabled}
                          onChange={(event) => {
                            setFTPEnabled(event?.target?.checked);
                          }}
                        />
                        <Typography>Fast Data FTP service disabled</Typography>
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
                  {httpEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="HTTP"
                      onClick={() => handleClick("http")}
                    >
                      <HttpOutlinedIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
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
                  ) : (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards-disabled"
                    >
                      <CardContent
                        sx={{ mt: 6.5 }}
                        className="internal-menu-cards"
                      >
                        <Switch
                          checked={httpEnabled}
                          onChange={(event) => {
                            setHTTPEnabled(event?.target?.checked);
                          }}
                        />
                        <Typography>Fast Data HTTP service disabled</Typography>
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
                  {matrixEnabled ? (
                    <Card
                      sx={{ height: 200, width: 250 }}
                      className="menu-cards"
                      name="thingworx"
                      onClick={() => handleClick("matrix")}
                    >
                      <GridOnIcon style={cardIcon} />
                      <CardContent
                        sx={{ pt: 0 }}
                        className="internal-menu-cards"
                      >
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
                        <Switch
                          checked={matrixEnabled}
                          onChange={(event) => {
                            setMatrixEnabled(event?.target?.checked);
                          }}
                        />
                        <Typography>
                          Fast Data Matrix service disabled
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
              {/* o vi */}
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
          </CardContent>
        </Card>
      </Container>
    </ErrorCacher>
  );
}
