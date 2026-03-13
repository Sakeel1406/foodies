import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { token, setToken, getTotalItems } = useContext(StoreContext);

    const navigate = useNavigate();
    const location = useLocation();

    // Show menu only on home page
    const hiddenMenuPaths = ['/cart', '/order', '/myorders', '/verify'];
    const shouldHideMenu = hiddenMenuPaths.includes(location.pathname);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                
                {location.pathname !== '/' && (
                    <div className="navbar-back" onClick={() => navigate(-1)}>
                        <img src={assets.back_arrow_icon} alt="Back" />
                        <span>Back</span>
                    </div>
                )}
                
                <Link to='/'>
                    <img src={assets.foodies_logo} alt='Logo' className='logo' />
                </Link>
            </div>

            {!shouldHideMenu && (
                <div className={`menu-toggle ${isMenuOpen ? 'is-active' : ''}`} onClick={toggleMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            )}

            {!shouldHideMenu && (
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to='/' onClick={() => { setMenu("home"); setIsMenuOpen(false) }} 
                        className={menu === "home" ? "active" : ""}>Home</Link>
                    </li>
                    <li>
                        <a href='#explore-menu' onClick={() => { setMenu("menu"); setIsMenuOpen(false) }} 
                        className={menu === "menu" ? "active" : ""}>Menu</a>
                    </li>
                    <li>
                        <a href='#app-download' onClick={() => { setMenu("mobile-app"); setIsMenuOpen(false) }} 
                        className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
                    </li>
                    <li>
                        <a href='#footer' onClick={() => { setMenu("contact-us"); setIsMenuOpen(false) }} 
                        className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                    </li>
                </ul>
            )}

            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /></Link>
                    {getTotalItems() > 0 && (
                        <div className="dot">{getTotalItems()}</div>
                    )}
                </div>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Sign in</button>
                ) : (
                    <div className="navbar-profile">
                        <img src={assets.profile_icon} alt='Profile' />
                        <ul className="nav-profile-dropdown">
                            <li onClick={() => navigate('/myorders')}>
                                <img src={assets.bag_icon} alt="" /><p>Orders</p>
                            </li>
                            <hr />
                            <li onClick={logout}>
                                <img src={assets.logout_icon} alt="" /><p>Logout</p>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;