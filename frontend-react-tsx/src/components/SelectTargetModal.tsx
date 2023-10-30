// Modal window for creating a new page
// Matthew Rossouw, @omeh-a (05/2022)
// # # #
// This window is responsible for retrieving location from hardware OR
// accepting a manually entered location.
// Note that acquiring from hardware is slow and we might like to consider
// implementing acquisition asynchronously.

import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import Stack from "@mui/material/Stack";
import { Container, Body } from './Common';
import { targetSat } from '../../types/targetSat';
import { gps_pos } from '../../types/hardwareTypes';
import { getPositions } from '../logic/backend_req';


const Field = styled.div`
    padding: 10px;
`

interface SelectTargProps {
    onSetTarget: (tar: targetSat) => void;
    setModalOpen: (b: boolean) => void;
    cursat: targetSat;
    pos : gps_pos;
}

// Wrapper component ${props => props.color}
const SelectTargetModal: React.FC<SelectTargProps> = ({ onSetTarget, cursat, pos, setModalOpen }) => {
    const [id, setId] = React.useState<number>(cursat.satid);
    const [selected, setSelected] = React.useState<targetSat>(cursat);

    const handleSearchTarget = async () => {
        
        let response = await getPositions(id, pos, 1)
        let n = {
            satid: response.info.satid,
            name: response.info.satname,
            ra : response.positions[0].ra,
            dec : response.positions[0].dec,
            lat : response.positions[0].satlatitude,
            lon : response.positions[0].satlongitude,
            intDesignator: "",
        };
        setSelected(n)
    }

    const handleSetTarget = () => {
        onSetTarget(selected);
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
                        <Card sx={{minWidth: 250}}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {selected.name}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Right ascention {selected.ra}°
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Declination {selected.dec}°
                                </Typography>
                                <Typography variant="body2">
                                    Longitudinal base: {selected.lon}°
                                </Typography>
                                <Typography variant="body2">
                                    Latitudinal base: {selected.lat}°
                                </Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Body>
                <div style={{ margin: "auto", width: "60%", padding: "15px" }}>
                    <Button variant="outlined" color="secondary" onClick={handleSearchTarget}>
                        Search
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleSetTarget}>
                        Set as target
                    </Button>

                </div>
            </Stack>
        </Container>
    )
}

export default SelectTargetModal;
