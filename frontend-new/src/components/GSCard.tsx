// Card for display on the dashboard
// Matt Rossouw (omeh-a)
// 10/22

import React, { ReactFragment } from 'react';
import { Card, CardContent, Grid, Typography } from "@mui/material"

interface GSCardProps {
    title: string,
    content: ReactFragment,
}

const GSCard: React.FC<GSCardProps> = ({ title, content }) => {
    return (
        <Grid>
            <Card sx={{ minWidth: 240 }} variant="outlined">
                <CardContent>
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                    {content}
                </CardContent>
            </Card>
        </Grid>
    )
}

export default GSCard;