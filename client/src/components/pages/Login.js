import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from './AuthContext';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) {
        navigate('/checkout', { state: { userId: user.user.uid } });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <img className="login-logo" src="botimage.jpg" alt="Logo" />
      <div className="login-container">
        <h1>Sign-In</h1>
        <form>
          <h5>Email</h5>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleSignIn} type="submit" className="login-signInButton">Sign In</button>
          <p>By signing in, you agree to the terms and conditions for freedmobot.</p>
          <button onClick={handleRegister} className="login-registerButton">Create Your Account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
