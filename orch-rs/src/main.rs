use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{ws::WebSocketUpgrade, Extension},
    response::IntoResponse,
    routing, Router,
};

mod groundstation;
mod state;
mod websocket;

use groundstation::GroundStation;
use websocket::{handle_socket, WsState};

use groundstation::MockGroundStation;
use state::{FrontendAction, BackendAction, Satellite};
// use prop_test;

#[tokio::main]
async fn main() {
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
    tokio::spawn({
        let ws_state: Arc<WsState> = ws_state.clone();
        async {
            let gs = MockGroundStation::new("test".into(), "nowhere".into(), (0., 0.)); groundstation_handler(gs, ws_state).await;
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
        use tokio::time::{sleep, Duration};
        sleep(Duration::from_millis(1000)).await;
        gs.update();
        // this could probably be reversed so that this function
        // awaits updates from ground station, rather than polling it.

        let status = gs.get_status();
        let name = status.name.clone();
        // println!("{:?}", status.clone());

        ws_state.apply(BackendAction::UpdateStation {
                name: name.clone(),
                groundstation: status,
            }).await.unwrap_or_else(|err| {

                println!("could not update state from {}: {err}", name);
            });

        // ws_state.update(&|state: &mut state::State| {
        //         state.stations.insert(name.clone(), status.clone());
        //     }).await
        //     .unwrap_or_else(|err| {
        //         println!("could not update state from {}: {err}", name);
        //     });
    }
}
