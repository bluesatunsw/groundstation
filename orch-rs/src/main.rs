use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract::{ws::WebSocketUpgrade, Extension},
    response::IntoResponse,
    routing, Router,
};

mod websocket;

use crate::websocket::{handle_socket, WsState};

#[tokio::main]
async fn main() {
    println!("Starting server");

    // TODO: setup logging

    let app = Router::new()
        .route("/ws", routing::get(ws_handler))
        .layer(Extension(Arc::new(WsState::new())));

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
