// Monitor tab for tracking info
// Matt Rossouw (omeh-a)
// 10/2022

import { LinearProgress, Grid, Stack, TextField, Typography, Box, ButtonGroup, Button } from '@mui/material';
import React from 'react';
import { startEncounter, updateEncounter } from '../../../logic/backend_req';
import { track_status } from '../../../types/hardwareTypes';
import { n2yo_radio_passes } from '../../../types/n2yotypes';
import { targetSat } from '../../../types/targetSat';
import {default_radio_passes, default_sat} from '../../../pages/Home'

interface TrackingProps {
    target : targetSat,
    re: n2yo_radio_passes
}

const TrackingMonitor: React.FC<TrackingProps> = ({target, re}) => {
    const [refresh, setRefresh] = React.useState(false) // If true, poll backend for updates.
    const [progress, setProgress] = React.useState(0);
    const [buffer, setBuffer] = React.useState(10);
    const [trackStatus, setTrackStatus] = React.useState<track_status>(defaultTrackState)
    const progressRef = React.useRef(() => { });

    const tryTrack = async () => {
        let response = await startEncounter(target.satid)
        // Check if system reports good status
        if (response.status === "TRACKING") {
            setRefresh(true)
        }
        setTrackStatus(response)
    }
    
    // Update initial state of tracking display
    React.useEffect(() => {
        updateEncounter().then(res => res.json())
            .then(res => {setTrackStatus(res)})
    }, []) // Notice empty array here -> this means "no dependencies" and 
           // causes react to only run this useEffect on the first render

    // Update handler - if refresh is true poll backend
    React.useEffect(() => {
        if (refresh) {
            updateEncounter().then(res => res.json())
            .then(res => {setTrackStatus(res)})
        }
    }) // This will update every render, which will coincide with the clock element
       // which means 1 second update period.

    // // Buffer bar
    // React.useEffect(() => {
    //     progressRef.current = () => {
    //         if (progress > 100) {
    //             setProgress(0);
    //             setBuffer(10);
    //         } else {
    //             const diff = Math.random() * 10;
    //             const diff2 = Math.random() * 10;
    //             setProgress(progress + diff);
    //             setBuffer(progress + diff + diff2);
    //         }
    //     };
    // });

    // // Timer init
    // React.useEffect(() => {
    //     const timer = setInterval(() => {
    //         progressRef.current();
    //     }, 500);

    //     return () => {
    //         clearInterval(timer);
    //     };
    // }, []);

    return (
        <Grid>
            <Box sx={{margin: "15px"}}>
                <Typography variant="body2">
                    Tracking progress
                </Typography>
                {/* <LinearProgress sx={{margin: "5px"}} variant="buffer" value={progress} valueBuffer={buffer} /> */}
            </Box>
            <Box sx={{margin: "15px"}}>
                <Typography>
                    {trackStatus.status}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Typography variant="button">
                        Az: {trackStatus.az}°
                    </Typography>
                    <Typography variant="button">
                        El: {trackStatus.el}°
                    </Typography>
                    <Typography variant="button">
                        Current step: {trackStatus.curr_step}
                    </Typography>
                    {/* <Typography variant="button">
                        M2 TEMP: 43.5°
                    </Typography> */}
                </Stack>
                <Stack direction="row" sx={{margin: "15px"}}>
                    {target === default_sat ? <div>
                        <Button disabled variant="contained" color="success">
                            Start track
                        </Button>
                    </div> : <div>
                        <Button variant="contained" color="success" 
                        onClick={() => {
                            tryTrack()
                        }}>
                            Start track
                        </Button>
                    </div>}
                    <Button variant="contained" color="error">HALT</Button>
                    <Button variant="contained">Trim</Button>
                </Stack>
            </Box>
        </Grid>
    )
}

export default TrackingMonitor;

const defaultTrackState: track_status = {
    status: "Unknown",
    curr_step: -1,
    az: 0,
    el: 0
}