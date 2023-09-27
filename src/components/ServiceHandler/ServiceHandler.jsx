import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useLocation } from "react-router-dom";
import { send_conf } from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import { useContext, useState } from "react";
import { Typography } from "@mui/material";

export default function ServiceHandler() {

  const loaderContext = useContext(LoadingContext);

  const location = useLocation();
  const isFastData = location?.pathname?.split("/")[1] === "fast-data"
  const serviceName = location?.pathname?.split("/")[location?.pathname?.split("/").length - 1]

  const [serviceCommand, setServiceCommand] = useState("");

  const handleChange = (event) => {
    const command = event.target.value;
    setServiceCommand(command)
    manageService(serviceName, command);
  };


  const manageService = async (service, cmd) => {
    const middleFastDataKey = (service === 'ftp' || service === 'http') ? 'industrial' : null;

    const body = isFastData
      ? {
        services: {
          fastdata: {
            ...(middleFastDataKey ? { [middleFastDataKey]: { [service]: { command: cmd } } } : { command: cmd })
          }
        }
      }
      : {
        services: {
          [service]: {
            command: cmd
          }
        }
      };

    loaderContext[1](true);

    try {
      await send_conf({ body });
      console.log(body);
    } catch (error) {
      console.error('Error during service handling', error);
      // Gestisci l'errore come preferisci
    } finally {
      loaderContext[1](false);
      setServiceCommand(undefined);
    }
  };
  return (
    <FormControl>
      <Typography >{serviceName && serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} service commands:</Typography>
      <RadioGroup
        row
        name="position"
        value={serviceCommand || ""}
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
