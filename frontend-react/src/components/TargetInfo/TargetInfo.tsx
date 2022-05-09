// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import Stack from "@mui/material/Stack"

import type { targetSat } from '../../types/targetSat';

const Container = styled.div`
  width: 250px;
  background: #c6c6c6;
  height: 100%;
`

const TargetName = styled.div`
  font-size: large;
  margin: 2rem;
  font-weight: bold;
`

interface TargetInfoProps {
    sat : targetSat
}

const TargetInfo: React.FC<TargetInfoProps> = ({ sat }) => {
    return (
      <Container>
            <Stack>
                <TargetName>
                    Selected: {sat.name}
                </TargetName>
                <div>
                    int. ID  {sat.intDesignator}
                </div>
                <div>
                    NORAD ID {sat.satid}
                </div>
            </Stack>
      </Container>
    )
  }
  
  export default TargetInfo;