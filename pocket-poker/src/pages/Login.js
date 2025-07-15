import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from "@supabase/supabase-js"
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);
const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [SignInStatus, setSignInStatus] = useState('')
  const [userSession, setUserSession] = useState({})
  const navigate = useNavigate()


  //Logs the user in and redirects to home them if successful
  //If the login fails it shows a fail label
  const onButtonClick = async() => {
    // You'll update this function later...
    const { data, error } = await supabase.auth.signInWithPassword({'email':email, 'password':password})
    const session = supabase.auth.getSession()
    console.log(session, data,error)
    if(data && !error) {
      setSignInStatus("Logged in Successfully.")
      setUserSession(session)
      navigate('/')
    }
    if(error){
      setSignInStatus("Error: Password and/or email is wrong. Try again.")
    }
  }

  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          type="password"
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
      <label className="errorLabel">{SignInStatus}</label>
    </div>
  )
}

export default Login
