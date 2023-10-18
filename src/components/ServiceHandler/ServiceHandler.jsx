import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { useLocation } from "react-router-dom";
import { send_conf } from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import { useContext, useState } from "react";
import { Typography } from "@mui/material";
import { service_command_desc } from "../../utils/titles";
import { SnackbarContext } from "../../utils/context/SnackbarContext";

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
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
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
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Service command request OK`,
      });
    } catch{
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on Service command request`,
      });
    }
    finally {
      loaderContext[1](false);
      setServiceCommand(undefined);
    }
  };
  return (
    <FormControl>
      <Typography title={service_command_desc}>{serviceName && serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} service commands:</Typography>
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
