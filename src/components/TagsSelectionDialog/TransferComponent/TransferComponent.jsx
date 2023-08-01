import { useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import TreeView from './TreeView/Treeview';
import IoTGatewayList from "./IoTGatewayList/IoTGatewayList"
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';


export default function SelectAllTransferList(props) {

    const { tags, iotGatewayCart, setIotGatewayCart } = props

    const [channelCart, setChannelCart] = useState([])

    const customList = (title) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                title={title === 'Choices' ? "Channel" : "IoT Gateway"}
            />
            <Divider />

            <List
                sx={{
                    width: 450,
                    height: 350,
                    bgcolor: 'background.paper',
                    overflow: 'auto'
                }}
                dense
                component="div"
                role="list"
            >
                {title === 'Choices' && <TreeView tags={tags} channelCart={channelCart} setChannelCart={setChannelCart} />}
                {title === 'Chosen' && <IoTGatewayList iotGatewayCart={iotGatewayCart} setIotGatewayCart={setIotGatewayCart} />}

            </List>
        </Card>
    );

    const filterImplicitComponents = (array) => {
        const inputArray = [...new Set(array)];
        const shallowArray = [...inputArray];

        for (let i = inputArray.length - 1; i >= 0; i--) {
            const element = inputArray[i];
            const part = element.split('.');
            const lastLeaf = part[part.length - 1];
            //console.log("element: " + element)
            //console.log("last leaf: " + lastLeaf)

            for (let j = 0; j < inputArray.length; j++) {
                if (i !== j) {
                    const item = inputArray[j];
                    //console.log("item: " + item)
                    const splittedItem = item.split('.');
                    for (let k = 0; k < splittedItem.length - 1; k++) {

                        if (splittedItem[k] === lastLeaf) {
                            //console.log(splittedItem[k] + " uguale a: " + lastLeaf + ", cancello: " + shallowArray[shallowArray.indexOf(item)])
                            shallowArray.splice(shallowArray.indexOf(item), 1)
                        } else {
                            //console.log(splittedItem[k] + " diverso da: " + lastLeaf)
                        }
                    }
                }
            }
        }

        return shallowArray;
    };


    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList('Choices')}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={() => { setIotGatewayCart((prevState) => filterImplicitComponents([...prevState, ...channelCart])) }}
                        disabled={channelCart.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Chosen')}</Grid>
        </Grid>
    );
}