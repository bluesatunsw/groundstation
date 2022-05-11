import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar';
import Stack from "@mui/material/Stack"
import { Dialog, DialogContent } from "@mui/material"
import type { gps_pos } from '../types/hardwareTypes';
import type { targetSat } from '../types/targetSat';
import TargetInfo from '../components/TargetInfo/TargetInfo';
import LocationModal from '../components/LocationModal';
import EncounterInfo from '../components/EncounterInfo/EncounterInfo';
import { n2yo_visual_passes, n2yo_radio_passes } from '../types/n2yotypes';
import { getRadioPasses, getVisualPasses } from '../logic/backend_req';
import SysLocation from '../components/SystemInfo/SysLocation';
import SelectTargetModal from '../components/SelectTargetModal';

const SectionTitle = styled.div`
  font-size: x-large;
  margin: 2rem;
  font-weight: bold;
`

const Index: React.FC = () => {
    // Location state
    const [loc, setLoc] = useState<gps_pos>(default_pos);
    const [locModal, setLocModal] = useState(false);

    // Target state
    const [target, setTarget] = useState<targetSat>(default_sat);
    const [targetModal, setTargetModal] = useState(false);

    // Encounter state
    const [radioEncounter, setRe] = useState<n2yo_radio_passes>(default_radio_passes);
    const [visualEncounter, setVe] = useState<n2yo_visual_passes>(default_visual_passes);

    const whatsup = () => {

    }

    const findId = () => { }

    /// Get the radio and visual passes from backend and set props
    const calcEncounter = async () => {
        let re = await getRadioPasses(target.satid, parseFloat(loc.latitude),
            parseFloat(loc.longitude), parseFloat(loc.altitude));
        let ve = await getVisualPasses(target.satid, parseFloat(loc.latitude),
            parseFloat(loc.longitude), parseFloat(loc.altitude));

        setRe({
            startAz: re.passes[0].startAz,
            startAzCompass: re.passes[0].startAzCompass,
            startUTC: re.passes[0].startUTC,
            maxAz: re.passes[0].maxAz,
            maxAzCompass: re.passes[0].maxAzCompass,
            maxEl: re.passes[0].maxEl,
            maxUTC: re.passes[0].maxUTC,
            endAz: re.passes[0].endAz,
            endAzCompass: re.passes[0].endAzCompass,
            endUTC: re.passes[0].endUTC,
        })

        setVe({
            startAz: ve.passes[0].startAz,
            startAzCompass: ve.passes[0].startAzCompass,
            startEl: ve.passes[0].startEl,
            startUTC: ve.passes[0].startUTC,
            maxAz: ve.passes[0].maxAz,
            maxAzCompass: ve.passes[0].maxAzCompass,
            maxEl: ve.passes[0].maxEl,
            maxUTC: ve.passes[0].maxUTC,
            endAz: ve.passes[0].endAz,
            endAzCompass: ve.passes[0].endAzCompass,
            endEl: ve.passes[0].endEl,
            endUTC: ve.passes[0].endUTC,
            mag: ve.passes[0].mag,
            duration: ve.passes[0].duration,
        })

    }

    return (

        <div style={{ display: 'flex', float: "left", height: "100%" }}>
            <Sidebar onWhatsUp={whatsup} onFindId={findId} setLocModal={setLocModal} 
            setTargetModal={setTargetModal} onCalcEn={calcEncounter} />
            {/* Location selector modal */}
            <Dialog 
                open={locModal}
                onClose={() => setLocModal(false)}
            >
                <DialogContent>
                    <LocationModal onSetLocation={setLoc} location={loc} setModalOpen={setLocModal} />
                </DialogContent>
            </Dialog>

            {/* Target selector modal */}
            <Dialog
                open={targetModal}
                onClose={() => setTargetModal(false)}
            >
                <DialogContent>
                    <SelectTargetModal onSetTarget={setTarget} cursat={target} 
                    setModalOpen={setTargetModal} pos={loc} />
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
                    <SysLocation location={loc} />
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
    name: "No target",
    ra : 0,
    dec : 0,
    lat : 0,
    lon : 0,
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