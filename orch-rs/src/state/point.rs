use std::ops::{Add, AddAssign};

use serde::{Serialize, Deserialize};

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub struct PolarPoint {
    pub az: f32,
    pub el: f32,
}

#[derive(Default, Debug, Serialize, Deserialize, Clone)]
pub struct CartesianPoint {
    pub x: f32,
    pub y: f32,
}

impl Add for CartesianPoint {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            x: self.x + rhs.x,
            y: self.y + rhs.y,
        }
    }
}

impl AddAssign for CartesianPoint {
    fn add_assign(&mut self, rhs: Self) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

const ANGLE_MAX: f32 = 360.0;
// proably defnintley need to look more into how rust
// handles wrapping floating point values.
//
// https://github.com/rust-lang/rust/issues/57738
fn wrap_angle(val: f32) -> f32{
    val % ANGLE_MAX
}

impl Add for PolarPoint {
    type Output = Self;

    fn add(self, rhs: Self) -> Self::Output {
        Self {
            az: wrap_angle(self.az + rhs.az),
            el: wrap_angle(self.el + rhs.el),
        }
    }
}

impl AddAssign for PolarPoint {
    fn add_assign(&mut self, rhs: Self) {
        self.az = wrap_angle(self.az + rhs.az);
        self.el = wrap_angle(self.el + rhs.el);
    }
}
