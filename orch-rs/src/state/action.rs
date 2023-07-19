use serde::Deserialize;

use super::GroundStation;

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum Action {
    // some operations on the state
    UpdateStation {
        name: String,
        status: GroundStation,
    },
}