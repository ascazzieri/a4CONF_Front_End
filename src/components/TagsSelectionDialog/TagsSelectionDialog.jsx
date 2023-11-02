import { useState, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TransferComponent from "./TransferComponent/TransferComponent"
import { SnackbarContext } from '../../utils/context/SnackbarContext';
import { createiotgw } from '../../utils/api';

export default function MaxWidthDialog(props) {
    const { open, setOpen, deviceName, provider, endPoint, machine_ID, folder, publishRate, scanRate, samplingTime, samplingNumberStartIndex, samplingNumber, tags } = props
    const channel = Object.keys(deviceName)?.toString()
    const device = deviceName[channel]
    const [iotGatewayCart, setIotGatewayCart] = useState([])

    const snackBarContext = useContext(SnackbarContext);

    //const { vertical, horizontal, severity, open, message } = snackBarContext[0];
    const handleRequestFeedback = (newState) => {
        snackBarContext[1]({ ...newState, open: true });
    };

    const handleClose = () => {
        setOpen(false);
    };
    const transformIotGatewayCart = (totalTagsList, channel, device) => {
        let spreadIoTCart = []

        const recursiveFunction = (data, parentPath) => {

            Object.keys(data).forEach((key) => {
                // If the item has "tags" property, it's a leaf node with no more nested items
                if (key === 'tags') {
                    Object.keys(data.tags).forEach((insideKey, insideIndex) => {
                        const currentPath = parentPath ? `${parentPath}.${insideKey}` : insideKey;
                        spreadIoTCart.push(currentPath)

                    }
                    );
                }

                // If the item has "groups" property, it's a parent node with nested items
                if (key === 'groups') {
                    Object.keys(data.groups).forEach((insideKey, insideIndex) => {
                        const currentPath = parentPath ? `${parentPath}.${insideKey}` : insideKey;
                        recursiveFunction(data.groups[insideKey], currentPath)
                    })
                }

            });
        }

        if (totalTagsList && Object.keys(totalTagsList).length !== 0) {
            recursiveFunction(totalTagsList);
        }

        return spreadIoTCart

    }

    const findMatches = (iotTags, totalTags) => {

        const finalShoppingList = []
        iotTags.forEach((element) => {
            const matches = totalTags.filter((item) => {
                if (item.startsWith(element + ".")) {
                    return true
                }
                if (item === element) {
                    return true
                }
            })
            finalShoppingList.push(...matches)
        })

        return finalShoppingList

    }

    const handleCreate = async (event) => {
        const totalTagList = transformIotGatewayCart(tags, channel, device)
        const finalTagList = findMatches(iotGatewayCart, totalTagList)
        const response = await createiotgw(
            provider,
            channel,
            device,
            endPoint,
            provider === "matrix" ? machine_ID : null, //folder for matrix
            provider === "matrix" ? folder : null, //folder for matrix
            provider === "matrix" ? publishRate : null, //publish rate for matrix
            provider === "matrix" ? scanRate : null, //scan rate for matrix 

            provider === "matrix" ? samplingTime : null, //sampling time for matrix
            provider === "matrix" ? samplingNumberStartIndex : null, //sampling time start index for matrix
            provider === "matrix" ? samplingNumber : null, //sampling number for matrix 
            finalTagList
        );
        let result = ""
        if (event?.target?.name === "twa") {
            result = "Thingworx";
        } else if (event?.target?.name === "opcua_from") {
            result = "OPCUA (Reading)";
        } else if (event?.target?.name === "opcua_to") {
            result = "OPCUA (Read and Write)";
        } else if (event?.target?.name === "http_from") {
            result = "HTTP (Read)";
        } else if (event?.target?.name === "http_to") {
            result = "HTTP (Read and Write)";
        } else if (event?.target?.name === "matrix") {
            result = "Matrix";
        }
        if (response?.iotgw && response?.time)
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `IoT gateway ${response.iotgw} of device: ${device} for ${result} has been created in ${response.time} s`,
            });
        else {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred during creation of Iot Gateway`,
            });
        }

    };

    return (
        <Fragment>
            <Dialog
                fullWidth={true}
                maxWidth='lg'
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>Tags browse for channel: {channel}, device: {device}{provider === 'twa' && `with endpoint: ${endPoint}`}{provider === "matrix" && `, machine id: ${machine_ID}, blob folder: ${folder}`} </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Choose which data you want to import from channel's device to IoT Gateway
                    </DialogContentText>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: '100%',
                        }}
                    >
                        <TransferComponent tags={tags} iotGatewayCart={iotGatewayCart} setIotGatewayCart={setIotGatewayCart} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button variant="outlined" disabled={iotGatewayCart.length === 0} onClick={handleCreate}>Create IoT Gateway</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}