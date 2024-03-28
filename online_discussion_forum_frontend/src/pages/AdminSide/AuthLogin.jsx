import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import useInput from '../../hooks/useInput';
import useToggle from '../../hooks/useToggle';
// import useRefreshToken from '../../hooks/useRefreshToken';

const LOGIN_URL = '/login';

const AuthLogin = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [email, resetEmail, resetAttribute] = useInput('user', '');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [check, toggleCheck] = useToggle('persist', false)
  

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({ email: email, password: pwd }), {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );  
      console.log(response.data)

      const accessToken = response.data.token;

      // window.localStorage.setItem("isLoggedIn", true)

      setAuth({ email, accessToken });
      resetEmail()
      setPwd('')
      navigate(from, { replace: true });
    }
    catch(err) {
        if (!err.response) {
            setErrMsg('No Server Response')
        }    
        else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        }
        else if (err.response?.status === 401) {
            setErrMsg('Unauthorized')
        }
        else {
            setErrMsg('Auth Failed');
        }
        errRef.current.focus();
    }
  }

  // useEffect(() => {
  //   console.log("a")
  // }, [])

  return (
    <section>
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <h1>Authorized Personnel only</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" ref={userRef} autoComplete='off' {...resetAttribute} required/>

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required/>

        <button>
          Log in
        </button>
        <div>
          <input type="checkbox" id="persist" onChange={toggleCheck} checked={check}/>
          <label htmlFor="persist">Trust this device</label>
        </div>
      </form>
    </section>
  )
 }

export default AuthLogin
