use serde::{Deserialize, Serialize};

// use super::GroundStation;
use super::{State, Satellite};

pub trait Action {
    // UpdateStation{name : str, status : str}
    // SelectSatellite{satellite: Satellite},
    fn apply(self, state: &mut State);
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct FrontendAction {
    SelectSatellite{satellite: Satellite},
}

impl Action for FrontendAction {
    fn apply(self, state: &mut State) {
        match self {
            FrontendAction::SelectSatellite { satellite } => {
                state.current_satellite = satellite;
            },
            // Action::UpdateStation{name, status} => {
            //     state.stations.insert(name, status);
            // }
        }
    }
}
