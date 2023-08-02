import React, { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateThingworx } from "../../../utils/redux/reducers";
import { loadiotgws } from "../../../utils/api";
import SecondaryNavbar from "../../../components/SecondaryNavbar/SecondaryNavbar";
import { JSONTree } from "react-json-tree";
import Table from "../../../components/Table/Table";
import { SnackbarContext } from "../../../utils/context/SnackbarContext";
import { LoadingContext } from "../../../utils/context/Loading";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  InputAdornment,
  TextField,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Stack,
  MenuItem,
  Typography,
  InputBase,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import {
  Visibility,
  VisibilityOff,
  ThumbUpOffAltOutlined,
  ThumbDownAltOutlined,
  CloudUploadOutlined,
} from "@mui/icons-material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const HighlightedText = styled("span")({
  background: "#7F899E",
  fontWeight: "bold",
});

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Thingworx() {
  const thingworx = useSelector((state) => state.services?.thingworx);

  const dispatch = useDispatch();

  const snackBarContext = useContext(SnackbarContext);

  const loaderContext = useContext(LoadingContext);

  //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };

  const [currentTab, setCurrentTab] = useState(0);
  const navbarItems = ["Connection", "Remote Things", "Agent Logs", "JSON"];

  const getArrayFromThingObject = (thingObject) => {
    let arrayFromThingsObject = [];

    Object.keys(thingObject).map((item, index) =>
      arrayFromThingsObject.push({
        iot_gateway: Object.keys(thingObject[`${item}`])[0],
        thing_name: item,
      })
    );

    return arrayFromThingsObject;
  };

  const [thingworxHost, setThingworxHost] = useState(thingworx?.host);
  const [thingworxAppkey, setThingworxAppkey] = useState(thingworx?.appkey);
  const [iotGatewaysList, setIotGatewaysList] = useState({});
  const [iotGateway, setIotGateway] = useState();
  const [thingsTableData, setThingsTableData] = useState(
    getArrayFromThingObject(thingworx?.things)
  );
  const [agentConnection, setAgentConnection] = useState(true);

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const highlightText = (text, search) => {
    const regex = new RegExp(`(${search})`, "gi");
    return text.split(regex).map((word, index) => {
      if (word.toLowerCase() === search.toLowerCase()) {
        return <HighlightedText key={index}>{word}</HighlightedText>;
      }
      return word;
    });
  };

  const highlightedContent = highlightText(
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde fugit veniam eius, perspiciatis sunt? Corporis qui ducimus quibusdam, aliquam dolore excepturi quae. Distinctio enim at eligendi perferendis in cum quibusdam sed quae, accusantium et aperiam? Quod itaque exercitationem, at ab sequi qui modi delectus quia corrupti alias distinctio nostrum. Minima ex dolor modi inventore sapiente necessitatibus aliquam fuga et. Sed numquam quibusdam at officia sapiente porro maxime corrupti perspiciatis asperiores, exercitationem eius nostrum consequuntur iure aliquam itaque, assumenda et! Quibusdam temporibus beatae doloremque voluptatum doloribus soluta accusamus porro reprehenderit eos inventore facere, fugit, molestiae ab officiis illo voluptates recusandae. Vel dolor nobis eius, ratione atque soluta, aliquam fugit qui iste architecto perspiciatis. Nobis, voluptatem! Cumque, eligendi unde aliquid minus quis sit debitis obcaecati error, delectus quo eius exercitationem tempore. Delectus sapiente, provident corporis dolorum quibusdam aut beatae repellendus est labore quisquam praesentium repudiandae non vel laboriosam quo ab perferendis velit ipsa deleniti modi! Ipsam, illo quod. Nesciunt commodi nihil corrupti cum non fugiat praesentium doloremque architecto laborum aliquid. Quae, maxime recusandae? Eveniet dolore molestiae dicta blanditiis est expedita eius debitis cupiditate porro sed aspernatur quidem, repellat nihil quasi praesentium quia eos, quibusdam provident. Incidunt tempore vel placeat voluptate iure labore, repellendus beatae quia unde est aliquid dolor molestias libero. Reiciendis similique exercitationem consequatur, nobis placeat illo laudantium! Enim perferendis nulla soluta magni error, provident repellat similique cupiditate ipsam, et tempore cumque quod! Qui, iure suscipit tempora unde rerum autem saepe nisi vel cupiditate iusto. Illum, corrupti? Fugiat quidem accusantium nulla. Aliquid inventore commodi reprehenderit rerum reiciendis! Quidem alias repudiandae eaque eveniet cumque nihil aliquam in expedita, impedit quas ipsum nesciunt ipsa ullam consequuntur dignissimos numquam at nisi porro a, quaerat rem repellendus. Voluptates perspiciatis, in pariatur impedit, nam facilis libero dolorem dolores sunt inventore perferendis, aut sapiente modi nesciunt.`,
    searchText === " " ? "" : searchText
  );

  const [showAppkey, setShowAppkey] = useState(false);
  const handleClickShowPassword = () => setShowAppkey((show) => !show);

  useEffect(() => {
    (async () => {
      loaderContext[1](true);
      const iotGateways = await loadiotgws("from");
      console.log("get IoT gateways");
      if (iotGateways && Object.keys(iotGateways).length !== 0) {
        setIotGatewaysList(iotGateways);
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `Kepware IoT gateways loaded`,
        });
      } else if (iotGateways && !Object.keys(iotGateways).length === 0) {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `Kepware IoT gateways not found`,
        });
      } else {
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred during Kepware IoT Gateways loading`,
        });
      }
      loaderContext[1](false);
    })();
  }, []);

  const handleSentinelHostChange = (event) => {
    setThingworxHost(event?.target?.value);
  };
  const handleAppkeyChange = (event) => {
    setThingworxAppkey(event?.target?.value);
  };
  const handleIotGatewaysChange = (event) => {
    setIotGateway(event?.target?.value);
  };

  const handleIotGatewaysReloadChange = async () => {
    loaderContext[1](true);
    const iotGateways = await loadiotgws("from");
    console.log("get IoT gateways");
    if (iotGateways && Object.keys(iotGateways).length !== 0) {
      setIotGatewaysList(iotGateways);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Kepware IoT gateways loaded`,
      });
    } else if (iotGateways && !Object.keys(iotGateways).length === 0) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Kepware IoT gateways not found`,
      });
    } else {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred during Kepware IoT Gateways loading`,
      });
    }
    loaderContext[1](false);
  };

  const handleThingworxChange = (event) => {
    event.preventDefault();

    let thingsTWX = {};

    thingsTableData.map(
      (item, index) =>
        (thingsTWX[`${item?.thing_name}`] = {
          [`${item?.iot_gateway}`]: `fromkepware/${item?.thing_name}`,
        })
    );

    const newThingworx = {
      host: thingworxHost,
      appkey: thingworxAppkey,
      enabled: true,
      things: thingsTWX || {},
    };
    dispatch(updateThingworx({ newThingworx }));
  };

  const thingsColumnData = [
    {
      accessorKey: "iot_gateway",
      header: "IoT Gateway",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
    {
      accessorKey: "thing_name",
      header: "Remote Thing Name",
      enableColumnOrdering: true,
      enableEditing: true, //disable editing on this column
      enableSorting: true,
    },
  ];
  function extractThingName(inputString) {
    const startIndex = inputString.indexOf("thingName=");
    if (startIndex !== -1) {
      const extractedString = inputString.substring(startIndex + 10); // La lunghezza di "thingName=" è 10
      return extractedString;
    }
    return ""; // Restituisce una stringa vuota se "thingName=" non è presente nella stringa di input
  }

  const handleAddRemoteThing = () => {
    setThingsTableData((prevData) => [
      ...prevData,
      {
        iot_gateway: iotGateway,
        thing_name: extractThingName(iotGatewaysList[`${iotGateway}`]),
      },
    ]);
  };

  return (
    <Container>
      <h2>Thingworx</h2>
      <SecondaryNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        navbarItems={navbarItems}
      />
      {currentTab === 3 && <JSONTree data={thingworx} />}

      <form onSubmit={handleThingworxChange}>
        {currentTab === 0 && (
          <>
            <FormControl fullWidth>
              <FormLabel>IP Address:</FormLabel>

              <TextField
                type="text"
                label="Host"
                helperText="Sentinel server endpoint"
                defaultValue={thingworxHost}
                required={true}
                onChange={handleSentinelHostChange}
              />
            </FormControl>
            <Divider />

            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Appkey *
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showAppkey ? "text" : "password"}
                required={true}
                defaultValue={thingworxAppkey}
                onChange={handleAppkeyChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onMouseDown={handleClickShowPassword}
                      onMouseUp={handleClickShowPassword}
                      edge="end"
                    >
                      {showAppkey ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              <FormHelperText id="outlined-weight-helper-text">
                Unique string Sentinel authentication
              </FormHelperText>
            </FormControl>
            <Divider />
          </>
        )}
        {currentTab === 1 && (
          <>
            <FormLabel>Connect a Local Thing to a Remote Thing</FormLabel>
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              alignItems="center"
            >
              <FormControl fullWidth>
                <TextField
                  select
                  label="Choose iot gateway from Kepware"
                  defaultValue=""
                  onChange={handleIotGatewaysChange}
                >
                  {iotGatewaysList &&
                    Object.keys(iotGatewaysList).length !== 0 &&
                    Object.keys(iotGatewaysList)
                      .filter((element) => element.startsWith("HTTP"))
                      .map((item) => {
                        return (
                          <MenuItem key={Math.random() + item} value={item}>
                            {item}
                          </MenuItem>
                        );
                      })}
                </TextField>
              </FormControl>
              <IconButton
                onClick={handleIotGatewaysReloadChange}
                aria-label="reload"
                className="rotate-on-hover"
              >
                <CachedIcon />
              </IconButton>
              {/* <FormControl fullWidth>
                <TextField
                  select
                  label="Choose Thing name"
                  helperText="Select a Thing name from your local list"
                  defaultValue=""
                  onChange={handleThingNamesChange}
                >
                  {thing_names.map((item) => {
                    return (
                      <MenuItem key={Math.random() + item} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </FormControl> */}
              <Button onClick={handleAddRemoteThing} variant="contained">
                Add
              </Button>
            </Stack>

            <FormLabel>Remote Things configuration</FormLabel>

            <Table
              tableData={thingsTableData}
              setTableData={setThingsTableData}
              columnsData={thingsColumnData}
            />

            <Divider />
          </>
        )}
        {currentTab === 2 && (
          <>
            <Box sx={{ flexGrow: 1 }}>
              <FormLabel>Thingworx agent logs:</FormLabel>
              <AppBar position="static" sx={{ background: "#1F293F" }}>
                <Toolbar>
                  <Button variant="contained" endIcon={<CloudUploadOutlined />}>
                    Test connection
                  </Button>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ ml: 2 }}
                  >
                    {agentConnection ? (
                      <ThumbUpOffAltOutlined color="success" />
                    ) : (
                      <ThumbDownAltOutlined color="error" />
                    )}
                  </IconButton>
                  <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
                  ></Typography>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="Search…"
                      inputProps={{ "aria-label": "search" }}
                      value={searchText}
                      onChange={handleSearch}
                    />
                  </Search>
                </Toolbar>
                <Box component="main" sx={{ p: 3 }}>
                  <Typography>{highlightedContent}</Typography>
                </Box>
              </AppBar>
            </Box>
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
