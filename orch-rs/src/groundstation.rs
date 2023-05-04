use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GroundStationStatus {
    pub name: String,
    pub orientation: (f32, f32),
}

pub trait GroundStation{
    fn get_status(&self) -> GroundStationStatus;
    // fn get_name(&self) -> String;
    // fn get_location(&self) -> String;
    // fn get_heading(&self) -> (f32, f32);
    // fn get_target(&self) -> String;
    // fn set_target(&mut self, String);
    fn update(&mut self); // should be async, currently only in nightly rust
    // fn subsribers(&mut self)
    // fn subscribe(&mut self, subsriber: &dyn Fn(GroundSationStatus));
    // whatever else might be needed for this?
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
        Self{name, location, orientation,}
    }
}

impl GroundStation for MockGroundStation {
    fn get_status(&self) -> GroundStationStatus {
        GroundStationStatus { name: self.name.clone(), orientation: self.orientation, }
    }

    fn update(&mut self) {
        println!("doing an update on {}", self.name)
    }
}

pub struct MobileGroundStation {

}

impl GroundStation for MobileGroundStation {
    fn get_status(&self) -> GroundStationStatus {
        todo!()
    }

    fn update(&mut self) {
        todo!()
    }
}

pub struct PhysicsGroundStation {

}

impl GroundStation for PhysicsGroundStation {
    fn get_status(&self) -> GroundStationStatus {
        todo!()
    }

    fn update(&mut self) {
        todo!()
    }
}
