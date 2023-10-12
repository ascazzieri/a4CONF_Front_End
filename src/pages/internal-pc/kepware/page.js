import { useState, Fragment, useContext } from "react";
import ReactDownloadLink from "react-download-link";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateKepware, updateThingNames } from "../../../utils/redux/reducers";
import * as helper from "../../../utils/utils";
import BackButton from "../../../components/BackButton/BackButton";
import SaveButton from "../../../components/SaveButton/SaveButton";
import {
  loadChannels,
  createiotgw,
  machines_connected,
  downloadKepwareProject,
  uploadKepwareProject,
  reload_kepware,
  get_device_tags,
} from "../../../utils/api";
import { useLocation } from "react-router-dom";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
import { SuperUserContext } from "../../../utils/context/SuperUser";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteIcon from "@mui/icons-material/Delete";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  IconButton,
  Container,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  RadioGroup,
  Radio,
  List,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TagsSelectionDialog from "../../../components/TagsSelectionDialog/TagsSelectionDialog";

import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import DvrIcon from "@mui/icons-material/Dvr";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import NumbersIcon from "@mui/icons-material/Numbers";
import DataArrayIcon from "@mui/icons-material/DataArray";
import RestoreIcon from "@mui/icons-material/Restore";
import { styled } from "@mui/material/styles";

import { JSONTree } from "react-json-tree";
import { useEffect } from "react";

const buildRows = (data) => {
  let channelsData = [];
  const dataKeys = Object.keys(data);
  if (dataKeys && dataKeys !== 0) {
    dataKeys.map((item, index) =>
      channelsData.push({
        name: item,
        device_number: data[`${item}`]?.length,
        devices: data[item]?.map((device) => ({
          name: device,
          choose_tags: false,
          custom_endpoint_enable: false,
        })),
      })
    );
  }
  return channelsData;
};
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Row = (props) => {
  const { row, thingNames, handleButtonClickFeedback } = props;
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(row);
  const [tagsSelectionDialog, setTagsSelectionDialog] = useState(false);
  const [iotGatewayType, setIotGatewayType] = useState();
  const [channelDevice, setChannelDevice] = useState({});
  const [provider, setProvider] = useState();
  const [endPoint, setEndPoint] = useState();
  const [deviceTags, setDeviceTags] = useState({});
  const [folder, setFolder] = useState();
  const [publishRate, setPublishRate] = useState(1000);
  const [scanRate, setScanRate] = useState(1000);
  const [samplingTime, setSamplingTime] = useState(16);
  const [samplingNumberStartIndex, setSamplingNumberStartIndex] = useState(0);
  const [samplingNumber, setSamplingNumber] = useState(100);
  const handleCustomEndpointChange = (event) => {
    const checked = event?.target?.checked;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.custom_endpoint_enable = checked;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleChooseFromTags = (event) => {
    const checked = event?.target?.checked;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.choose_tags = checked;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleEndpointChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.endpoint = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    console.log(updatedRowData);
    setRowData(updatedRowData);
  };
  const handleFolderChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.folder = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handlePublishRateChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.publish_rate = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleScanRateChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.scan_rate = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleSamplingTimeChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.sampling_time = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleSamplingStartIndexChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.sampling_number_start_index = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleSamplingNumberChange = (event) => {
    const value = event?.target?.value;
    const name = event?.target?.name;

    const updatedRowData = { ...rowData };

    const selectedDeviceIndex = updatedRowData.devices.findIndex(
      (item) => item.name === name
    );
    const updatedDevice = {
      ...updatedRowData.devices[selectedDeviceIndex],
    };

    updatedDevice.sampling_number = value;
    updatedRowData.devices[selectedDeviceIndex] = updatedDevice;
    setRowData(updatedRowData);
  };
  const handleCreate = async (event, device) => {
    console.log(device);
    if (
      event?.target?.name === "twa" &&
      (!device?.endpoint || device?.endpoint?.trim() === "")
    ) {
      handleButtonClickFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Device: ${device?.name} requires a non-null endpoint`,
      });
      return;
    }
    if (event?.target?.name === "matrix" && !device?.folder) {
      handleButtonClickFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Device: ${device?.name} requires a folder`,
      });
      return;
    }
    let endpoint = "";
    if (event?.target?.name !== "matrix") {
      if (!device?.endpoint.includes("rt_")) {
        endpoint = `rt_${device?.endpoint}`;
      } else {
        endpoint = device?.endpoint;
      }
    }
    const channel = row?.name;
    const deviceName = device?.name;

    setEndPoint(endpoint);
    setProvider(event?.target?.name);
    setFolder(device?.folder ? device?.folder : "blob_test");
    setScanRate(device?.scan_rate ? device?.scan_rate : 1000);
    setPublishRate(device?.publish_rate ? device?.publish_rate : 1000);
    setSamplingTime(device?.sampling_time ? device?.sampling_time : 16);
    setSamplingNumberStartIndex(
      device?.sampling_number_start_index
        ? device?.sampling_number_start_index
        : 0
    );
    setSamplingNumber(device?.sampling_number ? device?.sampling_number : 100);
    if (device?.choose_tags) {
      const tags = await get_device_tags(row?.name, device?.name);
      setDeviceTags(tags);
      setChannelDevice({ [channel]: deviceName });
      setTagsSelectionDialog(true);
    } else {
      const response = await createiotgw(
        event?.target?.name, //type
        row?.name, //channel name
        device?.name, //device name
        event?.target?.name === "twa" ? device?.endpoint : null, //endpoint
        event?.target?.name === "matrix"
          ? device?.folder
            ? device?.folder
            : "blob_test"
          : null, //folder for matrix
        event?.target?.name === "matrix"
          ? device?.scan_rate
            ? device?.scan_rate
            : 1000
          : null, //scan rate for matrix
        event?.target?.name === "matrix"
          ? device?.publish_rate
            ? device?.publish_rate
            : 1000
          : null, //publish rate for matrix
        event?.target?.name === "matrix"
          ? device?.sampling_time
            ? device?.sampling_time
            : 16
          : null, //sampling time for matrix
        event?.target?.name === "matrix"
          ? device?.sampling_number_start_index
            ? device?.sampling_number_start_index
            : 0
          : null, //sampling number start index for matrix
        event?.target?.name === "matrix"
          ? device?.sampling_number
            ? device?.sampling_number
            : 100
          : null, //sampling number for matrix
        []
      );
      if (response?.iotgw && response?.time && response?.thing_name)
        handleButtonClickFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `IoT gateway ${response.iotgw} of device: ${
            device?.name
          } for ${
            event?.target?.name === "twa"
              ? "Thingworx"
              : event?.target?.name === "opcua_from"
              ? "OPCUA (reading)"
              : "OPCUA (writing)"
          } has been created in ${response.time} s`,
        });
      else {
        handleButtonClickFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred during creation of Iot Gateway`,
        });
      }
    }
  };
  return (
    <Fragment>
      {tagsSelectionDialog && (
        <TagsSelectionDialog
          open={tagsSelectionDialog}
          setOpen={setTagsSelectionDialog}
          deviceName={channelDevice}
          provider={provider}
          endPoint={endPoint}
          folder={folder}
          publishRate={publishRate}
          scanRate={scanRate}
          samplingTime={samplingTime}
          samplingNumberStartIndex={samplingNumberStartIndex}
          samplingNumber={samplingNumber}
          tags={deviceTags}
        />
      )}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          maxWidth: 600,
          overflowX: "auto",
          p: 5,
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {rowData.name}
        </TableCell>
        <TableCell>{rowData.device_number}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            addEndListener={() => setIotGatewayType(undefined)}
          >
            <Box sx={{ margin: 1 }}>
              {!iotGatewayType && (
                <Container disableGutters sx={{ textAlign: "center" }}>
                  <FormControl>
                    <FormLabel>IoT Gateway type</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={iotGatewayType}
                      onChange={(event) => {
                        setIotGatewayType(event?.target?.value);
                      }}
                    >
                      <FormControlLabel
                        value="twa"
                        control={<Radio />}
                        label="Thingworx"
                      />
                      <FormControlLabel
                        value="opcua"
                        control={<Radio />}
                        label="OPCUA Server"
                      />
                      <FormControlLabel
                        value="http"
                        control={<Radio />}
                        label="HTTP Server"
                      />
                      <FormControlLabel
                        value="matrix"
                        control={<Radio />}
                        label="Matrix"
                      />
                    </RadioGroup>
                  </FormControl>
                </Container>
              )}
              {iotGatewayType === "twa" && (
                <Fragment>
                  <Typography variant="h6" gutterBottom component="div">
                    Devices
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Local Thing</TableCell>
                        <TableCell align="center">Custom Endpoint</TableCell>
                        <TableCell align="center">Choose tags</TableCell>
                        <TableCell align="center">
                          IoT gateway for Thingworx
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowData.devices?.map((device, index) => {
                        return (
                          <TableRow key={device?.name}>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {device?.name}
                            </TableCell>
                            <TableCell align="center">
                              {device?.custom_endpoint_enable ? (
                                <>
                                  <TextField
                                    label="Local Thing"
                                    name={device?.name}
                                    variant="outlined"
                                    size="small"
                                    defaultValue={
                                      device?.endpoint
                                        ? device?.endpoint.substring(
                                            3,
                                            device?.endpoint.length
                                          )
                                        : ""
                                    }
                                    onBlur={handleEndpointChange}
                                    style={{ minWidth: 150 }}
                                  />
                                </>
                              ) : (
                                <>
                                  <TextField
                                    select
                                    label="Local Things"
                                    name={device?.name}
                                    value={device?.endpoint || ""}
                                    onChange={handleEndpointChange}
                                    style={{ minWidth: 150 }}
                                  >
                                    {thingNames &&
                                      thingNames?.length !== 0 &&
                                      thingNames.map((item, index) => (
                                        <MenuItem key={item} value={item}>
                                          {item.substring(3, item.length)}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </>
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Switch
                                checked={device?.custom_endpoint_enable}
                                name={device?.name}
                                onChange={handleCustomEndpointChange}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Switch
                                checked={device?.choose_tags}
                                name={device?.name}
                                onChange={handleChooseFromTags}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="twa"
                              >
                                Create
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Fragment>
              )}
              {iotGatewayType === "opcua" && (
                <Fragment>
                  <Typography variant="h6" gutterBottom component="div">
                    Devices
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Choose tags</TableCell>
                        <TableCell align="center">
                          IoT gateway for OPCUA(reading)
                        </TableCell>
                        <TableCell align="center">
                          IoT gateway for OPCUA(writing)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowData.devices?.map((device, index) => {
                        return (
                          <TableRow key={device?.name}>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {device?.name}
                            </TableCell>

                            <TableCell align="center">
                              <Switch
                                checked={device?.choose_tags}
                                name={device?.name}
                                onChange={handleChooseFromTags}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="opcua_from"
                              >
                                Create
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="opcua_to"
                              >
                                Create
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Fragment>
              )}
              {iotGatewayType === "http" && (
                <Fragment>
                  <Typography variant="h6" gutterBottom component="div">
                    Devices
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Choose tags</TableCell>
                        <TableCell align="center">
                          IoT gateway for HTTP(reading)
                        </TableCell>
                        <TableCell align="center">
                          IoT gateway for HTTP(writing)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowData.devices?.map((device, index) => {
                        return (
                          <TableRow key={device?.name}>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {device?.name}
                            </TableCell>

                            <TableCell align="center">
                              <Switch
                                checked={device?.choose_tags}
                                name={device?.name}
                                onChange={handleChooseFromTags}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="opcua_from"
                              >
                                Create
                              </Button>
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="opcua_to"
                              >
                                Create
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Fragment>
              )}
              {iotGatewayType === "matrix" && (
                <Fragment>
                  <Typography variant="h6" gutterBottom component="div">
                    Devices
                  </Typography>
                  <Table size="small" aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Blob folder</TableCell>
                        <TableCell align="center">Scan rate</TableCell>
                        <TableCell align="center">Publish rate</TableCell>
                        <TableCell align="center">Sampling time</TableCell>
                        <TableCell align="center">Sampling index</TableCell>
                        <TableCell align="center">Sampling number</TableCell>
                        <TableCell align="center">Choose tags</TableCell>
                        <TableCell align="center">
                          IoT gateway for Fast data Matrix
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowData.devices?.map((device, index) => {
                        return (
                          <TableRow key={device?.name}>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              {device?.name}
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                select
                                label="Machine ID"
                                name={device?.name}
                                defaultValue=""
                                onChange={handleFolderChange}
                                style={{ minWidth: 150 }}
                              >
                                {thingNames &&
                                  thingNames?.length !== 0 &&
                                  thingNames.map((item, index) => (
                                    <MenuItem key={item} value={item}>
                                      {item.substring(3, item.length)}
                                    </MenuItem>
                                  ))}
                              </TextField>
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                type="number"
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                label="ms"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={1000}
                                onBlur={handleScanRateChange}
                                style={{ minWidth: 80 }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                type="number"
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                label="ms"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={1000}
                                onBlur={handlePublishRateChange}
                                style={{ minWidth: 80 }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                type="number"
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                label="ms"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={16}
                                onBlur={handleSamplingTimeChange}
                                style={{ minWidth: 80 }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                type="number"
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                label="index"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={0}
                                onBlur={handleSamplingStartIndexChange}
                                style={{ minWidth: 80 }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                            >
                              <TextField
                                type="number"
                                inputProps={{
                                  inputMode: "numeric",
                                  pattern: "[0-9]*",
                                }}
                                label="number"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={100}
                                onBlur={handleSamplingNumberChange}
                                style={{ minWidth: 80 }}
                              />
                            </TableCell>

                            <TableCell align="center">
                              <Switch
                                checked={device?.choose_tags}
                                name={device?.name}
                                onChange={handleChooseFromTags}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={(event) => handleCreate(event, device)}
                                variant="contained"
                                name="matrix"
                              >
                                Create
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Fragment>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default function Kepware() {
  const kepware = useSelector((state) => state.services?.kepware);
  const thing_names = useSelector(
    (state) => state.services?.thingworx?.thing_names
  );
  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();

  const superUser = useContext(SuperUserContext)[0];

  const snackBarContext = useContext(SnackbarContext);
  const loadingContext = useContext(LoadingContext);

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const loaderContext = useContext(LoadingContext);

  const [currentTab, setCurrentTab] = useState(0);
  const [channelRows, setChannelRows] = useState();
  const [expandedListChannels, setExpandedListChannels] = useState([]);
  const [expandedListDevices, setExpandedListDevices] = useState([]);
  const navbarItems = superUser
    ? [
        "Local Things",
        "Create IoT Gateway",
        "Kepware configuration",
        "License",
        "Machines Configured",
        "JSON",
      ]
    : [
        "Local Things",
        "Create IoT Gateway",
        "Kepware configuration",
        "License",
        "Machines Configured",
      ];

  const [machineSerial, setMachineSerial] = useState();

  const [count, setCount] = useState(0);
  const [isInKepware, setIsInKepware] = useState(false);
  const [connectedMachines, setConnectedMachines] = useState(kepware?.machines);

  const location = useLocation();

  useEffect(() => {
    (async () => {
      loaderContext[1](true);
      const kepwareChannels = await loadChannels();
      console.log("get kepware channels");

      if (kepwareChannels && Object.keys(kepwareChannels).length !== 0) {
        setChannelRows(buildRows(kepwareChannels));
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Kepware channels loaded`,
        });
      } else if (kepwareChannels && Object.keys(kepwareChannels).length === 0) {
        setChannelRows(buildRows(kepwareChannels));
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `No Kepware Channel found`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred during Kepware Channels loading`,
        });
      }
      loaderContext[1](false);
    })();
  }, []);

  useEffect(() => {
    let timer;

    if (isInKepware) {
      timer = setInterval(async () => {
        const machinesConnected = await machines_connected();
        setConnectedMachines(machinesConnected);
        setCount((prevCount) => prevCount + 1);
      }, 10000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isInKepware]);

  useEffect(() => {
    if (location.pathname === "/data-collector/kepware") {
      setIsInKepware(true);
    } else {
      setIsInKepware(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    setConnectedMachines(kepware?.machines);
  }, [kepware?.machines]);

  const [kepwareMode, setKepwareMode] = useState(kepware?.trial);
  const [thingNames, setThingNames] = useState(thing_names || []);
  useEffect(() => {
    setKepwareMode(kepware?.trial);
    setThingNames(thing_names || []);
  }, [kepware, thing_names]);

  const handleKepwareModeChange = (event) => {
    setKepwareMode(event.target.checked);
  };

  const handleKepwareChange = (event) => {
    event.preventDefault();
    const updatedThingNames = thingNames?.map((element) => {
      if (element.startsWith("rt_")) {
        return element; // Se l'elemento inizia già con 'rt_', non fare nulla
      } else {
        return "rt_" + element; // Aggiungi 'rt_' all'inizio dell'elemento
      }
    });
    const newKepware = {
      trial: kepwareMode,
    };
    handleRequestFeedback({
      vertical: "bottom",
      horizontal: "right",
      severity: "success",
      message: `Kepware configuration of data collector temporarly saved. Click Apply button to send changes to a4GATE`,
    });

    dispatch(updateThingNames(updatedThingNames));
    dispatch(updateKepware({ newKepware }));
  };

  const handleChannelRefresh = async () => {
    loaderContext[1](true);
    const kepwareChannels = await loadChannels();
    console.log("refresh kepware channel");

    if (kepwareChannels && Object.keys(kepwareChannels).lenght !== 0) {
      setChannelRows(buildRows(kepwareChannels));
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware channels loaded`,
      });
    } else if (kepwareChannels && Object.keys(kepwareChannels).lenght === 0) {
      setChannelRows(buildRows(kepwareChannels));
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `No Kepware Channel found`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware Channels loading`,
      });
    }
    loaderContext[1](false);
  };
  const handleUploadKepwareProject = async (event) => {
    loadingContext[1](true);
    const file = event.target.files[0];

    const fileContent = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.readAsText(file);
    });

    try {
      const jsonObject = JSON.parse(fileContent);
      if (jsonObject?.crashed_page) {
        delete jsonObject.crashed_page;
        console.log("crashed");
      }
      const res = await uploadKepwareProject(jsonObject);
      if (res) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: "Uploaded Kepware project",
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: "An error occurred on Kepware project upload",
        });
      }
    } catch (error) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: "Error parsing JSON file",
      });
    }
    loadingContext[1](false);
  };

  const handleDownloadKepwareProject = async () => {
    loaderContext[1](true);
    const kepwareDownload = await downloadKepwareProject();
    if (kepwareDownload) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware project saved successfully`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware project download`,
      });
    }
    loaderContext[1](false);
  };

  const handleReloadKepwareRuntime = async () => {
    loaderContext[1](true);
    const kepwareReload = await reload_kepware();
    if (kepwareReload) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware runtime reloaded successfully`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware runtime reload`,
      });
    }
    loaderContext[1](false);
  };

  const handleAddThingName = (event) => {
    if (!machineSerial || machineSerial?.trim() === "") {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Machine serial number cannot be empty`,
      });
      return;
    }
    console.log(thingNames);
    // Creare una copia dell'array scanException
    const thing_names = [...thingNames];

    // Verificare se l'elemento è già presente nell'array
    if (
      !thing_names.includes(machineSerial.trim()) &&
      !thing_names.includes(`rt_${machineSerial.trim()}`)
    ) {
      // Se non è presente, aggiungerlo
      if (machineSerial.includes("rt_")) {
        thing_names.push(machineSerial.trim());
      } else {
        thing_names.push(`rt_${machineSerial.trim()}`);
      }

      setThingNames(thing_names);
    }
  };
  const handleThingNameDelete = (value) => {
    const thingNameList = thingNames.filter((item) => item !== value);
    dispatch(updateThingNames(thingNameList));
  };
  const handleExpandableListChannels = (event, name) => {
    const oldList = [...expandedListChannels];
    if (oldList.includes(name)) {
      setExpandedListChannels((prevItems) =>
        prevItems.filter((item) => item !== name)
      );
    } else {
      oldList.push(name);
      setExpandedListChannels(oldList);
    }
  };
  const handleExpandableListDevices = (event, channel, device) => {
    const oldList = [...expandedListDevices];
    if (oldList.includes(`${channel}.${device}`)) {
      setExpandedListDevices((prevItems) =>
        prevItems.filter((item) => item !== `${channel}.${device}`)
      );
    } else {
      oldList.push(`${channel}.${device}`);
      setExpandedListDevices(oldList);
    }
  };
  const groupByChannel = (data) => {
    if (!data || data.length === 0) {
      return;
    }
    let channelsList = new Set();
    const groupedData = {};

    data.forEach((item) => {
      channelsList.add(item.channel);
      const channel = item.channel;
      if (!groupedData[channel]) {
        groupedData[channel] = [];
      }
      groupedData[channel].push(item);
    });

    return [channelsList, groupedData];
  };
  const [snackBar, setSnackBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    severity: "error",
    message: "test",
  });

  const { vertical, horizontal, severity, open, message } = snackBar;

  const handleClick = (newState) => {
    setSnackBar({ ...newState, open: true });
  };

  const channelList = groupByChannel(connectedMachines)
    ? Array.from(groupByChannel(connectedMachines)[0])
    : [];
  const device_connected = groupByChannel(connectedMachines)
    ? groupByChannel(connectedMachines)[1]
    : [];
  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Kepware" />
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 5 && superUser && <JSONTree data={kepware} />}

        <Snackbar
          open={open}
          autoHideDuration={2000}
          anchorOrigin={{ vertical, horizontal }}
          onClose={() =>
            setSnackBar((prevState) => ({
              ...prevState,
              open: false,
            }))
          }
        >
          <Alert severity={severity}>{message}</Alert>
        </Snackbar>
        <form onSubmit={handleKepwareChange}>
          {currentTab === 0 && (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel>Machine serial number:</FormLabel>

                  <TextField
                    type="text"
                    label="Machine serial"
                    helperText="Create a new machine serial number and add it to the list below"
                    value={machineSerial || ""}
                    onChange={(event) => {
                      setMachineSerial(event?.target?.value);
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleAddThingName}>
                  Add
                </Button>
              </Stack>

              <TableContainer sx={{ maxHeight: 250, overflowY: "auto" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableBody>
                    {thingNames &&
                      thingNames.length !== 0 &&
                      thingNames.map((row) => {
                        return (
                          <TableRow hover key={row}>
                            <TableCell align="center">
                              {row.substring(3, row.length)}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  handleThingNameDelete(row);
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {currentTab === 1 && (
            <>
              <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Button
                          onClick={handleChannelRefresh}
                          variant="outlined"
                          endIcon={<CachedIcon />}
                        >
                          Refresh
                        </Button>
                      </TableCell>
                      <TableCell>KEPWARE CHANNELS</TableCell>
                      <TableCell>DEVICE NUMBER</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {channelRows &&
                      channelRows.lenght !== 0 &&
                      channelRows.map((row) => {
                        return (
                          <Row
                            key={row.name + row.device_number}
                            row={row}
                            thingNames={thingNames}
                            handleButtonClickFeedback={handleClick}
                          />
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Divider />
            </>
          )}

          {currentTab === 2 && (
            <>
              <FormControl fullWidth>
                <Typography>Kepware project:</Typography>

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Button component="label" variant="contained">
                    Upload
                    <VisuallyHiddenInput
                      type="file"
                      accept=".json"
                      onChange={handleUploadKepwareProject}
                    />
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleDownloadKepwareProject}
                  >
                    Download
                  </Button>
                </Stack>
              </FormControl>

              <Divider />

              <Typography>Kepware runtime:</Typography>

              <Button variant="contained" onClick={handleReloadKepwareRuntime}>
                Reload
              </Button>

              <Divider />
            </>
          )}

          {currentTab === 3 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Kepware mode:</FormLabel>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>License mode</Typography>

                  <Switch
                    checked={kepwareMode}
                    onChange={handleKepwareModeChange}
                  />

                  <Typography>Trial mode</Typography>
                </Stack>
              </FormControl>
              <Divider />
            </>
          )}
          {currentTab === 4 && (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <FormLabel>Kepware channels info:</FormLabel>

                <Box component="main" sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1 }}
                  >
                    Devices
                  </Typography>
                  <List
                    sx={{
                      width: "100%",
                    }}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                  >
                    {channelList &&
                      channelList !== 0 &&
                      channelList.map((channel, index) => {
                        const deviceInside = device_connected[channel];
                        return (
                          <Fragment key={Math.random()}>
                            <ListItemButton
                              onClick={(event) =>
                                handleExpandableListChannels(event, channel)
                              }
                              key={Math.random()}
                            >
                              <ListItemIcon key={Math.random()}>
                                <LabelImportantIcon />
                              </ListItemIcon>
                              <ListItemText
                                primary={channel}
                                key={Math.random()}
                              />
                              {expandedListChannels.includes(channel) ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )}
                            </ListItemButton>
                            <Collapse
                              in={expandedListChannels.includes(channel)}
                              timeout="auto"
                              unmountOnExit
                              key={Math.random()}
                            >
                              {deviceInside &&
                                deviceInside.length !== 0 &&
                                deviceInside.map((insideItem, insideIndex) => {
                                  const deviceName = insideItem?.device;
                                  return (
                                    <Fragment key={Math.random()}>
                                      <ListItemButton
                                        onClick={(event) =>
                                          handleExpandableListDevices(
                                            event,
                                            channel,
                                            deviceName
                                          )
                                        }
                                        sx={{ pl: 5 }}
                                      >
                                        <ListItemIcon>
                                          <DvrIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={deviceName} />
                                        {expandedListDevices.includes(
                                          `${channel}.${deviceName}`
                                        ) ? (
                                          <ExpandLess />
                                        ) : (
                                          <ExpandMore />
                                        )}
                                      </ListItemButton>
                                      <Collapse
                                        in={expandedListDevices.includes(
                                          `${channel}.${deviceName}`
                                        )}
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        <List component="div" disablePadding>
                                          <ListItemButton sx={{ pl: 10 }}>
                                            <ListItemIcon>
                                              <BorderColorIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`Device: ${deviceName} `}
                                            />
                                          </ListItemButton>
                                          <ListItemButton sx={{ pl: 10 }}>
                                            <ListItemIcon>
                                              <DataArrayIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`Driver type: ${insideItem?.driver_type || "Unknow driver"} `}
                                            />
                                          </ListItemButton>
                                          <ListItemButton sx={{ pl: 10 }}>
                                            <ListItemIcon>
                                              <SettingsEthernetIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`IP address: ${insideItem?.ip_address} `}
                                            />
                                          </ListItemButton>
                                          <ListItemButton sx={{ pl: 10 }}>
                                            <ListItemIcon>
                                              <NumbersIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`Port: ${insideItem?.port} `}
                                            />
                                          </ListItemButton>
                                          <ListItemButton sx={{ pl: 10 }}>
                                            <ListItemIcon>
                                              <RestoreIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                              primary={`Last timestamp: ${new Date(
                                                insideItem?.timestamp * 1000
                                              )} `}
                                            />
                                          </ListItemButton>
                                        </List>
                                      </Collapse>
                                    </Fragment>
                                  );
                                })}
                            </Collapse>
                          </Fragment>
                        );
                      })}
                  </List>
                </Box>
              </Box>
            </>
          )}

          {(currentTab === 0 || currentTab === 3) && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
