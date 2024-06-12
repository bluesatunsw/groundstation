use serde::{Deserialize, Serialize};

// use super::GroundStation;
use super::{State, Satellite, GroundStation};

pub trait Action {
    // UpdateStation{name : str, status : str}
    // SelectSatellite{satellite: Satellite},
    fn apply(self, state: &mut State);
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum FrontendAction {
    SelectSatellite {satellite: Satellite},
}

pub enum BackendAction {
    Update,
    UpdateStation {
        name: String, 
        groundstation: GroundStation
    },
}

impl Action for FrontendAction {
    fn apply(self, state: &mut State) {
        match self {
            FrontendAction::SelectSatellite { satellite } => {
                state.current_satellite = satellite;
            },
        }
    }
}

impl Action for BackendAction {
    fn apply(self, state: &mut State) {
        match self {
            BackendAction::UpdateStation {name, groundstation} => {
                state.stations.insert(name, groundstation);
            },
            BackendAction::Update => {},
        }
    }
}
