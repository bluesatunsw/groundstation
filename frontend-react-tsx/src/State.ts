export interface State {
    stations: Map<string, GroundStation>;
    current_satellite: Satellite;
    backend_status: BackendStatus;
}

export interface Satellite {
  tle: string,
  name: string,
  norad_id: number,
  ind_designator: string,
}

export interface BackendStatus {
  lib_state: string,
  cpu: number,
  mem: number,
  client_list: Array<string>,
}

export enum GroundStationStatus {
  OFFLINE,
  IDLE,
  TRACKING,
  OVERHEAT,
  FAULT,
}

export enum AntennaType {
  HELICAL,
  DIPOLE,
  YAGI,
  PARABOLIC,
  PATCH,
}

export enum GSKinematics {
  STATIC,
  AZ,
  AZEL,
}

export interface GPSPosition {
  latitude: String,
  longitude: String,
  altitude: String,
  valid: boolean,
}

export interface GroundStation {
  name: String,
  location: GPSPosition,
  orientation: PolarPoint,
  signal_strength: number,
  status: GroundStationStatus,
  freq_response: [number, number],
  antenna_type: AntennaType,
  kinematics: GSKinematics,
}

export interface PolarPoint {
  az: number,
  el: number,
}

/// Actions

export interface UpdateStation {
  name: String,
  status: GroundStation,
}

export interface SelectSatellite {
  satellite: Satellite,
}

export type StateAction = UpdateStation | SelectSatellite;
