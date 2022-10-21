import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Dialog, DialogContent, Divider, Snackbar } from "@mui/material"
import type { gps_pos } from '../types/hardwareTypes';
import type { targetSat } from '../types/targetSat';
import LocationModal from '../components/LocationModal';
import { n2yo_visual_passes, n2yo_radio_passes } from '../types/n2yotypes';
import { getRadioPasses, getVisualPasses } from '../logic/backend_req';
import SelectTargetModal from '../components/SelectTargetModal';
import WhatsUpModal from '../components/WhatsUpModal/WhatsUpModal';
import Grid from '@mui/material/Grid';
import EncounterSub from '../components/EncounterSub/EncounterSub';
import MapSub from '../components/MapSub/MapSub';
import MonitorSub from '../components/MonitorSub/MonitorSub';
import LogSub from '../components/LogSub/LogSub';


const Index: React.FC = () => {
    // Location state
    const [loc, setLoc] = useState<gps_pos>(default_pos);
    const [locModal, setLocModal] = useState(false);
    
    // Tab state - lives here so we can change tabs to draw user attention
    const [monitorTab, setMonitorTab] = React.useState('hardware')

    // Backend connection state
    const [beConnected, setBeConnected] = useState<boolean>(false);

    // Target state
    const [target, setTarget] = useState<targetSat>(default_sat);
    const [targetModal, setTargetModal] = useState(false);

    // Encounter state
    const [radioEncounter, setRe] = useState<n2yo_radio_passes>(default_radio_passes);
    const [visualEncounter, setVe] = useState<n2yo_visual_passes>(default_visual_passes);

    // What's up state
    const [whatsUpModal, setWhatsUpModal] = useState(false);

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

        // Move monitor tab to show tracking info
        setMonitorTab('tracking');

    }

    return (

        <div style={{ display: 'flex', height: "700px", width: "1200px" }}>
            <Snackbar
                open={!beConnected}
                message="Warning: backend is not connected or n2yo not reachable. Cannot interface with API." />

            {/* Location selector modal */}
            <Dialog
                open={locModal && beConnected}
                onClose={() => setLocModal(false)}
            >
                <DialogContent>
                    <LocationModal onSetLocation={setLoc} location={loc} setModalOpen={setLocModal} />
                </DialogContent>
            </Dialog>

            {/* Target selector modal */}
            <Dialog
                open={targetModal && beConnected}
                onClose={() => setTargetModal(false)}
                fullWidth={true}
            >
                <DialogContent>
                    <SelectTargetModal onSetTarget={setTarget} cursat={target}
                        setModalOpen={setTargetModal} pos={loc} />
                </DialogContent>
            </Dialog>

            {/* What's up modal */}
            <Dialog
                open={whatsUpModal && beConnected}
                onClose={() => setWhatsUpModal(false)}
                maxWidth={'sm'}
                fullWidth={true}
            >
                <DialogContent>
                    <WhatsUpModal setTarget={setTarget} target={target}
                        setModalOpen={setWhatsUpModal} location={loc} />
                </DialogContent>
            </Dialog>

            

            {/* Dashboard layout */}
            <Grid container spacing={1} xs={12} sx={{margin: "20px", width: "100%"}}>
                <Grid item xs={12}>
                    <Sidebar setWhatsUpModal={setWhatsUpModal} onFindId={findId}
                    setTargetModal={setTargetModal} onCalcEn={calcEncounter} />
                    <Divider sx={{margin: "10px"}}/>
                </Grid>
                <Grid item xs={8} sx={{height: "50%"}}>
                    <EncounterSub sat={target} vp={visualEncounter} rp={radioEncounter}/>
                </Grid>
                <Grid item xs={4} sx={{height: "50%"}}>
                    <MapSub sat={target}/>
                </Grid>
                <Grid item xs={8} sx={{height: "50%"}}>
                    <MonitorSub tab={monitorTab} setTab={setMonitorTab} connected={beConnected} setConnected={setBeConnected} location={loc} setLocModal={setLocModal}/>
                </Grid>
                <Grid item xs={4} sx={{height: "50%"}}>
                    <LogSub/>
                </Grid>
            </Grid>
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


const default_sat: targetSat = {
    satid: 0,
    name: "No target",
    ra: 0,
    dec: 0,
    lat: 0,
    lon: 0,
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