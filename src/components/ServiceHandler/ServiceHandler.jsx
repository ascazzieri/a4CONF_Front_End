import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Stack } from "@mui/material";
import { useLocation } from "react-router-dom";
import { send_conf } from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import { useContext , useState } from "react";

export default function ServiceHandler() {
  const pathLocationServices = {
    "/external-pc/sitemanager": "sitemanager",
    "/external-pc/thingworx": "thingworx",
    "/external-pc/opcua-server": "opcua",
    "/external-pc/http-server": "http",
  };

  const loaderContext = useContext(LoadingContext);
  console.log(loaderContext);

  const location = useLocation().pathname;
  console.log(location);

  const pathValue = pathLocationServices[location];
  console.log(pathValue);

  const handleChange = (event) => {
    const command = event.target.value;
    setServiceCommand(command)
    postJson(command);
    setServiceCommand(undefined)
  };

  const [serviceCommand, setServiceCommand] = useState("");

  function postJson(cmd) {
    const body = {};
    body["services"] = { [pathValue]: cmd };
    console.log(body);

    (async () => {
      try {
        loaderContext[1](true);
        await send_conf({ body });
      } catch (err) {
        console.log("Error occured when fetching books");
      }
    })();
    loaderContext[1](false);
  }
  return (
    <FormControl>
      <FormLabel >{pathValue} service commands</FormLabel>
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
