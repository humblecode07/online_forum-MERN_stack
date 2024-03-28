import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


const Login = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: user,
        password: pwd
      });

      console.log("response: ", response.data)
      navigate('/forums/65ed796cd86faed84a62706e')
    }
    catch(err) {
      err => console.log(err);
      setErrMsg('Error occurred while logging in.');
    } 
  }

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" ref={userRef} autoComplete='off' onChange={(e) => setUser(e.target.value)} value={user} required/>

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required/>

        <button>
          Log in
        </button>
      </form>
    </section>
  )
}

export default Login
