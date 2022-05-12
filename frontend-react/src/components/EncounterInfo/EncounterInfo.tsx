// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import { Card, CardContent, Typography } from "@mui/material"
import { n2yo_radio_passes, n2yo_visual_passes } from '../../types/n2yotypes';
import UTCtoD from '../../logic/utility';
import { Container } from '../Common';

interface EncounterInfoProps {
  vp: n2yo_visual_passes,
  rp: n2yo_radio_passes
}

const EncounterInfo: React.FC<EncounterInfoProps> = ({ vp, rp }) => {
  let rp_start: string = UTCtoD(rp.startUTC);
  let rp_end: string = UTCtoD(rp.endUTC);
  let rp_max: string = UTCtoD(rp.maxUTC);

  return (
    <Container>
      <Card sx={{ minWidth: 240 }} variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div">
            Encounter details
          </Typography>
          <Typography variant="body2">
            Encounter begins at {rp_start}, ends at {rp_end}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" style={{margin: "5px"}}>
            Radio Encounter
          </Typography>
          <Typography variant="body2">
            Az: {rp.startAz}° - {rp.endAz}°
          </Typography>
          <Typography variant="body2">
            Max Elevation {rp.maxEl}° at {rp_max}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" style={{margin: "5px"}}>
            Visual Encounter
          </Typography>
          <Typography variant="body2">
            From (Az {vp.startAz}°, El {vp.startEl}°)
          </Typography>
          <Typography variant="body2">
            To (Az {vp.endAz}°, El {vp.endEl}°)
          </Typography>
          <Typography variant="body2">
            Visible for {vp.duration} seconds at magnitude {vp.mag < 10000 ? vp.mag : '?' 
            /* 10000 only if the world is ending or n2yo doesn't know*/} brightness
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}

export default EncounterInfo;