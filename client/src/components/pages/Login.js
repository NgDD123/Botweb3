import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      if (user) {
        navigate('/');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
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

          <button onClick={signIn} type="submit" className="login-signInButton">
            Sign In
          </button>
          <p>By signing in, you agree to the terms and conditions for freedmobot.</p>
          <button onClick={register} className="login-registerButton">
            Create Your Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
