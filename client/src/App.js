import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar';
import Home from "./components/pages/home/Home";
import Trade from './components/pages/Trade';
import Login from './components/pages/Login';
import { AuthProvider } from './components/pages/AuthContext';
import ProtectedRoute from './components/pages/ProtectedRoute';
import CheckoutPage from './components/pages/checkout/checkoutPage';
import Contact from './components/pages/contact';
import { StateProvider } from './components/pages/StateContext';
import AdminDashboard from './components/pages/AdminDashboard';
import UserDashboard from './components/pages/UserDashboard';
import AdminProtectedRoute from './components/pages/AdminProtectedRoute';
import Sidebar from './components/Sidebar/Sidebar';
function App() {
  return (
    <AuthProvider>
      <StateProvider>
        <Router>
          <div className="App">
            <Sidebar/>
            <div className='Appcontainer'>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<ProtectedRoute element={<Contact />} />} />
                <Route path="/admin" element={<AdminProtectedRoute element={<AdminDashboard />} />} />
                <Route path="/user" element={<ProtectedRoute element={<UserDashboard />} />} />
              </Routes>
            </div>
          </div>
        </Router>
      </StateProvider>
    </AuthProvider>
  );
}

export default App;
