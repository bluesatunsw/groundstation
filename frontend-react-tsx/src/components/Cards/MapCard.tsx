import { LatLngLiteral } from 'leaflet'
import Map, { MapProps } from '../MapComponent'

export interface trackingSat {
  name: string
  positionData: LatLngLiteral
}

export interface MapCardProps extends MapProps {
  trackedSat?: trackingSat
}

const MapCard = ({ groundStations, satellites, trackedSat }: MapCardProps) => {
  return (
    <div className="hero rounded-lg bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Map groundStations={groundStations} satellites={satellites} />
        <div>
          <h1 className="text-4xl font-bold">Ground Station and Satellite tracking!</h1>
          <div className="grid grid-rows-1 py-6">
            <p className="text-xl font-bold">
              Currently Tracking: {trackedSat ? trackedSat.name : 'No satellite selected'}
            </p>
            <p className="text-xl font-medium ">Latitude: {trackedSat ? trackedSat.positionData.lat : 'N/A'}</p>
            <p className="text-xl font-medium ">Longitude: {trackedSat ? trackedSat.positionData.lng : 'N/A'}</p>
            <p className="text-xl font-medium ">Altitude: {trackedSat ? trackedSat.positionData.alt : 'N/A'}</p>
          </div>
          <button className="btn btn-primary">We can also add buttons here so that we can do changes</button>
        </div>
      </div>
    </div>
  )
}

export default MapCard
