// Encounter dashboard section
// Matt Rossouw (omeh-a)
// 10/22

import React from 'react';
import { Card, CardContent, Divider, Grid, Stack } from "@mui/material"
import { targetSat } from '../types/targetSat';
import { n2yo_radio_passes, n2yo_visual_passes } from '../types/n2yotypes';
import TargetInfo from '../components/TargetInfo/TargetInfo';
import EncounterInfo from '../components/EncounterInfo/EncounterInfo';

interface EncounterSubProps {
    sat: targetSat,
    vp: n2yo_visual_passes,
    rp: n2yo_radio_passes,
}

const EncounterSub: React.FC<EncounterSubProps> = ({sat, vp, rp}) => {
    return (
        <Grid sx={{height:"100%"}}>
            <Card sx={{ minWidth: 240, minHeight: 325 }} variant="outlined">
                <CardContent>
                    <Stack direction="row" spacing={2}>
                        <TargetInfo sat={sat} />
                        <Divider flexItem component="div" role="presentation" orientation="vertical"/>
                        <EncounterInfo vp={vp} rp={rp} />
                    </Stack>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default EncounterSub;