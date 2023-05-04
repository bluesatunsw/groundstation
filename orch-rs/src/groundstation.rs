use std::fmt;

use serde::Serialize;

pub trait GroundStation: Sync + fmt::Debug {
    fn get_status(&self) -> ();
    // fn get_name(&self) -> String;
    // fn get_location(&self) -> String;
    // fn get_heading(&self) -> (f32, f32);
    // fn get_target(&self) -> String;
    // fn set_target(&mut self, String);
    fn update(&mut self);
    // whatever else might be needed for this?
}

#[derive(Debug, Serialize)]
pub struct MockGroundStation {
    // whatever else might be needed ig
}

impl GroundStation for MockGroundStation {
    fn get_status(&self) -> () {
        todo!()
    }
}

#[derive(Debug, Serialize)]
pub struct MobileGroundStation {

}

impl GroundStation for MobileGroundStation {
    fn get_status(&self) -> () {
        todo!()
    }
}

#[derive(Debug, Serialize)]
pub struct PhysicsGroundStation {

}

impl GroundStation for PhysicsGroundStation {
    fn get_status(&self) -> () {
        todo!()
    }
}
