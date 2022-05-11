// Modal window for creating a new page
// Matthew Rossouw, @omeh-a (05/2022)
// # # #
// This window is responsible for retrieving location from hardware OR
// accepting a manually entered location.
// Note that acquiring from hardware is slow and we might like to consider
// implementing acquisition asynchronously.

import { Button, TextField } from '@mui/material';
import { gps_pos } from '../types/hardwareTypes';
import React from 'react';
import styled from 'styled-components';
import Stack from "@mui/material/Stack";
import { Container, Body } from './Common';
import { targetSat } from '../types/targetSat';
import { getTLE } from '../logic/backend_req';


const Field = styled.div`
    padding: 10px;
`

interface SelectTargProps {
    onSetTarget: (tar: targetSat) => void;
    setModalOpen: (b: boolean) => void;
    cursat: targetSat;
}

// Wrapper component ${props => props.color}
const SelectTargetModal: React.FC<SelectTargProps> = ({ onSetTarget, cursat, setModalOpen }) => {
    const [id, setId] = React.useState<number>(cursat.satid);
    const [name, setName] = React.useState<string>(cursat.name);
    const [intd, setIntd] = React.useState<string>(cursat.intDesignator);

    const handleSetTarget = () => {
        
        let response = await getTLE
        let n = {
            satid: id,
            name: name,
            intDesignator: intd,
        };
        onSetTarget(n);
        setModalOpen(false);
    }

    return (
        <Container>
            <Stack>
                <Body>
                    <Stack>
                        <Field>
                            <TextField label="NORAD ID" value={id} onChange={(e) => setId(parseInt(e.target.value))} />
                        </Field>
                    </Stack>
                </Body>
                <div style={{ margin: "auto", width: "60%", padding: "15px" }}>
                    <Button variant="outlined" color="secondary" onClick={handleSetTarget}>
                        Change target
                    </Button>
                </div>
            </Stack>
        </Container>
    )
}

export default SelectTargetModal;
