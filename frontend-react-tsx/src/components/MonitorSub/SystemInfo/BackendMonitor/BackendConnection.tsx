// Component responsible for trying to autoconnect
// to the backend, based on props set in BackendMonitor.tsx
// Matt Rossouw (omeh-a)
// 05/2022

import React, { useEffect } from 'react'
import { Stack, Typography } from '@mui/material'
import { backend_status } from '../../../../../types/hardwareTypes'
import { getStatus } from '../../../../logic/backend_req'

interface Props {
  connected: boolean
  setConnected: (connected: boolean) => void
}

const BackendConnection: React.FC<Props> = ({ connected, setConnected }) => {
  // Visual countdown in seconds
  const [countdown, setCountdown] = React.useState<number>(5)
  const [backendState, setBackendState] = React.useState<backend_status>(default_connection_state)
  const tryConnect = async () => {
    let re = await getStatus()
    // If we get a response, set connection state and change polling delay to 30 seconds
    // to avoid flooding backend.
    if (re != null) {
      setConnected(true)
      setCountdown(30)
      setBackendState(re)
      console.log('Response from backend ' + re)
      console.log(backendState)
    } else {
      setCountdown(5)
      setConnected(false)
      console.log('No response from backend.')
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
      {/* Connection stats */}
      <Stack sx={connected ? { visibility: 'visible' } : { visibility: 'hidden' }}>
        {/* Note: this fields don't work for little to no reason. */}
        <Typography component="div">{'Backend ready'}</Typography>
        <Typography component="div">
          {backendState['hardware_rdy'] ? 'Hardware ready' : 'Hardware not ready'}
        </Typography>
      </Stack>
      {/* Retry dialog */}
      <Stack sx={!connected ? { visibility: 'visible' } : { visibility: 'hidden' }}>
        <Typography variant="h6" component="div">
          Not connected. Retrying in {countdown} seconds.
        </Typography>
      </Stack>
    </Stack>
  )
}

const default_connection_state: backend_status = {
  ready: true,
  hardware_rdy: false,
}

export default BackendConnection
