import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAuthentication = async () => {
    if (user) {
      signOut(auth);
    }
  };

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Trade">Trade</Link>
        </li>
        {/*
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        */}
        <div className="navbar-options">
          <li>
            <Link to={!user ? '/login' : '/'}>
              <div onClick={handleAuthentication} className="nav-options">
                <span className="nav-optionOne">{!user ? ' ' : user.email}</span>
                <span className="nav-optionTwo">{user ? ' Sign Out' : ' Sign In'}</span>
              </div>
            </Link>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
