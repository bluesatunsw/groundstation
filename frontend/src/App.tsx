import React from 'react';
import Plot from 'react-plotly.js';
import './App.css';

import Home from './pages/Home'

import { useWebsocket } from './Websocket';

const App: React.FC = () => {
  
  const state = useWebsocket();

  return (
    <div className="App">
      {/* <p>hello</p> */}
      {state === undefined && <p>State not yet initialised</p>}
      {state && <p>{`${JSON.stringify(state)}`}</p>}
      {<Home/>}
      {<Plot
        data={[
          {
            x: [0, 90, 180, 270],
            y: [45, 30, -15, 30],
            type: 'scatter',
            mode: 'markers',
            // marker: {color: 'red'},
          },
          // {type:'bar', x:[1, 2, 3], y:[2, 5, 3]},
        ]}
        layout={{
          xaxis: {range: [0, 360]},
          yaxis: {range: [-90, 90]},
          width:720, height: 480, 
          title: 'A fancy plot',
        }}
      />}
    </div>
  );
}
export default App;   
