// Hardware and network monitor dashboard section
// Matt Rossouw (omeh-a)
// 10/22

import React, { ReactFragment } from 'react';
import { Card, CardContent, Grid, Typography } from "@mui/material"

interface MonitorSubProps {

}

const MonitorSub: React.FC<MonitorSubProps> = () => {
    return (
        <Grid>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="div">
                        Monitor
                    </Typography>
                    
                </CardContent>
            </Card>
        </Grid>
    )
}

export default MonitorSub;