// MapComponent.tsx
// MapComponent is a fully custom component using GEOJSON for data display and Leaflet for the map
// William Papantoniou

import { TileLayer, MapContainer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconPng from 'leaflet/dist/images/marker-icon.png'
import L, { Icon, LatLngExpression, LatLngLiteral } from 'leaflet'

export interface GroundStation {
  name: string
  lat: number
  lon: number
}

export interface MapProps {
  groundStations?: GroundStation[]
  satellites?: LatLngExpression[][]
}

const sydney: LatLngLiteral = {
  lat: -33.8688,
  lng: 151.2093,
}

const Map = ({ groundStations, satellites }: MapProps) => {
  return (
    <div className="p-5">
      <MapContainer
        center={sydney}
        zoom={1}
        scrollWheelZoom={true}
        className="h-[35rem] w-[35rem]"

        // className="map-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {groundStations ? (
          groundStations.map((s, i) => {
            return (
              <Marker
                position={[s.lat, s.lon]}
                icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}
                key={i}
              >
                <Popup>
                  <p>
                    {s.name} Lat:{s.lat} Lng:{s.lon}
                  </p>
                </Popup>
              </Marker>
            )
          })
        ) : (
          <></>
        )}

        {satellites ? <Polyline positions={satellites}></Polyline> : <></>}
      </MapContainer>
    </div>
  )
}
export default Map
