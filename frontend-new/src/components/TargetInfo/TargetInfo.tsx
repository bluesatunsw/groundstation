// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import type { targetSat } from '../../types/targetSat';
import { Card, CardContent, Grid, Typography } from '@mui/material';


interface TargetInfoProps {
    sat: targetSat
}

const TargetInfo: React.FC<TargetInfoProps> = ({ sat }) => {
    return (
        <Grid>
            <Card sx={{ minWidth: 150 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {sat.name}
                    </Typography>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        NORAD ID {sat.satid}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Right ascention {sat.ra}°
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Declination {sat.dec}°
                    </Typography>
                    <Typography variant="body2">
                        Longitudinal base: {sat.lon}°
                    </Typography>
                    <Typography variant="body2">
                        Latitudinal base: {sat.lat}°
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default TargetInfo;