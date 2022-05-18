// Component responsible for trying to autoconnect
// to the backend, based on props set in BackendMonitor.tsx
// Matt Rossouw (omeh-a)
// 05/2022

import React, { useEffect } from 'react';
import { Stack, Typography } from "@mui/material"
import { Container } from '../../Common';
import { getStatus } from '../../../logic/backend_req'

interface Props {
    connected: boolean,
    setConnected: (connected: boolean) => void,
}

const BackendConnection: React.FC<Props> = (connected, setConnected) => {
    // Retry delay in milliseconds
    const [retry, setRetry] = React.useState(5000)

    const handleSetConnected = (connected : boolean) => {
        setConnected(connected)
    }

    // Visual countdown in seconds
    const [countdown, setCountdown] = React.useState(5)

    const tryConnect = async () => {
        let re = await getStatus()
        if (re != null) {
            handleSetConnected(true)
            setRetry(30000)
            setCountdown(30)
            console.log("Response from backend " + re)
        } else {
            setCountdown(5)
            console.log("No response from backend.")
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(countdown - 1)
            if (countdown <= 0) {
                tryConnect()
                setCountdown(5)
            }
        }, 1000)
        return () => clearInterval(timer)
    })

    return (
        <Stack>
            {/* Retry dialog */}
            <Stack sx={connected ? { visibility: 'visible' }
                : { visibility: 'hidden' }}>
                <Typography variant="h6" component="div">
                    Not connected. Retrying in {countdown} seconds.
                </Typography>
            </Stack>
            {/* Connection stats */}
            <Stack sx={!connected ? { visibility: 'visible' }
                : { visibility: 'hidden' }}>
                connected
            </Stack>
        </Stack>
    )
}

export default BackendConnection;