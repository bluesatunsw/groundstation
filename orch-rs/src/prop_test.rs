use std::time::Duration;

pub fn test () {

    // let response = ureq::get("https://celestrak.com/NORAD/elements/gp.php")
    //     .query("GROUP", "galileo")
    //     .query("FORMAT", "json")
    //     .call().unwrap();
    //
    // let elements_vec: Vec<sgp4::Elements> = response.into_json().unwrap();
    //
    // for elements in &elements_vec {
    //     println!("{}", elements.object_name.as_ref().unwrap());
    //     let constants = sgp4::Constants::from_elements(elements).unwrap();
    //     for hours in &[12, 24] {
    //         println!("    t = {} min", hours * 60);
    //         let prediction = constants.propagate((hours * 60) as f64).unwrap();
    //         println!("        r = {:?} km", prediction.position);
    //         println!("        ṙ = {:?} km.s⁻¹", prediction.velocity);
    //     }
    // }

    use nyx_space::md::ui::*;
    use nyx_space::od::ui::*;

    let cosm = Cosm::de438();
    let eme2k = cosm.frame("EME2000");

    // Set the initial start time of the scenario
    let epoch = Epoch::from_gregorian_tai_at_noon(2021, 2, 25);
    // Nearly circular orbit (ecc of 0.01), inclination of 49 degrees and TA at 30.0
    let orbit = Orbit::keplerian(500.0, 0.01, -33.0, 0.0, 0.0, 30.0, epoch, eme2k);

    let landmark = GroundStation::from_point(
        "Sydney".into(),
        -33.86,
        151.21,
        0.0,
        cosm.frame("IAU Earth"),
        cosm.clone(),
    );

    println!("{}", landmark);

    // Let's specify the force model to be two body dynamics
    // And use the default propagator setup: a variable step Runge-Kutta 8-9
    let setup = Propagator::default(OrbitalDynamics::two_body());

    // Use the setup to seed a propagator with the initial state we defined above.
    let mut prop = setup.with(orbit);
    // Now let's propagate and generate the trajectory so we can analyse it.
    let (final_state, traj) = prop.for_duration_with_traj(1 * Unit::Day).unwrap();

    // Printing the state with `:o` will print its Keplerian elements
    println!("{}", final_state.to_keplerian_vec());

    for state in traj.every(2 * Unit::Minute) {
        // Compute the elevation
        let (elevation, _, _) = landmark.elevation_of(&state);
        let (azimuth, _, _) = landmark.elevation_of(&state);

        let rx_gs_frame = landmark.cosm.frame_chg(&state, self.frame);

        let dt = &state.dt;
        // Then, compute the rotation matrix from the body fixed frame of the ground station to its topocentric frame SEZ.
        let tx_gs_frame = landmark.to_orbit(*dt);
        // Note: we're only looking at the radis so we don't need to apply the transport theorem here.
        let dcm_topo2fixed = tx_gs_frame.dcm_from_traj_frame(Frame::SEZ).unwrap();

        // Now, rotate the spacecraft in the SEZ frame to compute its elevation as seen from the ground station.
        // We transpose the DCM so that it's the fixed to topocentric rotation.
        let rx_sez = rx_gs_frame.with_position_rotated_by(dcm_topo2fixed.transpose());
        let tx_sez = tx_gs_frame.with_position_rotated_by(dcm_topo2fixed.transpose());
        // Now, let's compute the range ρ.
        let rho_sez = rx_sez - tx_sez;

        // Finally, compute the elevation (math is the same as declination)
        let elevation = rho_sez.declination();
        let elevation = rho_sez;
    }

    std::process::exit(0);
}
