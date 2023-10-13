
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
  const [serviceCommandA4monitor, setServiceCommandA4monitor] = useState("");
  const [serviceCommandBchnld , setServiceCommandBchnld] = useState("");
  const [serviceCommandDataTranfer , setServiceCommandDataTransfer] = useState("");
  const [serviceCommandConfiguration , setServiceCommandConfiguration] = useState("");
  const [serviceCommandBroker , setServiceCommandBroker] = useState("");

  const handleChangeA4monitor = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandA4monitor(command)
    manageService(serviceName, command);
    setServiceCommandA4monitor(undefined);
  };
  const handleChangeBchnld = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandBchnld(command)
    manageService(serviceName, command);
    setServiceCommandBchnld(undefined);
  };
  const handleChangeDataTranfer = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandDataTransfer(command)
    manageService(serviceName, command);
    setServiceCommandDataTransfer(undefined);
  };
  const handleChangeConfiguration = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandConfiguration(command)
    manageService(serviceName, command);
    setServiceCommandConfiguration(undefined);
  };
  const handleChangeBroker = (event) => {
    const command = event.target.value;
    const serviceName = event.target.name;
    setServiceCommandBroker(command)
    manageService(serviceName, command);
    setServiceCommandBroker(undefined);
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
        value={serviceCommandA4monitor}
        onChange={handleChangeA4monitor}
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
        value={serviceCommandBchnld}
        onChange={handleChangeBchnld}
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
        value={serviceCommandDataTranfer}
        onChange={handleChangeDataTranfer}
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
        value={serviceCommandConfiguration}
        onChange={handleChangeConfiguration}
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
        value={serviceCommandBroker}
        onChange={handleChangeBroker}
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

