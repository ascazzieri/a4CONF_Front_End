import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateOPCServer } from "../../../utils/redux/reducers";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import Table from "../../../components/Table/Table";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  TextField,
  Stack,
  Typography,
  Switch,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";

export default function OPCServer() {
  const opcua = useSelector((state) => state.services?.opcua);
  /* const industrialIP = useSelector(
    (state) => state.json.config.system.network.industrial.ip
  ); */
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = ["Iot Gateway", "Port", "Security", "JSON"];

  const getArrayOfObjects = (data, key1, key2) => {
    let arrayOfObjects = [];
    const keys = Object.keys(data);
    if (data) {
      keys.map((item, index) => {
        arrayOfObjects.push({
          [`${key1}`]: item,
          [`${key2}`]: data[item].toString(),
        });
      });
    }
    return arrayOfObjects;
  };

  const [shiftFromKepware, setShiftFromKepware] = useState(
    opcua?.shift_property_from_kepware
  );
  const [shiftToKepware, setShiftToKepware] = useState(
    opcua?.shift_property_to_kepware
  );
  const [customPortEnable, setCustomPortEnable] = useState(
    opcua?.opcua?.custom_port_enable
  );
  const [customPort, setCustomPort] = useState(opcua?.opcua?.custom_port);

  const [serverAuth, setServerAuth] = useState(opcua?.security?.user_auth);

  const [usersTableData, setUsersTableData] = useState(
    getArrayOfObjects(opcua?.security?.users, "username", "password")
  );
  const handleShiftFromKepwareChange = (event) => {
    setShiftFromKepware(event?.target?.value);
  };
  const handleShiftToKepwareChange = (event) => {
    setShiftToKepware(event?.target?.value);
  };
  const handleCustomPortEnableChange = (event) => {
    setCustomPortEnable(event?.target?.checked);
  };
  const handleCustomPortChange = (event) => {
    setCustomPort(event?.target?.value);
  };
  const handleServerAuthChange = (event) => {
    setServerAuth(event?.target?.checked);
  };

  const handleOPCUAServerChange = () => {
    let usersData = {};
    if (usersTableData.length !== 0) {
      usersTableData.map(
        (item, index) => (usersData[`${item?.ssid}`] = item?.password)
      );
    }

    const newOPCUAServer = {
      enabled: false,
      shift_property_from_kepware: shiftFromKepware?.toString(),
      shift_property_to_kepware: shiftToKepware?.toString(),
      opcua: {
        custom_port_enable: customPortEnable,
        custom_port: customPort?.toString(),
      },
      security: {
        user_auth: serverAuth,
        users: usersData,
      },
    };
    dispatch(updateOPCServer({ newOPCUAServer }));
  };

  const usersColumnData = [
    {
      accessorKey: "username",
      header: "User",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "password",
      header: "Password",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];

  return (
    <Container>
      <h2>OPCUA Server</h2>
      <SecondaryNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        navbarItems={navbarItems}
      />
      {currentTab === 3 && <JSONTree data={opcua} />}

      <form onSubmit={handleOPCUAServerChange}>
        {currentTab === 0 && (
          <>
            <FormControl fullWidth>
              <FormLabel>From Kepware:</FormLabel>

              <TextField
                type="text"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                label="Shift from Kepware"
                helperText="Shift OPCUA nodes (in order to exclude roots) from Kepware Iot Gateway"
                defaultValue={shiftFromKepware}
                required={false}
                onChange={handleShiftFromKepwareChange}
              />
            </FormControl>
            <Divider />

            <FormControl fullWidth>
              <FormLabel>To Kepware:</FormLabel>

              <TextField
                type="number"
                label="Shift to Kepware"
                helperText="Shift OPCUA nodes (in order to exclude roots) to Kepware Iot Gateway"
                defaultValue={shiftToKepware}
                required={false}
                onChange={handleShiftToKepwareChange}
              />
            </FormControl>
            <Divider />
          </>
        )}
        {currentTab === 1 && (
          <>
            <FormControl fullWidth>
              <FormLabel>OPCUA Server Port:</FormLabel>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Use Default Port - 4840</Typography>

                <Switch
                  checked={customPortEnable}
                  onChange={handleCustomPortEnableChange}
                />

                <Typography>Use Custom Port</Typography>
              </Stack>
            </FormControl>

            <Divider />

            {customPortEnable && (
              <>
                <FormControl fullWidth>
                  <FormLabel>Custom Port:</FormLabel>

                  <TextField
                    type="text"
                    label="Custom Port"
                    helperText="Use this port for OPCUA Server tag exposure"
                    defaultValue={customPort}
                    required={false}
                    onChange={handleCustomPortChange}
                  />
                </FormControl>
                <Divider />
              </>
            )}
          </>
        )}

        {currentTab === 2 && (
          <>
            <FormControl fullWidth>
              <FormLabel>Enable/Disable OPCUA Server authentication:</FormLabel>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Disable</Typography>

                <Switch
                  checked={serverAuth}
                  onChange={handleServerAuthChange}
                />

                <Typography>Enable</Typography>
              </Stack>
            </FormControl>

            <Divider />

            {serverAuth && (
              <>
                <FormLabel>Users:</FormLabel>

                <Table
                  tableData={usersTableData}
                  setTableData={setUsersTableData}
                  columnsData={usersColumnData}
                />

                <Divider />
              </>
            )}
          </>
        )}

        <FormControl fullWidth>
          <Button type="submit" variant="contained">
            Invia
          </Button>
        </FormControl>
      </form>
    </Container>
  );
}
