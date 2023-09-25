import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import { send_conf } from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import { useContext, useState } from "react";

export default function ServiceHandler() {
  const pathLocationServices = {
    "/external-pc/sitemanager": "sitemanager",
    "/external-pc/thingworx": "thingworx",
    "/external-pc/opcua-server": "opcua",
    "/external-pc/http-server": "http",
  };

  const loaderContext = useContext(LoadingContext);

  const location = useLocation().pathname;

  const pathValue = pathLocationServices[location];

  const handleChange = (event) => {
    const command = event.target.value;
    setServiceCommand(command)
    loaderContext[1](true);
    manageService(pathValue, command);
    loaderContext[1](false);
    setServiceCommand(undefined)
  };

  const [serviceCommand, setServiceCommand] = useState("");

  const manageService = async (service, cmd) => {
    const body = {};
    body["services"] = { [service]: cmd };
    await send_conf({ body });
  }
  return (
    <FormControl>
      <FormLabel >{pathValue && pathValue.charAt(0).toUpperCase() + pathValue.slice(1)} service commands</FormLabel>
      <RadioGroup
        row
        name="position"
        value={serviceCommand}
        onChange={handleChange}
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
          label="Restart" />
      </RadioGroup>
    </FormControl>

  );
}
