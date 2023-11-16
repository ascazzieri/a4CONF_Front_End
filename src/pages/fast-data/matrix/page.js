import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateFastDataMatrix } from "../../../utils/redux/reducers";
import Button from "@mui/material/Button";
import JsonEditorComponent from "../../../components/JsonEditor/JsonEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  FormLabel,
  Autocomplete,
  FormControl,
  TextField,
  Stack,
  Divider,
} from "@mui/material";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import BackButton from "../../../components/BackButton/BackButton";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import SaveButton from "../../../components/SaveButton/SaveButton";
import { Container } from "@mui/material";
import { Fragment } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Table,
  TableContainer,
  TableRow,
  Grid,
  TableBody,
  TableCell,
  Switch,
} from "@mui/material";
import { getQueuePending } from "../../../utils/utils";
import { LoadingContext } from "../../../utils/context/Loading";
import {
  get_iot_gtws_disabled_fast_data_matrix,
  get_iot_gtws_enabled_fast_data_matrix,
  enable_http_client_iot_gateway,
  disable_http_client_iot_gateway,
} from "../../../utils/api";

export default function Matrix() {
  const customer = useSelector((state) => state.services?.fastdata?.customer);

  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Matrix management", "Manage Iot Gateways", "JSON"]
    : ["Matrix management", "Manage Iot Gateways"];

  const [matrixDataManagement, setMatrixDataManagement] = useState(
    customer?.matrix_data_managment || []
  );
  const [matrixIoTGatewaysEnabledList, setMatrixIoTGatewaysEnabledList] =
    useState([]);
  const [matrixIoTGatewaysDisabledList, setMatrixIoTGatewaysDisabledList] =
    useState([]);
  const [currentMatrixId, setCurrentMatrixId] = useState();

  const loaderContext = useContext(LoadingContext);

  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  //Update React states
  useEffect(() => {
    setMatrixDataManagement(customer?.matrix_data_managment || []);
  }, [customer]);

  useEffect(() => {
    (async () => {
      try {
        loaderContext[1](true);
        const matrixEnabledIoTGateways =
          await get_iot_gtws_enabled_fast_data_matrix();
        const matrixDisabledIoTGateways =
          await get_iot_gtws_disabled_fast_data_matrix();
        console.log("get IoT gateways");

        if (matrixEnabledIoTGateways?.length !== 0) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "success",
            message: `Kepware IoT gateways loaded`,
          });
        } else if (matrixEnabledIoTGateways?.length === 0) {
          handleRequestFeedback({
            vertical: "bottom",
            horizontal: "right",
            severity: "error",
            message: `Kepware enabled IoT gateways not found`,
          });
        }
        setMatrixIoTGatewaysEnabledList(matrixEnabledIoTGateways);
        setMatrixIoTGatewaysDisabledList(matrixDisabledIoTGateways);
      } catch (e) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred while trying to load Kepware Iot gateways for matrix`,
        });
      } finally {
        if (getQueuePending === 0) {
          loaderContext[1](false);
        }
      }
    })();
  }, []);

  const handleReloadAllIotGateway = async () => {
    try {
      loaderContext[1](true);
      const matrixEnabledIoTGateways =
        await get_iot_gtws_enabled_fast_data_matrix();
      const matrixDisabledIoTGateways =
        await get_iot_gtws_disabled_fast_data_matrix();
      console.log("get IoT gateways");

      if (matrixEnabledIoTGateways?.length !== 0) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Kepware IoT gateways loaded`,
        });
      } else if (matrixEnabledIoTGateways?.length === 0) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Kepware enabled IoT gateways not found`,
        });
      }
      setMatrixIoTGatewaysEnabledList(matrixEnabledIoTGateways);
      setMatrixIoTGatewaysDisabledList(matrixDisabledIoTGateways);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred while trying to load Kepware Iot gateways for matrix`,
      });
    } finally {
      if (getQueuePending === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleItemChange = (jsonItem) => {
    const oldMatrixManagement =
      matrixDataManagement?.length !== 0 ? [...matrixDataManagement] : [];
    const newItemIndex = oldMatrixManagement?.findIndex(
      (item) => item?.id === jsonItem?.id
    );
    if (newItemIndex !== -1) {
      oldMatrixManagement[newItemIndex] = jsonItem;
    } else {
      oldMatrixManagement.push(jsonItem);
    }
    setMatrixDataManagement(oldMatrixManagement);
  };
  const handleDeleteItem = () => {
    const newMatrixDataManagement = matrixDataManagement?.filter(
      (item) => item?.id !== currentMatrixId
    );
    setMatrixDataManagement(newMatrixDataManagement);
  };

  const handleEnableIotGateway = async (name) => {
    try {
      loaderContext[1](true);
      const result = await enable_http_client_iot_gateway(name);

      if (result?.enabled !== true) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occured. Cannot enable IoT Gateway `,
        });
        return;
      }
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `IoT Gateway: ${name} correctly enabled`,
      });
      let enabledIotGatewaysFromList =
        matrixIoTGatewaysEnabledList?.length !== 0
          ? [...matrixIoTGatewaysEnabledList]
          : [];
      enabledIotGatewaysFromList.push(name);
      setMatrixIoTGatewaysEnabledList(
        Array.from(new Set(enabledIotGatewaysFromList))
      );
      let disabledIotGatewaysFromList = matrixIoTGatewaysDisabledList?.filter(
        (item) => item !== name
      );
      setMatrixIoTGatewaysDisabledList(disabledIotGatewaysFromList);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occured. Cannot enable IoT Gateway `,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleDisableIotGateway = async (name) => {
    try {
      loaderContext[1](true);
      const result = await disable_http_client_iot_gateway(name);

      if (result?.enabled !== false) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occured. Cannot disable IoT Gateway  `,
        });
        return;
      }
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `IoT Gateway: ${name} correctly disabled`,
      });
      let disabledIotGatewaysFromList =
        matrixIoTGatewaysDisabledList?.length !== 0
          ? [...matrixIoTGatewaysDisabledList]
          : [];
      disabledIotGatewaysFromList.push(name);
      setMatrixIoTGatewaysDisabledList(
        Array.from(new Set(disabledIotGatewaysFromList))
      );
      let enabledIotGatewaysFromList = matrixIoTGatewaysEnabledList?.filter(
        (item) => item !== name
      );
      setMatrixIoTGatewaysEnabledList(enabledIotGatewaysFromList);
    } catch (e) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occured. Cannot disable IoT Gateway  `,
      });
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
    }
  };

  const handleMatrixChange = (e) => {
    e.preventDefault();
    const newMatrix = {
      ...customer,
      matrix_data_managment: matrixDataManagement || [],
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Matrix configuration save correctly`,
    });
    dispatch(updateFastDataMatrix(newMatrix));
  };
  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Matrix" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 2 && superUser && <JSONTree data={customer} />}

        <form onSubmit={handleMatrixChange}>
          {currentTab === 0 && (
            <>
              <FormLabel>Remove matrix item</FormLabel>
              <Stack
                direction="row"
                spacing={3}
                justifyContent="center"
                alignItems="center"
              >
                <FormControl fullWidth>
                  <Autocomplete
                    disablePortal
                    options={matrixDataManagement?.map((item) => item?.id)}
                    onChange={(event, newValue) => {
                      setCurrentMatrixId(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Matrix ID elements" />
                    )}
                  />
                </FormControl>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteItem}
                >
                  Delete
                </Button>
              </Stack>
              <Divider />
              {matrixDataManagement &&
                matrixDataManagement.length !== 0 &&
                matrixDataManagement.map((item, index) => {
                  return (
                    <Fragment key={item.id}>
                      <JsonEditorComponent
                        key={`editor-${item.id}-${index}`}
                        jsonData={item}
                        setJsonData={handleItemChange}
                      />
                    </Fragment>
                  );
                })}
            </>
          )}
          {currentTab === 1 && (
            <>
              <FormLabel>Kepware IoT Gateways list for Thingworx</FormLabel>
              <Divider />
              <Button
                onClick={handleReloadAllIotGateway}
                variant="outlined"
                endIcon={<CachedIcon />}
              >
                Refresh
              </Button>
              <Grid
                item
                xs={2}
                sm={6}
                md={6}
                style={{
                  textAlign: "center",
                  border: "2px inset white",
                  padding: "5px 20px",
                }}
              >
                <h3>Enable/Disable IoT Gateways for Thingworx</h3>

                <Divider />
                <Grid
                  container
                  rowSpacing={3}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ p: 1 }}
                >
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableBody>
                        {matrixIoTGatewaysEnabledList &&
                          matrixIoTGatewaysEnabledList?.length !== 0 &&
                          matrixIoTGatewaysEnabledList?.map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell align="center">
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Switch
                                      checked={true}
                                      variant="contained"
                                      color="secondary"
                                      onChange={() => {
                                        handleDisableIotGateway(iotGatewayName);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                        {matrixIoTGatewaysDisabledList &&
                          matrixIoTGatewaysDisabledList?.length !== 0 &&
                          matrixIoTGatewaysDisabledList?.map(
                            (iotGatewayName) => {
                              return (
                                <TableRow hover key={iotGatewayName}>
                                  <TableCell align="center">
                                    {iotGatewayName}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Switch
                                      checked={false}
                                      variant="contained"
                                      color="secondary"
                                      onChange={() => {
                                        handleEnableIotGateway(iotGatewayName);
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              );
                            }
                          )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </>
          )}

          {currentTab === 0 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
