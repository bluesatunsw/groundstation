// Component responsible for displaying parameters for the backend, whether it is connected and state
//  of subsystems.
// Matt Rossouw (omeh-a)
// 05/2020

import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import BackendConnection from './BackendConnection';



interface Props {
    connected: boolean,
    setConnected: (connected: boolean) => void,
}

const BackendMonitor: React.FC<Props> = ({ connected, setConnected }) => {
    const [port, setPort] = React.useState<number>(4999);
    const acceptPort = (port: number) => {
        backend_setPort(port)
    }
    return (
        <Grid>
            {/* <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent> */}
                    <Stack>
                        <Typography variant="h6" component="div">
                            Backend status
                        </Typography>
                        <Typography variant="button">
                            {connected ? "Connected" : "Disconnected"}
                        </Typography>
                        <TextField type="number" label="Port" sx={{ marginTop: 2 }}
                            value={port} onChange={(e) => setPort(parseInt(e.target.value))} />
                        <Button onClick={(e) => {acceptPort(port)}}>
                            Update
                        </Button>
                        <BackendConnection connected={connected} setConnected={setConnected}/>
                    </Stack>
                {/* </CardContent>
            </Card> */}
        </Grid>
    )
}

export default BackendMonitor;

function backend_setPort(port: number) {
    throw new Error('Function not implemented.');
}
