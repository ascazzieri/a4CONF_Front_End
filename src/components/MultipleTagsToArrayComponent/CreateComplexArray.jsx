import { useState, Fragment, useContext } from "react"
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Autocomplete, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import TagsSelectionDialog from "./TagsSelectionDialog"
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import CachedIcon from "@mui/icons-material/Cached";
import { loadChannels, get_device_tags } from "../../utils/api";
import { SnackbarContext } from "../../utils/context/SnackbarContext";
import { LoadingContext } from "../../utils/context/Loading";
import { getQueuePending } from "../../utils/utils";

const steps = ['Select a Kepware Channel', 'Choose a Device from the Channel Selected', 'Import only the tag you need'];

export default function MultipleTagsToArrayComponent(props) {

    const { channelList, setChannelList, setMemoryBasedList } = props

    const snackBarContext = useContext(SnackbarContext);
    const loadingContext = useContext(LoadingContext);

    //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
    const handleRequestFeedback = (newState) => {
        snackBarContext[1]({ ...newState, open: true });
    };


    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());

    /* const [channelList, setChannelList] = useState([]) */

    const [selectedChannel, setSelectedChannel] = useState()
    const [selectedDevice, setSelectedDevice] = useState()
    const [deviceTags, setDeviceTags] = useState()
    const [tagsSelectionDialog, setTagsSelectionDialog] = useState(false);

    const handleRefreshKepwareChannels = async () => {
        try {
            loadingContext[1](true);
            const kepwareChannels = await loadChannels();
            console.log("get kepware channels");

            if (kepwareChannels && Object.keys(kepwareChannels)?.length !== 0) {
                setChannelList(kepwareChannels)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "success",
                    message: `Kepware channels loaded`,
                });
            } else if (kepwareChannels && Object.keys(kepwareChannels)?.length === 0) {
                setChannelList(kepwareChannels)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `No Kepware Channel found`,
                });
            } else {
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `An error occurred during Kepware Channels loading`,
                });
            }
        } catch (e) {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred during Kepware Channels loading`,
            });
        } finally {
            if (getQueuePending() === 0) {
                loadingContext[1](false);
            }
        }


    }
    const handleStartBrowsing = async () => {
        try {
            loadingContext[1](true)
            const tags = await get_device_tags(selectedChannel, selectedDevice);
            if (tags) {
                setDeviceTags(tags);
                setTagsSelectionDialog(true);
            } else {
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `No Tags have been found`,
                });
            }
        } catch (e) {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred during tag browsing`,
            });
        } finally {
            if (getQueuePending() === 0) {
                loadingContext[1](false)
            }
        }
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

    return (
        <><h2>Create Complex Array tags </h2>
            {tagsSelectionDialog && (
                <TagsSelectionDialog
                    open={tagsSelectionDialog}
                    setOpen={setTagsSelectionDialog}
                    channel={selectedChannel}
                    device={selectedDevice}
                    tags={deviceTags}
                    setMemoryBasedList={setMemoryBasedList}
                />
            )}
            <Box sx={{ width: '100%' }}>
                <h3>Enclose multiple tags in a single Kepware array</h3>
                <h5 style={{color:'orange'}}>All the tags selected that will be put into the complex array must not be strings</h5>
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
                    <Button
                        onClick={handleRefreshKepwareChannels}
                        variant="outlined"
                        endIcon={<CachedIcon />}
                    >
                        Refresh Kepware channels
                    </Button>
                    <Typography sx={{ mt: 2, mb: 1 }}>Choose a Kepware channel from the droplist below</Typography>

                    <Autocomplete
                        id="kepware-channel"
                        value={selectedChannel || ""}
                        onChange={(event, newValue) => {
                            setSelectedChannel(newValue);
                        }}
                        style={{ minWidth: 150 }}
                        options={channelList ? Object?.keys(channelList) : []}
                        renderInput={(params) => (
                            <TextField {...params} label="Channels" />
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

                        <Button onClick={handleNext} disabled={!selectedChannel}>
                            {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </Fragment>}
                {activeStep === 1 && (<Fragment>
                    <Button
                        onClick={handleRefreshKepwareChannels}
                        variant="outlined"
                        endIcon={<CachedIcon />}
                    >
                        Refresh Kepware devices
                    </Button>
                    <Typography sx={{ mt: 2, mb: 1 }}>Choose a device belonging of channel: {selectedChannel} from the droplist below</Typography>
                    <Autocomplete
                        id="kepware-deviced"
                        value={selectedDevice || ""}
                        onChange={(event, newValue) => {
                            setSelectedDevice(newValue);
                        }}
                        style={{ minWidth: 150 }}
                        options={(channelList && selectedChannel) ? channelList[selectedChannel] : []}
                        renderInput={(params) => (
                            <TextField {...params} label="Devices" />
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
                        <Button onClick={handleNext} disabled={!selectedDevice}>
                            {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                        </Button>

                    </Box>
                </Fragment>)}
                {activeStep === 2 && (<Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Click the button below to start browsing tags for channel: {selectedChannel} of device: {selectedDevice}</Typography>
                    <Button
                        variant="contained"
                        endIcon={<SearchIcon />}
                        onClick={handleStartBrowsing}
                    >
                        Start browsing
                    </Button>
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

                        <Button onClick={handleNext} disabled={!deviceTags}>
                            {activeStep === steps?.length - 1 ? 'Finish' : 'Next'}
                        </Button>

                    </Box>
                </Fragment>)}

                {activeStep === steps?.length && (
                    <Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed! If you want to send complex array remeber to add it inside an IoT Gateway. You can easily use the section below for this purpose or you can click 'Reset' in order to create another one
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Return</Button>
                        </Box>
                    </Fragment>
                )}
            </Box>
        </>

    );
}