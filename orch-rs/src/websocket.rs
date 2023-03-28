use std::sync::Arc;

use axum::extract::ws::{Message, WebSocket};
use futures::{stream::SplitSink, SinkExt, StreamExt};
use tokio::sync::Mutex;

pub struct WsState {
    st: Mutex<Vec<String>>,
    txs: Mutex<Vec<SplitSink<WebSocket, Message>>>,
}

impl WsState {
    pub(crate) fn new() -> Self {
        Self {
            st: Mutex::new(vec!["hello world!".to_string()]),
            txs: Mutex::new(Vec::default()),
        }
    }

    async fn add_session(&self, mut tx: SplitSink<WebSocket, Message>) {
        // send initial state
        if let Err(err) = tx
            .send(Message::Text(self.st.lock().await.join("\n")))
            .await
        {
            eprintln!("Could not send initial state: {err}");
            return;
        }

        let mut txs = self.txs.lock().await;
        txs.push(tx);
    }

    async fn broadcast(&self, msg: String) {
        let mut txs = self.txs.lock().await;

        // so this was in the example code, but I don't know how much i like this.

        // take all the tx channels, leaving it empty
        for mut tx in std::mem::take(&mut *txs) {
            // try ot send the message
            if let Err(err) = tx.send(Message::Text(msg.clone())).await {
                // if the channel is no longer valid, it gets dropped
                eprintln!("Client disconnected: {err}")
            } else {
                // if the channel is still valid, it gets added back in
                txs.push(tx);
            }
        }

        // add the message to the current state
        self.st.lock().await.push(msg);
    }
}

pub async fn handle_socket(socket: WebSocket, state: Arc<WsState>) {
    let (tx, mut rx) = socket.split();

    // keep session for later broadcast
    state.add_session(tx).await;

    // process incoming messages
    while let Some(Ok(msg)) = rx.next().await {
        if let Message::Text(text) = msg {
            println!("{text}");
            state.broadcast(text).await;
        }
    }
}
