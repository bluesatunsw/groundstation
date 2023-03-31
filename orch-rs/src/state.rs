use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Default, Debug, Clone)]
pub struct State {
    // what goes in here?
}

#[derive(Deserialize)]
#[serde(tag = "type")]
pub enum Action {
    // some operations on the state
}

impl State {
    pub fn apply(&mut self, action: Action) {
        match action {}
    }
}
