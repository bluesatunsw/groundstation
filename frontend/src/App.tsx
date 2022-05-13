import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

const App: React.FC = () => {
  
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}
export default App;