import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './Home'
import { useWebsocket } from './Websocket';
import Plot from 'react-plotly.js';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import NavBar from './components/Navbar';
import { targetSat } from '../types/targetSat';
import { n2yo_get_radio_passes, n2yo_get_visual_passes, n2yo_radio_passes, n2yo_visual_passes } from '../types/n2yotypes';
import { getRadioPasses, getVisualPasses } from './logic/backend_req';
import { gps_pos } from '../types/hardwareTypes';


const App: React.FC = () => {

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
      const state = useWebsocket();
      const tsat = {  tle: "TEST SAT",
          name: "TEST SAT",
          norad_id: 1,
          ind_designator: "string",}
  
  
      const SelectSatellite = {satellite:tsat}
  
      const findId = () => { }

  const calcEncounter = async () => {
    let re: n2yo_get_radio_passes = await getRadioPasses(target.satid, parseFloat(loc.latitude),
        parseFloat(loc.longitude), parseFloat(loc.altitude));
    let ve: n2yo_get_visual_passes = await getVisualPasses(target.satid, parseFloat(loc.latitude),
        parseFloat(loc.longitude), parseFloat(loc.altitude));
    console.log(ve)
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

    if (ve.passes === undefined) {
        setVe(default_visual_passes);
        alert("No visual passes found.")
    } else {
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

    // Move monitor tab to show tracking info
    setMonitorTab('tracking');

    

}
  
  return (
    <div className="h-full min-h-full">
      <NavBar setWhatsUpModal={setWhatsUpModal} setTargetModal={setTargetModal} onCalcEn={calcEncounter}/>
      {/* <p>hello</p> */}
      {state === undefined && <p className='text-center'>State not yet initialised</p>}
      {state && <p className='text-center'>{`${JSON.stringify(state)}`}</p>}
      {<Home/>}
      {/* {<Plot
        data={[
          {
            x: [0, 90, 180, 270],
            y: [45, 30, -15, 30],
            type: 'scatter',
            mode: 'markers',
            // marker: {color: 'red'},
          },
          // {type:'bar', x:[1, 2, 3], y:[2, 5, 3]},
        ]}
        layout={{
          xaxis: {range: [0, 360]},
          yaxis: {range: [-90, 90]},
          width:720, height: 480, 
          title: 'A fancy plot',
        }}
      />} */}
    </div>

    // <div data-theme="corporate" className="App">
      // {/* <p>hello</p> */}
      // {state === undefined && <p>State not yet initialised</p>}
      // {state && <p>{`${JSON.stringify(state)}`}</p>}
      // {<Home/>}
      // {<Plot
      //   data={[
      //     {
      //       x: [0, 90, 180, 270],
      //       y: [45, 30, -15, 30],
      //       type: 'scatter',
      //       mode: 'markers',
      //       // marker: {color: 'red'},
      //     },
      //     // {type:'bar', x:[1, 2, 3], y:[2, 5, 3]},
      //   ]}
      //   layout={{
      //     xaxis: {range: [0, 360]},
      //     yaxis: {range: [-90, 90]},
      //     width:720, height: 480, 
      //     title: 'A fancy plot',
      //   }}
      // />}
    // </div>
  );
}
export default App;   


const default_sat: targetSat = {
  satid: 0,
  name: "No target",
  ra: 0,
  dec: 0,
  lat: 0,
  lon: 0,
  intDesignator: "",
}

// Default to Sydney, next to UNSW electrical engineering building
const default_pos: gps_pos = {
  latitude: "-33.918006",
  longitude: "151.231303",
  altitude: "36.72",
  valid: true
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