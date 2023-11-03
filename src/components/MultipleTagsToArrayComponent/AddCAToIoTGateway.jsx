import { useState, useEffect, Fragment, useContext } from "react"
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Autocomplete, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { get_memory_based_tags, add_complex_arrays_to_iot_gateway, get_iot_gtws_http_client_enabled } from "../../utils/api";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { LoadingContext } from "../../utils/context/Loading";
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';

const steps = ['Choose the device', 'Select complex array tags', 'Select IoT Gateway', "Add Tags to the IoT Gateway selected"];

export default function AddCAToIoTGateway() {

    const snackBarContext = useContext(SnackbarContext);
    const loadingContext = useContext(LoadingContext);

    //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
    const handleRequestFeedback = (newState) => {
        snackBarContext[1]({ ...newState, open: true });
    };


    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [memoryBasedList, setMemoryBasedList] = useState([])
    const [iotGatewaysList, setIoTGatewaysList] = useState([])
    const [selectedDevice, setSelectedDevice] = useState()
    const [selectedIotGateway, setSelectedIoGateway] = useState("")
    const [complexArraysSelected, setComplexArraysSelected] = useState([])

    const [checked, setChecked] = useState([]);
    const [left, setLeft] = useState([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, complexArraysSelected);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setComplexArraysSelected(complexArraysSelected.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setComplexArraysSelected(not(complexArraysSelected, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => {
        if (memoryBasedList && selectedDevice && memoryBasedList[selectedDevice] && complexArraysSelected) {
            const filteredElements = memoryBasedList[selectedDevice].filter(
                element => !complexArraysSelected.includes(element)
            );

            setLeft(filteredElements);
        }

    }, [memoryBasedList, selectedDevice, complexArraysSelected])



    useEffect(() => {
        (async () => {
            loadingContext[1](true);
            const deviceMemoryBased = await get_memory_based_tags();
            const iotGateways = await get_iot_gtws_http_client_enabled()
            console.log("get kepware channels");

            if (iotGateways && iotGateways?.length !== 0) {
                setIoTGatewaysList(iotGateways)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "success",
                    message: `Kepware client IoT Gateway loaded correctly`,
                });
            } else if (iotGateways && iotGateways?.length === 0) {
                setIoTGatewaysList(iotGateways)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `No Kepware client IoT Gateway enabled found`
                })
            } else {
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `An error occurred on loading IoT Gateways from Kepware`
                })
            }


            if (deviceMemoryBased && Object.keys(deviceMemoryBased).length !== 0) {
                setMemoryBasedList(deviceMemoryBased)

                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "success",
                    message: `Kepware complex array devices loaded correctly`,
                });
            } else if (deviceMemoryBased && Object.keys(deviceMemoryBased).length === 0) {
                setMemoryBasedList(deviceMemoryBased)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `Kepware devices not found with complex arrays`,
                });
            } else {
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `An error occurred during Kepware complex array devices loading`,
                });
            }
            loadingContext[1](false);
        })();
    }, []);

    function not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }

    function intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }

    function union(a, b) {
        return [...a, ...not(b, a)];
    }

    const handleNext = () => {
        let newSkipped = skipped;
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const handleReset = () => {
        setActiveStep(0);
    };


    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    width: 200,
                    height: 230,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
            </List>
        </Card>
    );
    const handleAddTags = async () => {
        const response = await add_complex_arrays_to_iot_gateway(selectedIotGateway, selectedDevice, complexArraysSelected)
        if (response) {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `Complex array tags have been add to IoT Gateway ${selectedIotGateway} correctly`,
            });
        }
        else {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred while trying to add tags to iot gateway`
            })
        }
    }

    return (
        <><h2>Send Complex Array Tags</h2>
            <Box sx={{ width: '100%' }}>
                <h3>Add complex arrays tags to existing IoT Gateway in order to transfer them to the Data Sender</h3>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === 0 && <Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Choose the device from the memory based Kepware droplist below:</Typography>

                    <Autocomplete
                        id="kepware-channel"
                        value={selectedDevice || ""}
                        onChange={(event, newValue) => {
                            setSelectedDevice(newValue);
                        }}
                        style={{ minWidth: 150 }}
                        options={memoryBasedList && Object?.keys(memoryBasedList)}
                        renderInput={(params) => (
                            <TextField {...params} label="CA Devices" />
                        )}
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {selectedDevice && <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>}


                    </Box>
                </Fragment>}
                {activeStep === 1 && (<Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Choose which tags to import from device: {selectedDevice}</Typography>
                    <Grid container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item>{customList('Choices', left)}</Grid>
                        <Grid item>
                            <Grid container direction="column" alignItems="center">
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    sx={{ my: 0.5 }}
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item>{customList('Chosen', complexArraysSelected)}</Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {complexArraysSelected?.length !== 0 &&
                            <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>}
                    </Box>
                </Fragment>)}
                {activeStep === 2 && (<Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Choose an IoT Gateway from the droplist below in which to add: {complexArraysSelected?.toString()}</Typography>
                    <Autocomplete
                        id="kepware-channel"
                        value={selectedIotGateway || ""}
                        onChange={(event, newValue) => {
                            setSelectedIoGateway(newValue);
                        }}
                        style={{ minWidth: 150 }}
                        options={iotGatewaysList || []}
                        renderInput={(params) => (
                            <TextField {...params} label="IoT Gateways enabled" />
                        )}
                    />


                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />

                        {selectedIotGateway && <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>}
                    </Box>
                </Fragment>)}

                {activeStep === 3 && (
                    <Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Click the button below to add tags: {complexArraysSelected?.toString()} inside IoT Gateway: {selectedIotGateway}
                        </Typography>
                        <Button
                            variant="contained"
                            endIcon={<PlaylistAddIcon />}
                            onClick={handleAddTags}
                        >
                            Add Tags
                        </Button>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </Fragment>
                )}
            </Box>
        </>

    );
}