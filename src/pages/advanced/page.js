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
import { JSONEditor } from "react-json-editor-viewer";
import { useSelector, useDispatch } from "react-redux";
import { JSONTree } from "react-json-tree";
import { useContext, useEffect, useState, useCallback } from "react";
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

  const handleChangeA4monitor = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandA4monitor(command);
    manageService(serviceName, command);
    setServiceCommandA4monitor(undefined);
  };
  const handleChangeBchnld = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandBchnld(command);
    manageService(serviceName, command);
    setServiceCommandBchnld(undefined);
  };
  const handleChangeDataTranfer = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandDataTransfer(command);
    manageService(serviceName, command);
    setServiceCommandDataTransfer(undefined);
  };
  const handleChangeConfiguration = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandConfiguration(command);
    manageService(serviceName, command);
    setServiceCommandConfiguration(undefined);
  };
  const handleChangeBroker = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandBroker(command);
    manageService(serviceName, command);
    setServiceCommandBroker(undefined);
  };

  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const [dataColletorIP, setDataColletorIP] = useState("");

  const handleAddRecoveryIP = async () => {
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
  };
  const handleRemoveRecoveryIP = async () => {
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
  };
  const manageService = (service, cmd) => {
    loaderContext[1](true);
    (async () => {
      try {
        const response = await get_advanced(service, cmd);
        console.log(response);
        if (response) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `${cmd} ${service} service correctly`,
          });
        } else {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `An error occurred on send command`,
          });
        }
      } catch (error) {
        console.error("Error during service handling", error);
      } finally {
        loaderContext[1](false);
      }
    })();
  };

  const handleRebootPCA = async () => {
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
  };
  const onJsonChange = useCallback((key, value, parent, data) => {
    const correctData = _.cloneDeep(data?.root);

    const transformFieldToArray = (obj) => {
      _.forOwn(obj, (fieldValue, field) => {
        // Se il campo è una stringa con il formato [], trasformalo in un array
        if (
          typeof fieldValue === "string" &&
          fieldValue.startsWith("[") &&
          fieldValue.endsWith("]")
        ) {
          try {
            obj[field] = JSON.parse(fieldValue);
          } catch (error) {
            console.error(
              `Errore durante il parsing del campo ${field}: ${error}`
            );
          }
        }

        // Se il campo è una stringa 'true' o 'false', trasformalo in un booleano
        if (
          typeof fieldValue === "string" &&
          (fieldValue.toLowerCase() === "true" ||
            fieldValue.toLowerCase() === "false")
        ) {
          obj[field] = fieldValue.toLowerCase() === "true";
        }

        // Ricorsione per oggetti nidificati
        if (typeof fieldValue === "object" && fieldValue !== null) {
          transformFieldToArray(fieldValue);
        }
      });
    };

    if (correctData) {
      transformFieldToArray(correctData);
      setJsonData(correctData);
    }
  }, []);

  const handleChangeDangerous = () => {
    console.log(jsonData);
    if (jsonData) {
      dispatch(
        updateAll({ payload: jsonData, meta: { actionType: "upload" } })
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
                      <JSONEditor
                        data={jsonData}
                        onChange={onJsonChange}
                        collapsible
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
