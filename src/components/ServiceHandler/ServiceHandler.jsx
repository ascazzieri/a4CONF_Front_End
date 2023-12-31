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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button
} from "@mui/material";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { getQueuePending } from "../../utils/utils";

export default function ServiceHandler() {

  const loaderContext = useContext(LoadingContext);

  const location = useLocation();
  const isFastData = location?.pathname?.split("/")[1] === "fast-data"
  const serviceName = location?.pathname?.split("/")[location?.pathname?.split("/").length - 1]

  const [serviceCommand, setServiceCommand] = useState("");



  const [sitemanagerDialogOpen, setSitemanaerDialogOpen] = useState(false);

  const handleStopSitemanager = async () => {
    try {
      loaderContext[1](true);
      const body = {
        services: {
          sitemanager: {
            command: 'stop'
          }
        }
      }
      await send_conf({ body });
    } catch (error) {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `Error during service handling, ${error}`,
      });
      // Gestisci l'errore come preferisci
    } finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }
      setServiceCommand(undefined);
    }
  };

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

    try {
      loaderContext[1](true);
      if (service === 'sitemanager' && cmd === 'stop') {
        setSitemanaerDialogOpen(true)
        return
      }
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
      await send_conf(body);
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "success",
        message: `Service command action successfull`,
      });
    } catch {
      handleRequestFeedback({
        vertical: "bottom",
        horizontal: "right",
        severity: "error",
        message: `An error occurred on Service command request`,
      });
    }
    finally {
      if (getQueuePending() === 0) {
        loaderContext[1](false);
      }

      setServiceCommand(undefined);
    }
  };
  const handleServiceClose = async () => {
    try {
      setSitemanaerDialogOpen(false)
    } catch (error) {
      console.error('Error during service handling', error);
      // Gestisci l'errore come preferisci
    } finally {
      loaderContext[1](false);
      setServiceCommand(undefined);
    }
  };
  return (<>
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
    <Dialog
      open={sitemanagerDialogOpen}
      onClose={() => setSitemanaerDialogOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to stop sitemanager service?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          If you are working on a4GATE remotely you will lose the connection for good until the service will be restart manually. If Sitemanager status is enabled it will be sufficient reboot a4GATE with the physical button.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleServiceClose}>Close</Button>
        <Button variant="contained" color="error" onClick={handleStopSitemanager} >
          Stop Sitemanager
        </Button>
      </DialogActions>
    </Dialog>
  </>

  );
}
