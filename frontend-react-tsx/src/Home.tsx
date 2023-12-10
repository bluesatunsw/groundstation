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
import NavBar from './components/Navbar'
import MapCard, { trackingSat } from './components/Cards/MapCard'

export interface ISSReturnTypeJson {
  iss_position: {
    latitude: number
    longitude: number
  }
}

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

  const [satList, setSatList] = useState<ISSReturnTypeJson>({
    iss_position: {
      latitude: 0,
      longitude: 0,
    },
  })

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetch(`http://api.open-notify.org/iss-now.json`)
        .then((response) => response.json())
        .then((data) => {
          const issData: ISSReturnTypeJson = {
            iss_position: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
          }

          setSatList(issData)
        })
        .catch((error) => console.error(error))
    }, 2000)

    return () => {
      clearInterval(interval)
    }
  }, [satList])

  const ISStracking: trackingSat = {
    name: 'ISS',
    positionData: {
      lat: 0,
      lng: 0,
      alt: 0,
    },
  }

  if (satList) {
    ISStracking.positionData.lat = satList.iss_position.latitude
    ISStracking.positionData.lng = satList.iss_position.longitude
  }

  return (
    <div>
      <div key={'HEADDER'}>
        <NavBar setWhatsUpModal={setWhatsUpModal} setTargetModal={setTargetModal} onCalcEn={calcEncounter} />
        {/* <p>hello</p> */}
        {state === undefined && <p className="text-center">State not yet initialised</p>}
        {state && <p className="text-center">{`${JSON.stringify(state)}`}</p>}
      </div>

      <div key={'BODY'}>
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

        <MapCard
          groundStations={groundstationsList}
          trackedSat={{
            name: 'ISS',
            positionData: {
              lat: satList.iss_position.latitude,
              lng: satList.iss_position.longitude,
              alt: 0,
            },
          }}
        />
      </div>

      <div key={'FOOTER'}>
        {' '}
        {!beConnected ? (
          <div className="toast toast-start">
            <div className="alert alert-info bg-warning">
              <span>Warning: backend is not connected or n2yo not reachable. Cannot interface with API.</span>
            </div>
          </div>
        ) : (
          <></>
        )}
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
