import React from 'react';
import './App.css';

import Home from './pages/Home'

import { useWebsocket } from './Websocket';

const App: React.FC = () => {
  
  const state = useWebsocket();

  return (
    <div className="App">
      {/* <Home/> */}
      <p>hello</p>
      {state === undefined && <p>yo</p>}
      {state && <p>{`${JSON.stringify(state)}`}</p>}
    </div>
  );
}
export default App;   