
use std::{f64::consts::PI, sync::Arc};
// use plotters::prelude::*;

use nyx_space as ns;
use ns::md::ui as nm;
use ns::od::ui as no;
use parse_tle::tle::TLE;

use crate::state;

fn epoch_from_tle(tle: &TLE) -> nm::Epoch {
    nm::Epoch::from_gregorian_tai(
        tle.epoch_year.try_into().unwrap(), // yay rust 
        tle.epoch_month.try_into().unwrap(),
        tle.epoch_day.try_into().unwrap(),
        tle.epoch_hours.try_into().unwrap(),
        tle.epoch_min.try_into().unwrap(),
        tle.epoch_sec.try_into().unwrap(),
        0
    )
}

fn keplarian_from_tle(tle: &TLE, frame: nm::Frame) -> nm::Orbit {
    // from https://space.stackexchange.com/questions/18289/how-to-get-semi-major-axis-from-tle
    let mu: f64 = 3.986004418e14; // earth's gravitational parameter
    let n = tle.mean_motion; // rev / day
    let sma = mu.powf(1.0/3.0) / (2.0*PI*n/86400.0).powf(2.0/3.0) / 1000.0; // in km

    let epoch = epoch_from_tle(&tle);

    nm::Orbit::keplerian(
        sma, // semi major axis
        tle.eccentricity,
        tle.inc,
        tle.raan,
        tle.arg_perigee,
        tle.mean_anomaly, // should be true anomaly idk
        epoch,
        frame
    )
}

pub fn get_traj_from_tle(tle: TLE, frame: nm::Frame, until: nm::Epoch) -> nm::Traj<nm::Orbit> {
    let orbit = keplarian_from_tle(&tle, frame);

    // Let's specify the force model to be two body dynamics
    // And use the default propagator setup: a variable step Runge-Kutta 8-9
    let setup = nm::Propagator::default(nm::OrbitalDynamics::two_body());

    // Use the setup to seed a propagator with the initial state we defined above.
    let mut prop = setup.with(orbit);
    // Now let's propagate and generate the trajectory so we can analyse it.
    let (_final_state, traj) = prop.until_epoch_with_traj(until).unwrap();

    traj
}

pub fn traj_to_observations(gs: &state::GroundStation, traj: nm::Traj<nm::Orbit>, cosm: Arc<nm::Cosm>) -> Vec<(f64, f64)>{

    let landmark = no::GroundStation::from_point(
        gs.name.clone(),
        gs.location.latitude.into(),
        gs.location.longitude.into(),
        0.0,
        cosm.frame("IAU Earth"),
        cosm.clone(),
    );

    let mut pts = Vec::new();

    for state in traj.every(1 * nm::Unit::Minute) {
        // Compute the elevation
        // let (elevation, _, _) = landmark.elevation_of(&state);


        pts.push(state_to_observation_impl(state, &landmark, cosm.clone()));
    }

    pts
}

pub fn state_to_observation(gs: &state::GroundStation, state: nm::Orbit, cosm: Arc<nm::Cosm>) -> (f64, f64) {
    let landmark = no::GroundStation::from_point(
        gs.name.clone(),
        gs.location.latitude.into(),
        gs.location.longitude.into(),
        0.0,
        cosm.frame("IAU Earth"),
        cosm.clone(),
    );

    state_to_observation_impl(state, &landmark, cosm.clone())
}

fn state_to_observation_impl(state: nm::Orbit, landmark: &no::GroundStation, cosm: Arc<nm::Cosm>) -> (f64, f64) {
    let sat_gs_frame = cosm.frame_chg(&state, landmark.frame);

    let dt = &state.dt; // the current time
    // Then, compute the rotation matrix from the body fixed frame of the ground station to its topocentric frame SEZ
    // get the landmark's position at the current time
    let land_gs_frame = landmark.to_orbit(*dt); 
    // Note: we're only looking at the radis so we don't need to apply the transport theorem here.
    // get the horizon-frame from the landmark's current position
    let dcm_topo2fixed = land_gs_frame.dcm_from_traj_frame(nm::Frame::SEZ).unwrap(); 

    // Now, rotate the spacecraft in the SEZ frame to compute its elevation as seen from the ground station.
    // We transpose the DCM so that it's the fixed to topocentric rotation.
    // move both 
    let sat_sez = sat_gs_frame.with_position_rotated_by(dcm_topo2fixed.transpose());
    let land_sez = land_gs_frame.with_position_rotated_by(dcm_topo2fixed.transpose());
    // Now, let's compute the range ρ.
    let diff_sez = sat_sez - land_sez;

    // Finally, compute the elevation (math is the same as declination)
    let elevation = diff_sez.declination();
    let azimuth = f64::atan2(-diff_sez.x, diff_sez.y).to_degrees();

    (azimuth, elevation)
}

pub fn traj_to_geodetic(traj: nm::Traj<nm::Orbit>, cosm: Arc<nm::Cosm>) -> Vec<(f64, f64)> {
    let frame = cosm.frame("IAU Earth");
    let mut pts = Vec::new();

    for state in traj.every(1 * nm::Unit::Minute) {
        let state = cosm.frame_chg(&state, frame);
        pts.push((
            state.geodetic_latitude(),
            state.geodetic_longitude()
        ));
    }

    pts
}
