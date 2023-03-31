use std::sync::Arc;

use axum::extract::ws::{Message, WebSocket};
use futures::{stream::SplitSink, SinkExt, StreamExt};
use json_patch::PatchOperation;
use serde::Serialize;
use serde_json::Error;
use tokio::sync::Mutex;

use crate::state::{Action, State};

pub struct WsState {
    st: Mutex<Vec<String>>, // TODO: get rid of this
    txs: Mutex<Vec<SplitSink<WebSocket, Message>>>,
    state: Mutex<State>,
}

#[derive(Serialize, Debug)]
#[serde(tag = "type")]
enum ServerMessage<'a> {
    Patch { ops: Vec<PatchOperation> },
    Full { state: &'a State },
}

impl WsState {
    pub(crate) fn new() -> Self {
        Self {
            st: Mutex::new(vec!["hello world!".to_string()]),
            txs: Mutex::new(Vec::default()),
            state: Mutex::new(State::default()),
        }
    }

    async fn add_session(&self, mut tx: SplitSink<WebSocket, Message>) {
        // send initial state
        if let Err(err) = tx
            .send(Message::Text(
                serde_json::to_string(&ServerMessage::Full {
                    state: &*self.state.lock().await,
                })
                .expect("Could not serialise initial state"),
            ))
            .await
        {
            eprintln!("Could not send initial state: {err}");
            return;
        }

        let mut txs = self.txs.lock().await;
        txs.push(tx);
    }

    async fn broadcast_all(&self, msg: String) {
        let mut txs = self.txs.lock().await;

        // so this was in the example code, but I don't know how much i like this.

        // take all the tx channels, leaving it empty
        for mut tx in std::mem::take(&mut *txs) {
            // try to send the message
            if let Err(err) = tx.send(Message::Text(msg.clone())).await {
                // if the channel is no longer valid, it gets dropped
                eprintln!("Client disconnected: {err}")
            } else {
                // if the channel is still valid, it gets added back in
                txs.push(tx);
            }
        }
    }

    async fn apply(&self, action: Action) -> Result<(), Error> {
        let mut state = self.state.lock().await;
        let old_json = serde_json::to_value(&*state)?;

        state.apply(action);

        let new_json = serde_json::to_value(&*state)?;

        let ops = json_patch::diff(&old_json, &new_json).0;

        if !ops.is_empty() {
            let msg = serde_json::to_string(&ServerMessage::Patch { ops })?;
            self.broadcast_all(msg).await;
        }

        Ok(())
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
            state.broadcast_all(text.clone()).await;
            // add the message to the current state
            state.st.lock().await.push(text);
        }
    }
}
