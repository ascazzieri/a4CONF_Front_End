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

    console.log(tags)
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

    console.log(channelCart)

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList('Choices')}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={() => { setIotGatewayCart((prevState) => [...prevState, ...channelCart]) }}
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