// Data logging dashboard section
// Matt Rossouw (omeh-a)
// 10/22

import React, { ReactFragment } from 'react';
import { Card, CardContent, Grid, Typography } from "@mui/material"

interface LoggingSubProps {

}

const LoggingSub: React.FC<LoggingSubProps> = () => {
    return (
        <Grid>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="div">
                        Logging
                    </Typography>
                    
                </CardContent>
            </Card>
        </Grid>
    )
}

export default LoggingSub;