import React from 'react';
import Stack from "@mui/material/Stack"
import { gps_pos } from '../../types/hardwareTypes';
import { Title } from '../Common';


interface SysLocationProps {
    location: gps_pos;
}

const SysLocation: React.FC<SysLocationProps> = ({ location }) => {


    return (
        <Stack>
            <Title>
                System Location
            </Title>
            <div>
                LONG {location.longitude}
            </div>
            <div>
                LAT  {location.latitude}
            </div>
            <div>
                ALT  {location.altitude}
            </div>
        </Stack>
    )
}

export default SysLocation;