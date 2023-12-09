import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, Divider, Grid } from '@mui/material'
import type { gps_pos } from '../types/hardwareTypes'
import type { targetSat } from '../types/targetSat'
import {
  n2yo_visual_passes,
  n2yo_radio_passes,
  n2yo_get_visual_passes,
  n2yo_get_radio_passes,
} from '../types/n2yotypes'
import { useWebsocket } from './Websocket'
import WhatsUpModal from './components/WhatsUpModal/WhatsUpModal'
import EncounterSub from './components/EncounterSub/EncounterSub'
import MonitorSub from './components/MonitorSub/MonitorSub'
import SideBar from './components/Sidebar'
import { getRadioPasses, getVisualPasses } from './logic/backend_req'
import 'leaflet/dist/leaflet.css'
import Map, { GroundStation } from './components/MapComponent'
import { LatLngExpression, LatLngLiteral } from 'leaflet'
import { Debug } from './components/Debug2'

const Index: React.FC = () => {
  // Location state
  const [loc, setLoc] = useState<gps_pos>(default_pos)
  const [locModal, setLocModal] = useState(false)

  // Tab state - lives here so we can change tabs to draw user attention
  const [monitorTab, setMonitorTab] = React.useState('hardware')

  // Backend connection state
  const [beConnected, setBeConnected] = useState<boolean>(false)

  // Target state
  const [target, setTarget] = useState<targetSat>(default_sat)
  const [targetModal, setTargetModal] = useState(false)

  // Encounter state
  const [radioEncounter, setRe] = useState<n2yo_radio_passes>(default_radio_passes)
  const [visualEncounter, setVe] = useState<n2yo_visual_passes>(default_visual_passes)

  // What's up state
  const [whatsUpModal, setWhatsUpModal] = useState(false)
  const state = useWebsocket()

  if (state && beConnected !== true) {
    setBeConnected(true)
  } else if (!state && beConnected === true) {
    setBeConnected(false)
  }

  const tsat = { tle: 'TEST SAT', name: 'TEST SAT', norad_id: 1, ind_designator: 'string' }

  const SelectSatellite = { satellite: tsat }

  const findId = () => {}

  /// Get the radio and visual passes from backend and set props
  const calcEncounter = async () => {
    let re: n2yo_get_radio_passes = await getRadioPasses(
      target.satid,
      parseFloat(loc.latitude),
      parseFloat(loc.longitude),
      parseFloat(loc.altitude)
    )
    let ve: n2yo_get_visual_passes = await getVisualPasses(
      target.satid,
      parseFloat(loc.latitude),
      parseFloat(loc.longitude),
      parseFloat(loc.altitude)
    )
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
      setVe(default_visual_passes)
      alert('No visual passes found.')
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
    setMonitorTab('tracking')
  }

  const groundstationsList: GroundStation[] = [
    {
      name: 'UNSW BlueSat',
      lat: -33.918006,
      lon: 151.231303,
    },
  ]

  const [satList, setSatList] = useState<LatLngExpression[][]>()

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetch(`http://api.open-notify.org/iss-now.json`)
        .then((response) => response.json())
        .then((data) => {
          const val = data.iss_position
          setSatList({ satList, ...val })
          console.debug('final', satList)
        })
        .catch((error) => console.error(error))
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [satList])

  return (
    <div className="flex justify-center px-[600px]  ">
      {/* <div>{state && `${JSON.stringify(state)}`}</div> */}
      {/* 
            export interface UpdateStation {
                name: String,
                status: GroundStation,
            }

            export interface SelectSatellite {
                satellite: Satellite,
            } */}

      {/* <button onPress={sendAction(SelectSatellite)}>SEND TEST REQUEST</button> */}

      {/* <Snackbar
        open={!beConnected}
        message="Warning: backend is not connected or n2yo not reachable. Cannot interface with API."
      /> */}

      {!beConnected ? (
        <div className="toast toast-start">
          <div className="alert alert-info bg-warning">
            <span>Warning: backend is not connected or n2yo not reachable. Cannot interface with API.</span>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Location selector modal */}
      {/* <Dialog
                open={locModal && beConnected}
                onClose={() => setLocModal(false)}
            >
                <DialogContent>
                    <LocationModal onSetLocation={setLoc} location={loc} setModalOpen={setLocModal} />
                </DialogContent>
            </Dialog> */}

      {/* Target selector modal */}
      {/* <Dialog
                open={targetModal && beConnected}
                onClose={() => setTargetModal(false)}
                fullWidth={true}
            >
                <DialogContent>
                    <SelectTargetModal onSetTarget={setTarget} cursat={target}
                        setModalOpen={setTargetModal} pos={loc} />
                </DialogContent>
            </Dialog> */}

      {/* What's up modal */}
      <Dialog
        open={whatsUpModal && beConnected}
        onClose={() => setWhatsUpModal(false)}
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogContent>
          <WhatsUpModal setTarget={setTarget} target={target} setModalOpen={setWhatsUpModal} location={loc} />
        </DialogContent>
      </Dialog>

      {/* Dashboard layout */}

      {/* <Grid container spacing={1} xs={12} sx={{ margin: '20px', width: '100%' }}>
        <Grid item xs={12}>
          <SideBar
            setWhatsUpModal={setWhatsUpModal}
            onFindId={findId}
            setTargetModal={setTargetModal}
            onCalcEn={calcEncounter}
          />
          <Divider sx={{ margin: '10px' }} />
        </Grid>
        <Grid item xs={8} sx={{ height: '50%' }}>
          <EncounterSub sat={target} vp={visualEncounter} rp={radioEncounter} />
        </Grid> */}
      {/* <Grid item xs={4} sx={{ height: '50%' }}>
          <MapSub sat={target} />
        </Grid> */}
      {/* <Grid item xs={8} sx={{ height: '50%' }}>
          <MonitorSub
            tab={monitorTab}
            setTab={setMonitorTab}
            connected={beConnected}
            setConnected={setBeConnected}
            location={loc}
            setLocModal={setLocModal}
          />
        </Grid> */}
      {/* <Grid item xs={4} sx={{ height: '50%' }}>
          <LoggingSub />
        </Grid> */}
      {/* </Grid> */}
      {/* <Debug>{satList}</Debug> */}

      <div className="hero rounded-lg bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <Map groundStations={groundstationsList} Satellites={satList} />
          <div>
            <h1 className="text-5xl font-bold">Ground Station and Satilite tracking!</h1>
            <p className="py-6">
              This is a really cool way to display the world map with some tracking data that we can update with info
              and new groundstations as we want!
            </p>
            <button className="btn btn-primary">We can also add buttons here so that we can do changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Default to Sydney, next to UNSW electrical engineering building
const default_pos: gps_pos = {
  latitude: '-33.918006',
  longitude: '151.231303',
  altitude: '36.72',
  valid: true,
}

const default_sat: targetSat = {
  satid: 0,
  name: 'No target',
  ra: 0,
  dec: 0,
  lat: 0,
  lon: 0,
  intDesignator: '',
}

const default_visual_passes: n2yo_visual_passes = {
  startAz: 0,
  startAzCompass: '0',
  startEl: 0,
  startUTC: 0,
  maxAz: 0,
  maxAzCompass: '0',
  maxEl: 0,
  maxUTC: 0,
  endAz: 0,
  endAzCompass: '0',
  endEl: 0,
  endUTC: 0,
  mag: 0,
  duration: 0,
}

const default_radio_passes: n2yo_radio_passes = {
  startAz: 0.0,
  startAzCompass: '0',
  startUTC: 0,
  maxAz: 0.0,
  maxAzCompass: '0',
  maxEl: 0.0,
  maxUTC: 0,
  endAz: 0.0,
  endAzCompass: '0',
  endUTC: 0,
}

export default Index
