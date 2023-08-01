import { useState, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TransferComponent from "./TransferComponent/TransferComponent"
import AntdBrowseTags from "./TransferComponent/AntdBrowseTags"
import Treeview from "./TransferComponent/TreeView/Treeview"
import { SnackbarContext } from '../../utils/context/SnackbarContext';
import { createiotgw } from '../../utils/api';

export default function MaxWidthDialog(props) {
    const { open, setOpen, deviceName, provider, endPoint, tags } = props
    const channel = Object.keys(deviceName)
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

        console.log(finalShoppingList)
        return finalShoppingList

    }

    const handleCreate = async (event) => {
        const totalTagList = transformIotGatewayCart(tags, channel, device)
        console.log(totalTagList)
        console.log(iotGatewayCart)
        const finalTagList = findMatches(iotGatewayCart, totalTagList)
        const response = await createiotgw(
            provider,
            channel,
            device,
            endPoint,
            finalTagList
        );
        if (response?.iotgw && response?.time && response?.thing_name)
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "success",
                message: `IoT gateway ${response.iotgw} of device: ${device} for ${provider === "twa"
                    ? "Thingworx"
                    : provider === "opcua_from"
                        ? "OPCUA (reading)"
                        : "OPCUA (writing)"
                    } has been created in ${response.time} s`,
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
                <DialogTitle>Tags browse for channel: {channel}, device: {device}</DialogTitle>
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
                        {/* <AntdBrowseTags /> */}
                        {/* <Treeview tags={tags} /> */}
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