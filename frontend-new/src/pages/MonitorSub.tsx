// Hardware and network monitor dashboard section
// Matt Rossouw (omeh-a)
// 10/22

import React from 'react';
import { Card, CardContent, Grid, Stack } from "@mui/material"
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import BackendMonitor from '../components/SystemInfo/BackendMonitor/BackendMonitor';
import SysLocation from '../components/SystemInfo/SysLocation';
import { gps_pos } from '../types/hardwareTypes';

interface MonitorSubProps {
    location: gps_pos,
    setLocModal: (b: boolean) => void,
    connected: boolean,
    setConnected: (connected: boolean) => void,
}

const MonitorSub: React.FC<MonitorSubProps> = ({location, setLocModal, connected, setConnected}) => {
    const [tab, setTab] = React.useState('hardware')
    
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newTab: string,
      ) => {
        setTab(newTab);
      };
    
    return (
        <Grid>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Stack direction="row" spacing={2}>
                        <ToggleButtonGroup
                            color="primary"
                            value={tab}
                            exclusive
                            onChange={handleChange}
                            aria-label="Subsystem"
                            size="small"
                        >
                            <ToggleButton value="hardware">SYS</ToggleButton>
                            <ToggleButton value="tracking">TRACK</ToggleButton>
                            <ToggleButton value="radio">RADIO</ToggleButton>
                            <ToggleButton value="location">LOC</ToggleButton>
                            
                        </ToggleButtonGroup>
                        {/* <Typography variant="h6" component="div">
                            Monitor
                        </Typography> */}
                    </Stack>
                    {tab === 'hardware' && <BackendMonitor connected={connected} setConnected={setConnected}/>}
                    {/* {tab === 'radio' && <RadioMonitor />} */}
                    {tab === 'location' && <SysLocation location={location} setLocModal={setLocModal}/>}
                    
                </CardContent>
            </Card>
        </Grid>
    )
}

export default MonitorSub;