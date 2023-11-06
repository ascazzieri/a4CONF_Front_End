import { useState, useEffect, useContext } from "react";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { useSelector, useDispatch } from "react-redux";
import { updateFastData } from "../../utils/redux/reducers";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import ServiceHandler from "../../components/ServiceHandler/ServiceHandler";
import ServiceDisabler from "../../components/ServiceDisabler/ServiceDisabler";
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
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import DriveFileMoveOutlinedIcon from "@mui/icons-material/DriveFileMoveOutlined";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import HttpOutlinedIcon from "@mui/icons-material/HttpOutlined";
import GridOnIcon from "@mui/icons-material/GridOn";
import { SuperUserContext } from "../../utils/context/SuperUser";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SaveButton from "../../components/SaveButton/SaveButton";
import { fast_blob_url_desc, fast_sas_desc } from "../../utils/titles";
export default function FastData() {
  const fastdata = useSelector((state) => state?.services?.fastdata);

  const dispatch = useDispatch();
  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const navigate = useNavigate();

  const superUser = useContext(SuperUserContext);

  const [ftpEnabled, setFTPEnabled] = useState(
    fastdata?.industrial?.ftp?.enabled
  );

  const [httpEnabled, setHTTPEnabled] = useState(
    fastdata?.industrial?.http?.enabled
  );

  const [matrixEnabled, setMatrixEnabled] = useState(
    fastdata?.customer?.matrix?.enabled
  );

  const [blobConnectionUrl, setBlobConnectionUrl] = useState(
    fastdata?.customer?.blob_connection?.azure_url
  );
  const [blobConnectionSas, setBlobConnectionSas] = useState(
    fastdata?.customer?.blob_connection?.azure_sas
  );

  const [showSaskey, setShowSaskey] = useState(false);
  const handleClickShowSas = () => setShowSaskey((show) => !show);
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  useEffect(() => {
    setFTPEnabled(fastdata?.industrial?.ftp?.enabled);
    setHTTPEnabled(fastdata?.industrial?.http?.enabled);
    setMatrixEnabled(fastdata?.customer?.matrix?.enabled);
    setBlobConnectionUrl(fastdata?.customer?.blob_connection?.azure_url);
    setBlobConnectionSas(fastdata?.customer?.blob_connection?.azure_sas);
  }, [fastdata]);

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

  const handleBlobConnectionChange = (e) => {
    e.preventDefault();
    const newBlobConnection = {
      ...fastdata?.customer,
      blob_connection: {
        azure_url: blobConnectionUrl,
        azure_sas: blobConnectionSas,
      },
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Fast data configuration save correctly`,
    });
    dispatch(updateFastData({ customer: newBlobConnection }));
  };

  if (currentURLArray.length === 2) {
    const cardIcon = { fontSize: 80, color: "#0d6efd" };

    return (
      <ErrorCacher>
        <Container sx={{ flexGrow: 1 }} disableGutters>
          <Card sx={{ mt: 1 }} className="fast-data-card">
            <CardContent>
              <form onSubmit={handleBlobConnectionChange}>
                <FormControl fullWidth>
                  <FormLabel title={fast_blob_url_desc}>
                    Blob storage Url:
                  </FormLabel>

                  <TextField
                    title={fast_blob_url_desc}
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
                  <InputLabel
                    htmlFor="outlined-adornment-password"
                    title={fast_sas_desc}
                  >
                    Sas *
                  </InputLabel>
                  <OutlinedInput
                    title={fast_sas_desc}
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
                {fastdata?.enabled && (
                  <>
                    <Grid
                      container
                      columns={{ xs: 4, sm: 12, md: 12 }}
                      sx={{ mt: 1 }}
                    >
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
                              <Typography>
                                Fast Data FTP service disabled
                              </Typography>
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
                              <Typography>
                                Fast Data HTTP service disabled
                              </Typography>
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
                          superUser[0] ? (
                            <Card
                              sx={{ height: 200, width: 250 }}
                              className="menu-cards"
                              name="matrix"
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
                              name="matrix"
                            >
                              <DoDisturbIcon
                                style={{ fontSize: 80, color: "red" }}
                              />
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
                                  Matrix is available only for admin
                                </Typography>
                              </CardContent>
                            </Card>
                          )
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
                    <Divider />
                  </>
                )}

                <SaveButton />
              </form>
            </CardContent>
          </Card>
          <Grid container spacing={2}>
            <Grid item xs={5} sx={{ display: "flex" }}>
              <Card
                sx={{ width: "100%", height: 100, overflow: "auto", pl: 1 }}
              >
                <CardContent>
                  <ServiceDisabler />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={7} sx={{ display: "flex" }}>
              <Card
                sx={{ width: "100%", height: 100, overflow: "auto", pl: 1 }}
              >
                <CardContent>
                  <ServiceHandler />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%", height: 100, overflow: "auto", pl: 1 }}>
              <CardContent>
                <ServiceDisabler />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8} sx={{ display: "flex" }}>
            <Card sx={{ width: "100%", height: 100, overflow: "auto", pl: 1 }}>
              <CardContent>
                <ServiceHandler />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ErrorCacher>
  );
}
