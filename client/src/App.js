
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar';
import Home from "./components/pages/home/Home";
import Trade from './components/pages/Trade';
import Login from './components/pages/Login';
import { AuthProvider } from './components/pages/AuthContext';
import ProtectedRoute from './components/pages/ProtectedRoute';
import Contact from './components/pages/contact';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/trade" element={<ProtectedRoute element={<Trade />} />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;