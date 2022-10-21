// Encounter map dashboard section
// Matt Rossouw (omeh-a)
// 10/22

import React from 'react';
import { Card, CardContent, Grid } from "@mui/material"
import { targetSat } from '../types/targetSat';
import Clock from '../components/SystemInfo/Clock';

interface MapSubProps {
    sat: targetSat,
}

const MapSub: React.FC<MapSubProps> = ({sat}) => {
    return (
        <Grid>
            <Card sx={{ minWidth: 240, minHeight: 300}} variant="outlined">
                <CardContent>
                    {/* <Typography variant="h6" component="div">
                        Map
                    </Typography> */}
                    <Clock/>
                    <div style={{display: 'flex', width: '100%', height: '100%'}}>
                        <iframe height="250" width="400" src={`https://www.n2yo.com/widgets/widget-tracker.php?s=${sat.satid}&size=small&all=1&me=0&map=0&foot=0`}/>
                    </div>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default MapSub;