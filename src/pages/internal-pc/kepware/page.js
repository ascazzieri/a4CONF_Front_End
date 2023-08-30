import { useState, Fragment, useContext } from "react";
import ReactDownloadLink from "react-download-link";
import { useSelector, useDispatch } from "react-redux";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import { updateKepware, updateThingNames } from "../../../utils/redux/reducers";
import * as helper from "../../../utils/utils";
import {
  loadChannels,
  createiotgw,
  machines_connected,
  saveKepwareProject,
  get_device_tags,
} from "../../../utils/api";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
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
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";

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
const Row = (props) => {
  const { row, thingNames, handleButtonClickFeedback } = props;
  const [open, setOpen] = useState(false);
  const [rowData, setRowData] = useState(row);
  const [tagsSelectionDialog, setTagsSelectionDialog] = useState(false);
  const [iotGatewayType, setIotGatewayType] = useState(undefined);
  const [channelDevice, setChannelDevice] = useState({});
  const [provider, setProvider] = useState();
  const [endPoint, setEndPoint] = useState();
  const [deviceTags, setDeviceTags] = useState({});
  const [folder, setFolder] = useState();
  const [publishRate, setPublishRate] = useState(1000);
  const [scanRate, setScanRate] = useState(1000);

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
  const handleCreate = async (event, device) => {
    if (!device?.endpoint) {
      handleButtonClickFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Device: ${device?.name} requires an endpoint`,
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
    const folder = device?.folder;
    const publishRate = device?.publish_rate ? device?.publish_rate : 1000;
    const scanRate = device?.scan_rate ? device?.scan_rate : 1000;
    if (!device?.endpoint.includes("rt_")) {
      endpoint = `rt_${device?.endpoint}`;
    } else {
      endpoint = device?.endpoint;
    }
    if (device?.choose_tags) {
      const tags = await get_device_tags(row?.name, device?.name);
      const channel = row?.name;
      const deviceName = device?.name;
      const folder = device?.folder;
      const publish_rate = device?.publish_rate;
      const scan_rate = device?.scan_rate;
      setEndPoint(endpoint);
      setProvider(event?.target?.name);
      setDeviceTags(tags);
      setFolder(folder);
      setPublishRate(publish_rate);
      setScanRate(scan_rate);
      setChannelDevice({ [channel]: deviceName });
      setTagsSelectionDialog(true);
    } else {
      const response = await createiotgw(
        event?.target?.name, //type
        row?.name, //channel name
        device?.name, //device name
        event?.target?.name === "twa" ? endpoint : null, //endpoint
        event?.target?.name === "matrix" ? folder : null, //folder for matrix
        event?.target?.name === "matrix" ? publishRate : null, //publish rate for matrix
        event?.target?.name === "matrix" ? scanRate : null, //scan rate for matrix

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
          tags={deviceTags}
        />
      )}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
                                    defaultValue=""
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
                        <TableCell align="center">Folder</TableCell>
                        <TableCell align="center">Publish rate</TableCell>
                        <TableCell align="center">Scan rate</TableCell>
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
                                label="Folder name"
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
                                label="Publish rate (ms)"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={1000}
                                onBlur={handlePublishRateChange}
                                style={{ minWidth: 150 }}
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
                                label="Scan rate"
                                name={device?.name}
                                variant="outlined"
                                size="small"
                                defaultValue={1000}
                                onBlur={handleScanRateChange}
                                style={{ minWidth: 150 }}
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

  const snackBarContext = useContext(SnackbarContext);

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const loaderContext = useContext(LoadingContext);

  const [currentTab, setCurrentTab] = useState(0);
  const [channelRows, setChannelRows] = useState();
  const [expandedListChannels, setExpandedListChannels] = useState([]);
  const [expandedListDevices, setExpandedListDevices] = useState([]);
  const navbarItems = [
    "Local Things",
    "Machines Configured",
    "Create IoT Gateway",
    "Kepware configuration",
    "License",
    "JSON",
  ];

  const [thingName, setThingName] = useState();

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

  const [kepwareMode, setKepwareMode] = useState(kepware?.trial);
  const [thingNames, setThingNames] = useState(thing_names);
  useEffect(() => {
    setKepwareMode(kepware?.trial);
    setThingNames(thing_names);
  }, [kepware, thing_names]);

  const handleKepwareModeChange = (event) => {
    setKepwareMode(event.target.checked);
  };

  const handleKepwareChange = (event) => {
    const newKepware = {
      trial: kepwareMode,
    };
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
  const handleDownloadKepwareProject = async () => {
    loaderContext[1](true);
    try {
      const res = await helper.fetchData("kepware/backup", "GET");
      const now = new Date()
        .toISOString()
        .split(".")[0]
        .replaceAll("-", "")
        .replaceAll(":", "")
        .replace("T", "_");
      const file_name = "Kepware_" + now + ".json";

      return (
        <ReactDownloadLink
          filename={file_name}
          label="Download"
          exportFile={() => JSON.stringify(res)}
        />
      );
    } catch (e) {
      console.error(e);
    }
    loaderContext[1](false);
  };

  const handleAddThingName = () => {
    const thingNameList = [...thing_names];
    if (thingName.trim() === "") {
      return;
    }
    if (!thingName.includes("rt_")) {
      thingNameList.push(`rt_${thingName}`);
    } else {
      thingNameList.push(thingName);
    }

    dispatch(updateThingNames(thingNameList));
  };
  const handleThingNameDelete = (value) => {
    const thingNameList = thing_names.filter((item) => item !== value);
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
  const handleExpandableListDevices = (event, name) => {
    const oldList = [...expandedListDevices];
    if (oldList.includes(name)) {
      setExpandedListDevices((prevItems) =>
        prevItems.filter((item) => item !== name)
      );
    } else {
      oldList.push(name);
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
  const channelList = Array.from(groupByChannel(kepware?.machines)[0]);
  const device_connected = groupByChannel(kepware?.machines)[1];

  return (
    <ErrorCacher>
      <Container>
        <h2>Kepware</h2>
        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 5 && <JSONTree data={kepware} />}

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

        {/*    <form onSubmit={handleKepwareChange}> */}
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
                  value={thingName}
                  required={false}
                  onChange={(event) => {
                    setThingName(event?.target?.value);
                  }}
                />
              </FormControl>
              <Button variant="contained" onClick={handleAddThingName}>
                Add
              </Button>
            </Stack>

            <TableContainer sx={{ height: 250 }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableBody>
                  {thing_names &&
                    thing_names.length !== 0 &&
                    thing_names.map((row) => {
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
            <Box sx={{ flexGrow: 1 }}>
              <FormLabel>Kepware device configured:</FormLabel>

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
                        <>
                          <ListItemButton
                            onClick={(event, name) =>
                              handleExpandableListChannels(event, channel)
                            }
                          >
                            <ListItemIcon>
                              <LabelImportantIcon />
                            </ListItemIcon>
                            <ListItemText primary={channel} />
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
                          >
                            {deviceInside &&
                              deviceInside.length !== 0 &&
                              deviceInside.map((insideItem, insideIndex) => {
                                const deviceName = insideItem?.device;
                                return (
                                  <>
                                    <ListItemButton
                                      onClick={(event, name) =>
                                        handleExpandableListDevices(
                                          event,
                                          deviceName
                                        )
                                      }
                                    >
                                      <ListItemIcon>
                                        <LabelImportantIcon />
                                      </ListItemIcon>
                                      <ListItemText primary={deviceName} />
                                      {expandedListDevices.includes(
                                        deviceName
                                      ) ? (
                                        <ExpandLess />
                                      ) : (
                                        <ExpandMore />
                                      )}
                                    </ListItemButton>
                                    <Collapse
                                      in={expandedListDevices.includes(
                                        deviceName
                                      )}
                                      timeout="auto"
                                      unmountOnExit
                                    >
                                      <List component="div" disablePadding>
                                        <ListItemButton sx={{ pl: 10 }}>
                                          <ListItemIcon>
                                            <DoneAllIcon />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`Device: ${deviceName} `}
                                          />
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: 10 }}>
                                          <ListItemIcon>
                                            <CallMergeIcon />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`Driver type: ${insideItem?.driver_type} `}
                                          />
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: 10 }}>
                                          <ListItemIcon>
                                            <PendingOutlinedIcon />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`Ip address: ${insideItem?.ip_address} `}
                                          />
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: 10 }}>
                                          <ListItemIcon>
                                            <PendingOutlinedIcon />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`Port: ${insideItem?.port} `}
                                          />
                                        </ListItemButton>
                                        <ListItemButton sx={{ pl: 10 }}>
                                          <ListItemIcon>
                                            <PendingOutlinedIcon />
                                          </ListItemIcon>
                                          <ListItemText
                                            primary={`Last timestamp: ${new Date(
                                              insideItem?.timestamp * 1000
                                            )} `}
                                          />
                                        </ListItemButton>
                                      </List>
                                    </Collapse>
                                  </>
                                );
                              })}
                          </Collapse>
                        </>
                      );
                    })}
                </List>
              </Box>
            </Box>
          </>
        )}
        {currentTab === 2 && (
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

        {currentTab === 3 && (
          <>
            <FormControl fullWidth>
              <Typography>Kepware configuration:</Typography>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button variant="contained">Upload</Button>
                <Button
                  variant="contained"
                  onClick={handleDownloadKepwareProject}
                >
                  Download
                </Button>
              </Stack>
            </FormControl>

            <Divider />
          </>
        )}

        {currentTab === 4 && (
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
            <FormControl fullWidth>
              <Button onClick={handleKepwareChange} variant="contained">
                Invia
              </Button>
            </FormControl>
            <Divider />
          </>
        )}

        {/* <FormControl fullWidth>
          <Button type="submit" variant="contained">
            Invia
          </Button>
        </FormControl> */}
      </Container>
    </ErrorCacher>
  );
}
