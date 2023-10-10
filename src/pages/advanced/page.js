
import Radio from "@mui/material/Radio";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { get_advanced } from "../../utils/api";
import { LoadingContext } from "../../utils/context/Loading";
import { useContext, useState } from "react";
import { Card, Container, Typography , Stack } from "@mui/material";
import ErrorCacher from "../../components/Errors/ErrorCacher";
import { SnackbarContext } from "../../utils/context/SnackbarContext";


export default function Advanced() {

  const loaderContext = useContext(LoadingContext);
  const [serviceCommand, setServiceCommand] = useState("");

  const handleChange = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommand(command)
    manageService(serviceName, command);
  };
  const snackBarContext = useContext(SnackbarContext);
  const handleRequestFeedback = (newState) => {
    snackBarContext[1]({ ...newState, open: true });
  };
  const manageService =  (service, cmd) => {
    
      loaderContext[1](true);
    (async () => {
    try {
      const response = await get_advanced(service,cmd)
      console.log(response);
      if(response){
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "success",
          message: `${cmd} ${service} service correctly`
        });
      }else{
        handleRequestFeedback({
          vertical: "bottom",
          horizontal: "right",
          severity: "error",
          message: `An error occurred on send command`,
        });
      }
    } catch (error) {
      console.error('Error during service handling', error);
    }finally {
      loaderContext[1](false);
      setServiceCommand(undefined);
    }
  })();
  
};
  return (
    <ErrorCacher>
    <Container sx={{ flexGrow: 1 }} disableGutters></Container>
    <Container sx={{ flexGrow: 1 }} disableGutters>
      <Card sx={{ mt: 1, p: 3 }}>
      <Card sx={{ mt: 1, p: 1 }}>
    <FormControl>
      <Typography>a4MONITOR service commands:</Typography>
      <RadioGroup
        row
        name="a4monitor"
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
    </Card>
    <Card sx={{ mt: 1, p: 1 }}>
    <FormControl>
      <Typography >Back channel service commands:</Typography>
      <RadioGroup
        row
        name="tf_bchnld"
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
    </Card>
    <Card sx={{ mt: 1, p: 1 }}>
    <FormControl>
      <Typography>Data transfer service commands:</Typography>
      <RadioGroup
        row
        name="tf_http_xfer"
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
    </Card>
    <Card sx={{ mt: 1, p: 1 }}>
    <FormControl>
      <Typography >Configuration service commands:</Typography>
      <RadioGroup
        row
        name="tf_cfgmng"
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
    </Card>
    <Card sx={{ mt: 1, p: 1 }}>
    <FormControl>
      <Typography >Broker service commands:</Typography>
      <RadioGroup
        row
        name="mosquitto"
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
    </Card>
</Card>
</Container>
</ErrorCacher>   
  );
}

