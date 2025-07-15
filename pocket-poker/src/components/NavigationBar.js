import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown'; // Import Dropdown component
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavigationBar.css';
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

function NavigationBar() {
  const [userSession, setUserSession] = useState(null)
  const [user, setUser] = useState(null)
  const [logoutStatus, setLogoutStatus] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [])

  // Fetches user data to change the sign in / sign out dropdown
  // const onButtonHover = async() => {
  //   const {session} = supabase.auth.getSession()
  //   const { data: { user }, error } = await supabase.auth.getUser()
  //   try {
  //     if(error) {
  //       console.log(error)
  //     }
  //     if(user){
  //       setUser(user)
  //     } else {
  //       setUser(null)
  //     }
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  const onLogoutButtonClick = async() => {
     const {error} = await supabase.auth.signOut() 
     if(!error) {
      setLogoutStatus('You are now logged off. Thanks for playing.')
     }
  }
  return (
    
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img src="/logo.svg" alt="Pocket Poker Logo" width="125" height="125" className="d-inline-block align-top" />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <ul className='nav-li'>
              <li><Nav.Link href="/">Pocket Poker</Nav.Link></li>
              <li><Nav.Link href="/SB">SB</Nav.Link></li>
              <li><Nav.Link href="/Report">Report</Nav.Link></li>
            </ul>
            {/* Use Dropdown component instead of NavDropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                { user ? 'Logout' : 'Log In/Sign Up' }
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-right">
               { !user && <Dropdown.Item href="/login">Log In</Dropdown.Item> }
               { !user && <Dropdown.Item href="/Register">Sign Up</Dropdown.Item> }
               { user &&  <Dropdown.Item onClick={onLogoutButtonClick}>Sign Out</Dropdown.Item> }
              </Dropdown.Menu>
            </Dropdown>
            <label className="errorLabel">&nbsp;{logoutStatus}</label>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
