import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { updateAll } from "../../utils/redux/reducers";
import _ from "lodash";
import {
  get_advanced,
  add_recovery_ip,
  remove_recovery_ip,
  reboot_PCA,
} from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import JsonEditorComponent from "../../components/JsonEditor/JsonEditor";
import { useSelector, useDispatch } from "react-redux";
import { JSONTree } from "react-json-tree";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Divider,
  Stack,
  Button,
  Box,
  TextField,
  FormLabel,
} from "@mui/material";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import SecondaryNavbar from "../../components/SecondaryNavbar/SecondaryNavbar";
import { getQueuePending } from "../../utils/utils";

export default function Advanced() {
  const loaderContext = useContext(LoadingContext);

  const config = useSelector((state) => state);

  const dispatch = useDispatch();
  const [jsonData, setJsonData] = useState(config);

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = ["Configuration", "Terafence", "Recovery IP", "More"];

  const [dangerousMode, setDangerousMode] = useState(false);

  const [serviceCommandA4monitor, setServiceCommandA4monitor] = useState("");
  const [serviceCommandBchnld, setServiceCommandBchnld] = useState("");
  const [serviceCommandDataTranfer, setServiceCommandDataTransfer] =
    useState("");
  const [serviceCommandConfiguration, setServiceCommandConfiguration] =
    useState("");
  const [serviceCommandBroker, setServiceCommandBroker] = useState("");

  useEffect(() => {
    setJsonData(config);
  }, [config]);

  const manageService = async (service, cmd) => {
    loaderContext[1](true);
    const tf_service = service?.replace("a4monitor", "a4monitor_tf");
    try {
      const response = await get_advanced(tf_service, cmd);
      if (response) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `${cmd?.toUpperCase()} ${service} service correctly`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on service command`,
        });
      }
    } catch (error) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleChangeA4monitor = (event) => {
    try {
      const command = event.target.value;
      const serviceName = event.target.name;
      setServiceCommandA4monitor(command);
      manageService(serviceName, command);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      setServiceCommandA4monitor(undefined);
    }
  };
  const handleChangeBchnld = (event) => {
    try {
      const command = event.target.value;
      const serviceName = event.target.name;
      setServiceCommandBchnld(command);
      manageService(serviceName, command);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      setServiceCommandBchnld(undefined);
    }
  };
  const handleChangeDataTranfer = (event) => {
    try {
      const command = event.target.value;
      const serviceName = event.target.name;
      setServiceCommandDataTransfer(command);
      manageService(serviceName, command);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      setServiceCommandDataTransfer(undefined);
    }
  };
  const handleChangeConfiguration = (event) => {
    try {
      const command = event.target.value;
      const serviceName = event.target.name;
      setServiceCommandConfiguration(command);
      manageService(serviceName, command);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      setServiceCommandConfiguration(undefined);
    }
  };
  const handleChangeBroker = (event) => {
    try {
      const command = event.target.value;
      const serviceName = event.target.name;
      setServiceCommandBroker(command);
      manageService(serviceName, command);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on service command`,
      });
    } finally {
      setServiceCommandBroker(undefined);
    }
  };

  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const [dataColletorIP, setDataColletorIP] = useState("");

  const handleAddRecoveryIP = async () => {
    try {
      loaderContext[1](true);
      const response = await add_recovery_ip();

      if (response) {
        setDataColletorIP("198.51.100.1");
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Recovery IP added correctly`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to add recovery ip`,
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to add recovery ip`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };
  const handleRemoveRecoveryIP = async () => {
    try {
      loaderContext[1](true);
      const response = await remove_recovery_ip();
      if (response) {
        setDataColletorIP();
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Recovery IP removed correctly`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to remove recovery ip`,
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to remove recovery ip`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleRebootPCA = async () => {
    try {
      loaderContext[1](true);
      const response = await reboot_PCA();
      if (response) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Data Collector will reboot soon`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to reboot data collector`,
        });
      }
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to reboot data collector`,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };
  const handleChangeDangerous = () => {
    if (jsonData) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Local configuration has been changed correctly`,
      });
      dispatch(
        updateAll({ payload: jsonData, meta: { actionType: "fromBackup" } })
      );
    }
  };
  return (
    <ErrorCacher>
      <Card sx={{ mt: 1 }}>
        <CardContent>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              p: 2,
            }}
          >
            <Container sx={{ flexGrow: 1 }} disableGutters>
              <h2 style={{ fontWeight: 800, fontSize: 30, margin: 0 }}>
                Advanced
              </h2>
              <SecondaryNavbar
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                navbarItems={navbarItems}
              />
              {currentTab === 0 && (
                <>
                  {!dangerousMode ? (
                    <>
                      <JSONTree data={jsonData} /> <Divider />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          setDangerousMode((prevState) => !prevState)
                        }
                      >
                        Active Dangerous Mode
                      </Button>
                    </>
                  ) : (
                    <>
                      <JsonEditorComponent
                        jsonData={jsonData}
                        setJsonData={setJsonData}
                      />
                      <Divider />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Button
                          variant="outlined"
                          onClick={() =>
                            setDangerousMode((prevState) => !prevState)
                          }
                        >
                          Active Safe Mode
                        </Button>
                        <Button
                          onClick={handleChangeDangerous}
                          variant="contained"
                          size="large"
                        >
                          Save
                        </Button>
                      </Stack>
                    </>
                  )}
                </>
              )}
              {currentTab === 1 && (
                <>
                  <FormControl>
                    <Typography>a4MONITOR service commands:</Typography>
                    <RadioGroup
                      row
                      name="a4monitor"
                      value={serviceCommandA4monitor || ""}
                      onChange={handleChangeA4monitor}
                    >
                      <FormControlLabel
                        value="start"
                        control={<Radio />}
                        label="Start"
                      />
                      <FormControlLabel
                        value="stop"
                        control={<Radio />}
                        label="Stop"
                      />
                      <FormControlLabel
                        value="restart"
                        control={<Radio />}
                        label="Restart"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Divider />

                  <FormControl>
                    <Typography>Back channel service commands:</Typography>
                    <RadioGroup
                      row
                      name="tf_bchnld"
                      value={serviceCommandBchnld || ""}
                      onChange={handleChangeBchnld}
                    >
                      <FormControlLabel
                        value="start"
                        control={<Radio />}
                        label="Start"
                      />
                      <FormControlLabel
                        value="stop"
                        control={<Radio />}
                        label="Stop"
                      />
                      <FormControlLabel
                        value="restart"
                        control={<Radio />}
                        label="Restart"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Divider />

                  <FormControl>
                    <Typography>Data transfer service commands:</Typography>
                    <RadioGroup
                      row
                      name="tf_http_xfer"
                      value={serviceCommandDataTranfer || ""}
                      onChange={handleChangeDataTranfer}
                    >
                      <FormControlLabel
                        value="start"
                        control={<Radio />}
                        label="Start"
                      />
                      <FormControlLabel
                        value="stop"
                        control={<Radio />}
                        label="Stop"
                      />
                      <FormControlLabel
                        value="restart"
                        control={<Radio />}
                        label="Restart"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Divider />

                  <FormControl>
                    <Typography>Configuration service commands:</Typography>
                    <RadioGroup
                      row
                      name="tf_cfgmng"
                      value={serviceCommandConfiguration || ""}
                      onChange={handleChangeConfiguration}
                    >
                      <FormControlLabel
                        value="start"
                        control={<Radio />}
                        label="Start"
                      />
                      <FormControlLabel
                        value="stop"
                        control={<Radio />}
                        label="Stop"
                      />
                      <FormControlLabel
                        value="restart"
                        control={<Radio />}
                        label="Restart"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Divider />

                  <FormControl>
                    <Typography>Broker service commands:</Typography>
                    <RadioGroup
                      row
                      name="mosquitto"
                      value={serviceCommandBroker || ""}
                      onChange={handleChangeBroker}
                    >
                      <FormControlLabel
                        value="start"
                        control={<Radio />}
                        label="Start"
                      />
                      <FormControlLabel
                        value="stop"
                        control={<Radio />}
                        label="Stop"
                      />
                      <FormControlLabel
                        value="restart"
                        control={<Radio />}
                        label="Restart"
                      />
                    </RadioGroup>
                  </FormControl>
                </>
              )}
              {currentTab === 2 && (
                <>
                  <FormLabel>
                    Add or remove the recovery IP Address of data collector
                  </FormLabel>
                  <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={5}
                    sx={{ mt: 2 }}
                  >
                    <Button variant="contained" onClick={handleAddRecoveryIP}>
                      Add recovery IP
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleRemoveRecoveryIP}
                    >
                      Remove recovery IP
                    </Button>
                  </Stack>
                  {dataColletorIP && (
                    <>
                      <Divider />
                      <FormControl fullWidth>
                        <TextField
                          value={dataColletorIP || ""}
                          disabled={true}
                          type="text"
                          label="Data collector recovery IP"
                        />
                      </FormControl>
                    </>
                  )}
                </>
              )}

              {currentTab === 3 && (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleRebootPCA}
                  >
                    Reboot Data Collector
                  </Button>
                </>
              )}
            </Container>
          </Box>
        </CardContent>
      </Card>
    </ErrorCacher>
  );
}
