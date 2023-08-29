use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub mod action;
mod point;

pub use point::{CartesianPoint, PolarPoint};
pub use action::Action;

#[derive(Default, Debug, Serialize)]
pub struct State {
    stations: HashMap<String, GroundStation>,
    current_satellite: Satellite,
    backend_status: BackendStatus,
}


#[derive(Default, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GPSPosition {
    pub latitude: String,
    pub longitude: String,
    pub altitude: String,
    pub valid: bool,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Satellite {
    pub tle: String,
    pub name: String,
    pub norad_id: i32,
    pub ind_designator: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SatPosition {
    pub azimuth: f32,
    pub elevation: f32,
    pub altitude: f32,
    pub latitude: f32,
    pub longitude: f32,
    pub valid: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Horizons {
    pub radio_start: PolarPoint,
    pub radio_end: PolarPoint,
    pub visual_start: PolarPoint,
    pub visual_end: PolarPoint,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub enum GroundStationStatus {
    #[default] OFFLINE,
    IDLE,
    TRACKING,
    OVERHEAT,
    FAULT,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub enum AntennaType {
    #[default] HELICAL,
    DIPOLE,
    YAGI,
    PARABOLIC,
    PATCH,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub enum GSKinematics {
    #[default] STATIC,
    AZ,
    AZEL,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GroundStation {
    pub name: String,
    pub location: GPSPosition,
    pub orientation: PolarPoint,
    pub signal_strength: f32,
    pub status: GroundStationStatus,
    pub freq_response: (f32, f32),
    pub antenna_type: AntennaType,
    pub kinematics: GSKinematics,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BackendStatus {
    pub lib_state: String,
    pub cpu: i32,
    pub mem: i32,
    pub client_list: Vec<String>,
}
