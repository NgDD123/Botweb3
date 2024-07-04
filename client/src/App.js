import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar';
import Home from "./components/pages/home/Home";
import Trade from './components/pages/Trade';
import Login from './components/pages/SinUp';
import Contact from './components/pages/contact';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} /> {/* Route for Home component */}
          <Route path="/Trade" element={<Trade />} /> 
          {/*<Route path="/login" element={<Login />} />*/}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
