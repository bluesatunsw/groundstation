import React from 'react';
import './App.css';

import Home from './pages/Home'

import { useWebsocket } from './Websocket';

const App: React.FC = () => {
  
  const state = useWebsocket();

  return (
    <div className="App">
      {/* <p>hello</p> */}
      {state === undefined && <p>yo</p>}
      {state && <p>{`${JSON.stringify(state)}`}</p>}
      {/*  <Home/>  */}
    </div>
  );
}
export default App;   
