import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'


const App: React.FC = () => {
  
  return (
    <div className="App">
      <Router>
        <Route path="/" element={index}/>
      </Router>
    </div>
  );
}
export default App;