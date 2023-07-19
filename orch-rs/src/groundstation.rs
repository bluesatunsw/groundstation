use crate::state::{self, PolarPoint};
// #[derive(Debug, Serialize, Deserialize, Clone)]
// pub struct GroundStationStatus {
//     pub name: String,
//     pub orientation: (f32, f32),
// }
use serial::{
    SerialPortSettings,
};

use serialport;
pub trait GroundStation {
    fn get_status(&self) -> state::GroundStation;
    // fn get_name(&self) -> String;
    // fn get_location(&self) -> String;
    // fn get_heading(&self) -> (f32, f32);
    // fn get_target(&self) -> String;
    // fn set_target(&mut self, String);
    fn update(&mut self); // should be async, currently only in nightly rust
                          // fn subsribers(&mut self)
                          // fn subscribe(&mut self, subsriber: &dyn Fn(GroundSationStatus));
                          // whatever else might be needed for this?
    fn get_gps(&self);
}

// this stuff will probably get moved out to some sorta test module later
#[derive(Default, Debug)]
pub struct MockGroundStation {
    // whatever else might be needed ig
    name: String,
    location: String,
    orientation: (f32, f32),
}

impl MockGroundStation {
    pub fn new(name: String, location: String, orientation: (f32, f32)) -> Self {
        Self {
            name,
            location,
            orientation,
        }
    }
}

impl GroundStation for MockGroundStation {
    fn get_status(&self) -> state::GroundStation {
        state::GroundStation {
            orientation: PolarPoint {
                az: self.orientation.0,
                el: self.orientation.1,
            },
            ..state::GroundStation::default()
        }
        
    }

    fn update(&mut self) {
        // println!("doing an update on {}", self.name);
        self.orientation.1 += 0.1;
        self.orientation.1 %= 360.0;
    }
    fn get_gps(&self) {
        let available_ports = serialport::available_ports();

    }
}

pub struct MobileGroundStation {}

impl GroundStation for MobileGroundStation {
    fn get_status(&self) -> state::GroundStation {
        todo!()
    }

    fn update(&mut self) {
        todo!()
    }

    fn get_gps(&self) {
        todo!()
    }
}

pub struct PhysicsGroundStation {}

impl GroundStation for PhysicsGroundStation {
    fn get_status(&self) -> state::GroundStation {
        todo!()
    }

    fn update(&mut self) {
        todo!()
    }

    fn get_gps(&self) {
        todo!()
    }

}
