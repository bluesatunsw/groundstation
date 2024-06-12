// use std::time::Duration;

use std::f64::consts::PI;
use plotters::prelude::*;

pub fn main () {

    // let response = ureq::get("https://celestrak.com/NORAD/elements/gp.php")
    //     .query("GROUP", "galileo")
    //     // .query("FORMAT", "json")
    //     .call().unwrap();
    //
    // let tle = response.into_string().unwrap().lines()
    //     .skip(3) // for some reason it doesn't like the first tle?
    //     .take(3)
    //     .collect::<Vec<&str>>()
    //     .join("\n");
    let tle = "ISS (ZARYA)
1 25544U 98067A   08264.51782528 -.00002182  00000-0 -11606-4 0  2927
2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.72125391563537";
    println!("{tle}");
    let tle = parse_tle::tle::parse(&tle);

    // Set the initial start time of the scenario
    let epoch = Epoch::from_gregorian_tai(
        tle.epoch_year.try_into().unwrap(), // yay rust 
        tle.epoch_month.try_into().unwrap(),
        tle.epoch_day.try_into().unwrap(),
        tle.epoch_hours.try_into().unwrap(),
        tle.epoch_min.try_into().unwrap(),
        tle.epoch_sec.try_into().unwrap(),
        0
    );

    // from https://space.stackexchange.com/questions/18289/how-to-get-semi-major-axis-from-tle
    let mu: f64 = 3.986004418e14; // earth's gravitational parameter
    let n = tle.mean_motion; // rev / day
    let sma = mu.powf(1.0/3.0) / (2.0*PI*n/86400.0).powf(2.0/3.0) / 1000.0; 

    use nyx_space::md::ui::*;
    use nyx_space::od::ui::*;

    let cosm = Cosm::de438();
    let eme2k = cosm.frame("EME2000");

    let orbit = Orbit::keplerian(
        sma,
        tle.eccentricity,
        tle.inc,
        tle.raan,
        tle.arg_perigee,
        tle.mean_anomaly, // should be true anomaly idk
        epoch,
        eme2k
    );

    let landmark = GroundStation::from_point(
        "Sydney".into(),
        -33.86,
        151.21,
        0.0,
        cosm.frame("IAU Earth"),
        cosm.clone(),
    );

    println!("landmark:\n{}", landmark);
    println!("orbit:\n{}", orbit);

    // Let's specify the force model to be two body dynamics
    // And use the default propagator setup: a variable step Runge-Kutta 8-9
    let setup = Propagator::default(OrbitalDynamics::two_body());

    // Use the setup to seed a propagator with the initial state we defined above.
    let mut prop = setup.with(orbit);
    // Now let's propagate and generate the trajectory so we can analyse it.
    let (final_state, traj) = prop.for_duration_with_traj(1 * Unit::Day).unwrap();

    // Printing the state with `:o` will print its Keplerian elements
    println!("{}", final_state.to_keplerian_vec());

    let mut pts: Vec<(f64, f64)> = Vec::new();

    for state in traj.every(1 * Unit::Minute) {
        // Compute the elevation
        // let (elevation, _, _) = landmark.elevation_of(&state);

        let sat_gs_frame = cosm.frame_chg(&state, landmark.frame);

        let dt = &state.dt; // the current time
        // Then, compute the rotation matrix from the body fixed frame of the ground station to its topocentric frame SEZ
        // get the landmark's position at the current time
        let land_gs_frame = landmark.to_orbit(*dt); 
        // Note: we're only looking at the radis so we don't need to apply the transport theorem here.
        // get the horizon-frame from the landmark's current position
        let dcm_topo2fixed = land_gs_frame.dcm_from_traj_frame(Frame::SEZ).unwrap(); 

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

        pts.push((azimuth, elevation));

        // println!("{} el:{elevation} az:{azimuth}", state.epoch());
        // println!("{} {} {}", state.x, state.y, state.z);
        // println!("{} {} {}", diff_sez.x, diff_sez.y, diff_sez.z);
        // println!("");
        println!("el:{elevation}\taz:{azimuth}");
    }

    let root_drawing_area = BitMapBackend::new("images/horizon.png", (1024, 768))
        .into_drawing_area();

    root_drawing_area.fill(&WHITE).unwrap();

    let mut chart = ChartBuilder::on(&root_drawing_area)
        .set_label_area_size(LabelAreaPosition::Left, 40)
        .set_label_area_size(LabelAreaPosition::Bottom, 40)
        .build_cartesian_2d(-180.0..180.0, -90.0..90.0)
        .unwrap();

    chart.configure_mesh().draw().unwrap();

    chart.draw_series(pts.iter().map(|pt| Circle::new(*pt, 5, &BLACK)))
        .unwrap();

}
