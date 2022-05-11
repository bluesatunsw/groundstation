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


const Field = styled.div`
    padding: 10px;
`

interface LocationModalProps {
    onSetLocation: (loc: gps_pos) => void;
    setModalOpen: (b: boolean) => void;
    location: gps_pos;
}

// Wrapper component ${props => props.color}
const LocationModal: React.FC<LocationModalProps> = ({ onSetLocation, location, setModalOpen }) => {
    const [lat, setLat] = React.useState<string>(location.latitude);
    const [lon, setLon] = React.useState<string>(location.longitude);
    const [alt, setAlt] = React.useState<string>(location.altitude);

    const handleSetLocation = () => {
        let n = {
            latitude: lat,
            longitude: lon,
            altitude: alt,
            valid: true
        };
        onSetLocation(n);
        setModalOpen(false);
    }

    return (
        <Container>
            <Stack>
                <Body>
                    <Stack>
                        <Field>
                            <TextField label="Latitude" value={lat} onChange={(e) => setLat(e.target.value)} />
                        </Field>
                        <Field>
                            <TextField label="Longitude" value={lon} onChange={(e) => setLon(e.target.value)} />
                        </Field>
                        <Field>
                            <TextField label="Altitude" value={alt} onChange={(e) => setAlt(e.target.value)} />
                        </Field>
                    </Stack>
                </Body>
                <div style={{ margin: "auto", width: "60%", padding: "15px" }}>
                    <Button variant="outlined" color="secondary" onClick={handleSetLocation}>
                        Change location
                    </Button>
                </div>
            </Stack>
        </Container>
    )
}

export default LocationModal;
