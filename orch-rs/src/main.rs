use std::{net::SocketAddr, sync::Arc};
use tokio::time::{sleep, Duration};

use axum::{
    extract::{ws::WebSocketUpgrade, Extension},
    response::IntoResponse,
    routing, Router,
};

mod groundstation;
mod state;
mod websocket;
mod propagator;

use groundstation::GroundStation;
use websocket::{handle_socket, WsState};

use groundstation::MockGroundStation;
// use state::{FrontendAction, BackendAction, Satellite};

#[tokio::main]
async fn main() {
    let tle = "ISS (ZARYA)             
1 25544U 98067A   23283.04537684  .00020393  00000+0  36429-3 0  9998
2 25544  51.6412 119.6207 0005129  92.4695  44.1476 15.49999052419608";

    let tle = parse_tle::tle::parse(&tle);
    println!("{tle}");
    // println!("{}", 
    //     serde_json::to_string(
    //         &FrontendAction::SelectSatellite{satellite: Satellite::default()}
    //     ).unwrap()
    // );
    //

    println!("Starting server");

    // TODO: setup logging

    let ws_state: Arc<WsState> = Arc::new(WsState::new());

    // it should probably generate groundstations from a config file
    // for now, copy this block for every new gs
    tokio::spawn({
        let ws_state: Arc<WsState> = ws_state.clone();
        async {
            let gs = MockGroundStation::new(
                "test".into(),
                (-33.86, 151.21),
                (0., 0.)
            ); 
            groundstation_handler(gs, ws_state).await;
        }
    });

    // satellite prediction loop thing
    tokio::spawn({
        let ws_state: Arc<WsState> = ws_state.clone();
        async {
            trajectory_handler(ws_state).await;
        }
    });

    let app = Router::new()
        .route("/ws", routing::get(ws_handler))
        .layer(Extension(ws_state));

    let addr: SocketAddr = "127.0.0.1:3333".parse().unwrap();

    println!("Listening on http://{addr}");

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();

}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Extension(state): Extension<Arc<WsState>>,
) -> impl IntoResponse {
    println!("new ws connection!");
    ws.on_upgrade(|socket| handle_socket(socket, state))
}

async fn groundstation_handler(mut gs: impl GroundStation, ws_state: Arc<WsState>) -> ! {
    loop {
        sleep(Duration::from_millis(1000)).await;
        gs.update();
        // this could probably be reversed so that this function
        // awaits updates from ground station, rather than polling it.
        // although polling better reflects how rotctl works

        let status = gs.get_status();
        let name = status.name.clone();
        // println!("{:?}", status.clone());

        // ws_state.apply(BackendAction::UpdateStation {
        //         name: name.clone(),
        //         groundstation: status.clone(),
        //     }).await.unwrap_or_else(|err| {
        //
        //         println!("could not update state from {}: {err}", name);
        //     });

        ws_state.update(
                |state: &mut state::State| {
                    state.stations.insert(name.clone(), status);
                }
            ).await
            .unwrap_or_else(|err| {
                println!("could not update state from {}: {err}", name);
            });
    }
}

async fn trajectory_handler(ws_state: Arc<WsState>) -> ! {
    use nyx_space as ns;
    use ns::md::ui as nm;

    let cosm = nm::Cosm::de438();
    let frame = cosm.frame("EME2000");

    // hardcoding the requried duration
    let tle = "ISS (ZARYA)             
1 25544U 98067A   23283.04537684  .00020393  00000+0  36429-3 0  9998
2 25544  51.6412 119.6207 0005129  92.4695  44.1476 15.49999052419608";

    let tle = parse_tle::tle::parse(&tle);

    fn curr_epoch() -> nm::Epoch {
        let time = std::time::SystemTime::now();
        let time = time.duration_since(std::time::SystemTime::UNIX_EPOCH).unwrap().as_secs_f64();
        nm::Epoch::from_unix_seconds(time)
    }

    let traj = propagator::get_traj_from_tle(tle, frame, curr_epoch() + 1 * nm::Unit::Day);

    loop {
        let state = traj.at(curr_epoch()).unwrap();
        
        let global_state = ws_state.state.lock().await;
        let (_name, gs) = global_state.stations.iter().next().unwrap();
        let obs = propagator::state_to_observation(&gs, state, cosm.clone());
        println!("{obs:?}");
        sleep(Duration::from_millis(1000)).await;
    }
}
