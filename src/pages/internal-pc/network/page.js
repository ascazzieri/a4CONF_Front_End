import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateIndustrialNetwork } from "../../../utils/redux/reducers";
import ErrorCacher from "../../../components/Errors/ErrorCacher";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import CustomTable from "../../../components/Table/Table";
import BackButton from "../../../components/BackButton/BackButton";
import { getArrayOfObjects } from "../../../utils/utils";
import { JSONTree } from "react-json-tree";
import SaveButton from "../../../components/SaveButton/SaveButton";
import {
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Button,
  Table,
  Stack,
  TableContainer,
  TableCell,
  IconButton,
  TableBody,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SuperUserContext } from "../../../utils/context/SuperUser";

export default function InternalNetwork() {
  const industrialNetwork = useSelector(
    (state) => state.system?.network?.industrial
  );
  const dispatch = useDispatch();
  const superUser = useContext(SuperUserContext)[0];
  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = superUser
    ? ["Connection parameters", "Static Routes", "Scan Exception", "JSON"]
    : ["Connection parameters", "Static Routes", "Scan Exception"];

  const [connection, setConnection] = useState(
    industrialNetwork?.dhcp ? "dhcp" : "static"
  );
  const [ipAddress, setIPAddress] = useState(industrialNetwork?.ip);

  const [routeTableData, setRouteTableData] = useState(
    getArrayOfObjects(industrialNetwork?.routes, "subnet", "gateway")
  );
  const [scanException, setScanException] = useState(
    industrialNetwork?.net_scan
  );
  const [currentScanException, setCurrentScanException] = useState();

  useEffect(() => {
    setConnection(industrialNetwork?.dhcp ? "dhcp" : "static");
    setIPAddress(industrialNetwork?.ip);
    setRouteTableData(
      getArrayOfObjects(industrialNetwork?.routes, "subnet", "gateway")
    );
    setScanException(industrialNetwork?.net_scan);
  }, [industrialNetwork]);

  const handleConnectionChange = (event) => {
    setConnection(event?.target?.value);
  };
  const handleIPAddressChange = (event) => {
    setIPAddress(event?.target?.value);
  };

  const handleAddScanException = () => {
    if (!currentScanException || currentScanException.trim() === "") {
      return;
    }

    // Creare una copia dell'array scanException
    const scanExceptionCopy = [...scanException];

    // Verificare se l'elemento è già presente nell'array
    if (!scanExceptionCopy.includes(currentScanException)) {
      // Se non è presente, aggiungerlo
      scanExceptionCopy.push(currentScanException);
      setScanException(scanExceptionCopy);
    }
  };

  const handleDeleteScanException = (value) => {
    const scanExceptionList = scanException.filter((item) => item !== value);
    setScanException(scanExceptionList);
  };

  const handleIndustrialChange = (event) => {
    event.preventDefault();

    let staticRoutes = {};
    if (routeTableData.length !== 0) {
      routeTableData.map(
        (item, index) => (staticRoutes[`${item?.subnet}`] = item?.gateway)
      );
    }

    const newIndustrial = {
      dhcp: connection === "static" ? false : true,
      ip: ipAddress,
      routes: staticRoutes,
      net_scan: scanException,
    };
    dispatch(updateIndustrialNetwork({ newIndustrial }));
  };

  const routesColumnData = [
    {
      accessorKey: "subnet",
      header: "Subnet",
      enableColumnOrdering: true,
      enableEditing: false, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "gateway",
      header: "Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];

  return (
    <ErrorCacher>
      <Container>
        <BackButton pageTitle="Network"></BackButton>

        <SecondaryNavbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          navbarItems={navbarItems}
        />
        {currentTab === 3 && superUser && <JSONTree data={industrialNetwork} />}

        <form onSubmit={handleIndustrialChange}>
          {currentTab === 0 && (
            <>
              <FormControl fullWidth>
                <FormLabel>Connection:</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={connection}
                  onChange={handleConnectionChange}
                >
                  <FormControlLabel
                    value="static"
                    control={<Radio />}
                    label="Static"
                  />
                  <FormControlLabel
                    value="dhcp"
                    control={<Radio />}
                    label="DHCP"
                  />
                </RadioGroup>
              </FormControl>

              <Divider />

              <FormControl fullWidth>
                <FormLabel>IP Address:</FormLabel>

                <TextField
                  type="text"
                  label="IP Address"
                  helperText="Ip device address"
                  value={ipAddress}
                  required={true}
                  onChange={handleIPAddressChange}
                />
              </FormControl>
              <Divider />
            </>
          )}

          {currentTab === 1 && (
            <>
              <FormLabel>Routes:</FormLabel>

              <CustomTable
                tableData={routeTableData}
                setTableData={setRouteTableData}
                columnsData={routesColumnData}
              />

              <Divider />
            </>
          )}

          {currentTab === 2 && (
            <>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
              >
                <FormControl fullWidth>
                  <FormLabel>Scan Exception list:</FormLabel>

                  <TextField
                    type="text"
                    label="Scan Exception"
                    helperText="These ip will not be reported inside daily network scan"
                    value={currentScanException}
                    required={false}
                    onChange={(event) => {
                      setCurrentScanException(event?.target?.value);
                    }}
                  />
                </FormControl>
                <Button variant="contained" onClick={handleAddScanException}>
                  Add
                </Button>
              </Stack>

              <TableContainer sx={{ maxHeight: 250, overflowY: "auto" }}>
                <Table stickyHeader aria-label="sticky table" size="small">
                  <TableBody>
                    {scanException &&
                      scanException.length !== 0 &&
                      scanException.map((row) => {
                        return (
                          <TableRow hover key={row}>
                            <TableCell align="center">{row}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="delete"
                                onClick={() => {
                                  handleDeleteScanException(row);
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
              <Divider />
            </>
          )}
          {currentTab !== 3 && <SaveButton />}
        </form>
      </Container>
    </ErrorCacher>
  );
}
