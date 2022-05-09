// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import styled from 'styled-components';
import Stack from "@mui/material/Stack"
import { n2yo_radio_passes, n2yo_visual_passes } from '../../types/n2yotypes';


const Container = styled.div`
  width: 250px;
  background: #b0becf;
  height: 100%;
`
const Title = styled.div`
  font-size: large;
  margin: 0.8rem;
  font-weight: bold;
`

const Subtitle = styled.div`
  font-size: medium;
  margin: 0.5rem;
  font-weight: bold;
`

const Param = styled.div`
  font-size: medium;
  margin: 0.5rem;
`

interface EncounterInfoProps {
    vp : n2yo_visual_passes,
    rp : n2yo_radio_passes
}

const EncounterInfo: React.FC<EncounterInfoProps> = ({ vp, rp }) => {
    return (
      <Container>
            <Stack>
                <Title>
                    Encounter details
                </Title>
                <Param>
                    Encounter begins at {rp.startUTC}, ends at {rp.endUTC}
                </Param>

                <Subtitle>
                  Radio encounter
                </Subtitle>
                <Param> 
                    Az: { rp.startAz }° - { rp.endAz }°
                </Param>
                <Param>
                    Max Elevation {rp.maxEl}° at {rp.maxUTC}
                </Param>
                
                <Subtitle>
                    Visual encounter
                </Subtitle>
                <Param>
                    ({vp.startAz}°, {vp.startEl}m) - ({vp.endAz}°, {vp.endEl}m)
                </Param>
                <Param>
                    Visible for {vp.duration} seconds at magnitude {vp.mag} brightness
                </Param>
            </Stack>
      </Container>
    )
  }
  
  export default EncounterInfo;