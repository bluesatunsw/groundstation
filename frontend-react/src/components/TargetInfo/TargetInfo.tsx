// TargetInfo
// Segment responsible for displaying information about the targeted satellite
// Matt

import React from 'react';
import Stack from "@mui/material/Stack"
import { Container, Title } from '../Common';
import type { targetSat } from '../../types/targetSat';


interface TargetInfoProps {
    sat: targetSat
}

const TargetInfo: React.FC<TargetInfoProps> = ({ sat }) => {
    return (
        <Container>
            <Stack>
                <Title>
                    Selected: {sat.name}
                </Title>
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