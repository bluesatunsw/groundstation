use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::groundstation::GroundStationStatus;

#[derive(Default, Debug, Serialize)]
pub struct State {
    // what goes in here?
    // stations: Vec<&'a dyn GroundStation>,
    stations: HashMap<String, GroundStationStatus>,
    current_satellite: String,
    // main: &'a dyn GroundStation,
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum Action {
    // some operations on the state
    UpdateStation{name: String, status: GroundStationStatus},
}

impl State {
    pub fn apply(&mut self, action: Action) {
        match action {
            Action::UpdateStation{name, status} => {
                self.stations.insert(name, status);
            },
        }
    }
}
