use serde::{Deserialize, Serialize};

use crate::groundstation::GroundStation;

#[derive(Default, Debug)]
pub struct State<'a> {
    // what goes in here?
    stations: Vec<&'a dyn GroundStation>,
    current_satellite: String,
    // main: &'a dyn GroundStation,
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum Action {
    // some operations on the state
    Update,
}

impl<'a> State<'a> {
    pub fn apply(&mut self, action: Action) {
        match action {
            Action::Update => {
                self.stations.iter_mut()
                    .map(|s| s.update())
                    .collect();
            },
        }
    }
}

impl Serialize for State<'_> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer {
        self.stations.iter()
            .
    }
}
