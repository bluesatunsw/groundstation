import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Stack from "@mui/material/Stack"
import { Dialog, DialogContent, IconButton } from "@mui/material"
import type { gps_pos } from '../types/hardwareTypes';
import type { targetSat } from '../types/targetSat';
import TargetInfo from '../components/TargetInfo/TargetInfo';
import LocationModal from '../components/LocationModal';
import EncounterInfo from '../components/EncounterInfo/EncounterInfo';
import { n2yo_visual_passes, n2yo_radio_passes } from '../types/n2yotypes';

const SectionTitle = styled.div`
  font-size: x-large;
  margin: 2rem;
  font-weight: bold;
`

const Index: React.FC = () => {
    const [loc, setLoc] = useState<gps_pos>(default_pos);
    const [target, setTarget] = useState<targetSat>(default_sat);
    const [locModal, setLocModal] = useState(false);
    const [radioEncounter, setRe] = useState<n2yo_radio_passes>(default_radio_passes);
    const [visualEncounter, setVe] = useState<n2yo_visual_passes>(default_visual_passes);

    const whatsup = () => {

    }

    const findId = () => { }


    return (

        <div style={{ display: 'flex', float: "left", height: "100%" }}>
            <Sidebar onWhatsUp={whatsup} onFindId={findId} setModalOpen={setLocModal} location={loc} />
            <Dialog
                open={locModal}
                onClose={() => setLocModal(false)}
            >
                <DialogContent>
                    <LocationModal onSetLocation={setLoc} location={loc} setModalOpen={setLocModal} />
                </DialogContent>
            </Dialog>
            <Stack direction="row">
                <Stack>
                    <SectionTitle>
                        Target
                    </SectionTitle>
                    <TargetInfo sat={target} />
                    <EncounterInfo vp={visualEncounter} rp={radioEncounter} />
                </Stack>
                <Stack>
                    <SectionTitle>
                        System
                    </SectionTitle>
                    <Stack>
                        <div>
                            LONG {loc.longitude}
                        </div>
                        <div>
                            LAT  {loc.latitude}
                        </div>
                        <div>
                            ALT  {loc.altitude}
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        </div>
    )
}

// Default to Sydney, next to UNSW electrical engineering building
const default_pos: gps_pos = {
    latitude: "-33.918006",
    longitude: "151.231303",
    altitude: "36.72",
    valid: true
}

// Default to ISS Zarya
const default_sat: targetSat = {
    satid: 25544,
    name: "ISS (Zarya)",
    intDesignator: "1998-067A"
}

const default_visual_passes: n2yo_visual_passes = {
    startAz: 0,
    startAzCompass: "0",
    startEl: 0,
    startUTC: 0,
    maxAz: 0,
    maxAzCompass: "0",
    maxEl: 0,
    maxUTC: 0,
    endAz: 0,
    endAzCompass: "0",
    endEl: 0,
    endUTC: 0,
    mag: 0,
    duration: 0
}

const default_radio_passes: n2yo_radio_passes = {
    startAz: 0.0,
    startAzCompass: "0",
    startUTC: 0,
    maxAz: 0.0,
    maxAzCompass: "0",
    maxEl: 0.0,
    maxUTC: 0,
    endAz: 0.0,
    endAzCompass: "0",
    endUTC: 0
}

export default Index;