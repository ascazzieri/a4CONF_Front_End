import { useState, Fragment, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TransferComponent from "./TransferComponent/TransferComponent"
import { LoadingContext } from '../../utils/context/Loading';
import { SnackbarContext } from '../../utils/context/SnackbarContext';
import { multi_tags_to_array } from '../../utils/api';
import { getQueuePending } from '../../utils/utils';

export default function MaxWidthDialog(props) {
    const { open, setOpen, channel, device, tags, setMemoryBasedList } = props
    const [iotGatewayCart, setIotGatewayCart] = useState([])

    const snackBarContext = useContext(SnackbarContext);
    const loading = useContext(LoadingContext)

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
        try {
            const totalTagList = transformIotGatewayCart(tags, channel, device)
            const finalTagList = findMatches(iotGatewayCart, totalTagList)
            loading[1](true)
            const response = await multi_tags_to_array(channel, device, finalTagList)
            if (response) {
                setMemoryBasedList(response)
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "success",
                    message: `Complex array for channel: ${channel} of ${device} has been created correctly`,
                });
            }
            else {
                handleRequestFeedback({
                    vertical: "bottom",
                    horizontal: "right",
                    severity: "error",
                    message: `An error occurred during creation of complex array, please check Kepware configuration`,
                });
            }

            setOpen(false)
        } catch (e) {
            handleRequestFeedback({
                vertical: "bottom",
                horizontal: "right",
                severity: "error",
                message: `An error occurred during creation of complex array, please check Kepware configuration`,
            });
        } finally {
            if (getQueuePending() === 0) {
                loading[1](false)
            }
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
                        Choose which tags you want to add to complex array
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
                    <Button variant="outlined" disabled={iotGatewayCart.length === 0} onClick={handleCreate}>Create complex array</Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}