import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ setToken }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/login");
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.adminpanel_logo} alt="Logo" />
      <div className="navbar-right">
        <img className='profile' src={assets.profile_image} alt="Profile" />
        <ul className="navbar-profile-dropdown">
           <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>LOGOUT</p></li>
        </ul>
      </div>
    </div>
  )
}
export default Navbar;