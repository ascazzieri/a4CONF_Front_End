import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Switch,
  Stack,
} from "@mui/material";
import {
  updateFirewallEnable,
  updateSitemanagerEnable,
  updateThingworxEnable,
  updateOPCServerEnable,
} from "../../utils/redux/reducers";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ width: 50 }} sx={{ p: 5 }}>
          <React.Fragment>{children}</React.Fragment>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const { tabsData, children, root } = props;

  const location = useLocation();
  const currentURLArray = location.pathname.split("/");

  const findMatchingIndex = (array1, array2) => {
    // Converto tutte le stringhe degli array in lowercase
    const array1Lower = array1.map((x) => x.toLowerCase());
    const array2Lower = array2.map((x) => x.toLowerCase());

    // Trovo gli elementi comuni tra i due array
    const commonElements = array1Lower.filter((x) => array2Lower.includes(x));

    // Se c'è un solo elemento comune, restituisco l'indice in entrambi gli array
    if (commonElements.length === 1) {
      const commonElement = commonElements[0];
      const indexArray1 = array1Lower.indexOf(commonElement);
      const indexArray2 = array2Lower.indexOf(commonElement);
      return [indexArray1, indexArray2];
    }

    // Altrimenti, restituisco null
    return undefined;
  };

  const valueIndex = findMatchingIndex(currentURLArray, tabsData);

  const [value, setValue] = React.useState(valueIndex ? valueIndex[1] : 0);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const routingTo = event.target.innerText.toLowerCase();
    navigate(`/${root}/${routingTo}`);
  };

  const handleFirewallChange = (event) => {
    console.log(event.target.checked);
    dispatch(updateFirewallEnable(event.target.checked));
  };

  const handleSitemanagerChange = (event) => {
    console.log(event.target.checked);
    dispatch(updateSitemanagerEnable(event.target.checked));
  };

  const handleThingworxChange = (event) => {
    console.log(event.target.checked);
    dispatch(updateThingworxEnable(event.target.checked));
  };

  const handleOPCServerChange = (event) => {
    console.log(event.target.checked);
    dispatch(updateOPCServerEnable(event.target.checked));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        pb: 2,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        /* style={{minWidth: 100}} */
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {tabsData.map((item, index) => (
          <Tab
            onChange={() => handleChange(index)}
            label={item}
            key={item + "tab"}
            {...a11yProps(index)}
            sx={{
              color: "white",
              backgroundColor: "transparent",
            }}
          />
        ))}
      </Tabs>

      {children}
    </Box>
  );
}
