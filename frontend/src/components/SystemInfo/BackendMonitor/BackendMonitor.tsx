// Component responsible for displaying parameters for the backend, whether it is connected and state
//  of subsystems.
// Matt Rossouw (omeh-a)
// 05/2020

import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import { Container } from '../../Common';



interface Props {
    port: number,
    setPort: (n: number) => void,
    connected: boolean,
    setConnected: (connected: boolean) => void,
}

const BackendMonitor: React.FC<Props> = ({ port, setPort, connected, setConnected }) => {

    return (
        <Container>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Stack>
                        <Typography variant="h6" component="div">
                            Backend status
                        </Typography>
                        <Typography variant="button">
                            {connected ? "Connected" : "Disconnected"}
                        </Typography>
                        <TextField type="number" label="Port" sx={{ marginTop : 2 }}
                        value={port} onChange={(e) => setPort(parseInt(e.target.value))} />
                        <Button>
                            Update
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}

export default BackendMonitor;