import React from 'react'
import { Link, useNavigate ,useLocation} from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import logo from '../assets/logo.png';

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { user,logoutUser } = useAuth()
    
  const logoutClick = () => {
    logoutUser();
        navigate('/login')
    }

  return (
    <div className="header">
        <div>
        {/* <Link id="header-logo" to="/">LOGO</Link> */}
        <img height={"75px"} width={"75px"} src={logo} alt="" />
        </div>

          <div className="links--wrapper">
              {user ? (
                              <>
                <Link to="/" className="header--link">Home</Link>
                <Link to="/profile" className="header--link">Profile</Link>

                <button onClick={logoutClick} className="btn">Logout</button>
            </>
              ) : (   
                <>
                {location.pathname === '/login' ? (
                    <Link className="btn" to="/register">Register</Link>
                ) : (
                    <Link className="btn" to="/login">Login</Link>
                )}
            </> 
              )}

        </div>
    </div>
  )
}

export default Header
