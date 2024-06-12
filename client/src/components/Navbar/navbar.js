import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
//import { auth } from '../../firebase';
//import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  /*const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  const handleAuthentication = async () => {
    if (user) {
      signOut(auth);
    }
  }; */

  return (
    <nav className='navbar'>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {/*<Link to="/contact">Contact</Link>*/}
        </li>
        <div className="navbar-options">
          <li>
           {/* <Link to={!user ? '/login' : '/'}>
              <div onClick={handleAuthentication} className="nav-options">
                <span className="nov-optionOne">{!user ? ' ' : user.email}</span>
                <span className="nov-optionTwo">{user ? ' Sign Out' : ' Sign In'}</span>
              </div>
  </Link>*/}
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navbar;
