// Card for displaying and modifying system location. Also hosts clock.
// Matt Rossouw (omeh-a)
// 05/2022

import React from 'react';
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material"
import { gps_pos } from '../../types/hardwareTypes';
import Clock from './Clock';
interface SysLocationProps {
    location: gps_pos;
    setLocModal: (b: boolean) => void;
}

const SysLocation: React.FC<SysLocationProps> = ({ location, setLocModal }) => {


    return (
        <Grid>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="div">
                        System location
                    </Typography>
                    <Typography variant="body2">
                        Longitude: {location.longitude}°
                    </Typography>
                    <Typography variant="body2">
                        Latitude: {location.latitude}°
                    </Typography>
                    <Typography variant="body2">
                        Altitude: {location.altitude}°
                    </Typography>
                    <Clock/>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={(e) => { setLocModal(true) }}>
                        Set location
                    </Button>
                    <Button size="small">
                        Query GPS
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default SysLocation;