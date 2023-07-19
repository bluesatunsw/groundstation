import {State} from "./State"
import {applyPatch, Operation} from "fast-json-patch"
interface Patch {
    type: "Patch";
    ops: Operation[]; // from fast-json-patch
}

interface Full {
    type: "Full";
    state: State;
}

type ServerMessage = Patch | Full;

let websocket: WebSocket | undefined;
let state: State | undefined;

const setupWebsocket = (onStateUpdate: (state: State) => void) => {
    const uri = "ws://127.0.0.1:3333/ws";
    const connection = new WebSocket(uri);
    console.log(`connecting to websocket: ${uri}`);
    
    connection.onopen = () => {
        console.log("opened websocket");
        websocket = connection;
    };
    
    connection.onclose = (reason) => {
        websocket = undefined;
    
        if (reason.code !== 1000 && reason.code !== 1001) {
            console.log("closed websocket");

            setTimeout(() => {
                setupWebsocket(onStateUpdate);
            }, 500);
        }
    };

    connection.onerror = (error) => {
        console.error("Error with websocket:", error);
        connection.close();
    }

    connection.onmessage = (message) => {
        const msg = JSON.parse(message.data) as ServerMessage;

        switch (msg.type) {
            case "Patch": {
                if (state !== undefined) {
                    let {newDocument: newState} = applyPatch(state, msg.ops, false, false);

                    onStateUpdate(newState);
                    state = newState;
                }
                break;
            }
            
            case "Full" : {
                onStateUpdate(msg.state);
                state = msg.state;
                break;
            }
        }
    }
};
