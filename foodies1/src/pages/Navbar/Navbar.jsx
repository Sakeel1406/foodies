import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { token, setToken, getTotalItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll listener to hide/show elements
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
                setIsMenuOpen(false); // Mobile menu-va scroll pannum pothu close panniduvom
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const hiddenMenuPaths = ['/cart', '/order', '/myorders', '/verify'];
    const shouldHideMenu = hiddenMenuPaths.includes(location.pathname);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    return (
        <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            
            {/* --- Left Side: Logo & Back Button --- */}
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

            {/* --- Center: Menu Toggle (Hamburger) --- */}
            {!shouldHideMenu && (
                <div
                    className={`menu-toggle ${isMenuOpen ? 'is-active' : ''} ${isScrolled ? 'hide-nav-items' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            )}

            {/* --- Center: Navigation Links --- */}
            {!shouldHideMenu && (
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''} ${isScrolled ? 'hide-nav-items' : ''}`}>
                    <li>
                        <Link to='/' onClick={() => { setMenu("home"); setIsMenuOpen(false); }} className={menu === "home" ? "active" : ""}>Home</Link>
                    </li>
                    <li>
                        <a href='#explore-menu' onClick={() => { setMenu("menu"); setIsMenuOpen(false); }} className={menu === "menu" ? "active" : ""}>Menu</a>
                    </li>
                    <li>
                        <a href='#app-download' onClick={() => { setMenu("mobile-app"); setIsMenuOpen(false); }} className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
                    </li>
                    <li>
                        <a href='#footer' onClick={() => { setMenu("contact-us"); setIsMenuOpen(false); }} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                    </li>
                </ul>
            )}

            {/* --- Right Side: Cart & Profile/Login --- */}
            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /></Link>
                    {getTotalItems() > 0 && <div className="dot">{getTotalItems()}</div>}
                </div>

                {!token ? (
                    <button className={isScrolled ? 'hide-nav-items' : ''} onClick={() => setShowLogin(true)}>Sign in</button>
                ) : (
                    <div className={`navbar-profile ${isScrolled ? 'hide-nav-items' : ''}`}>
                        
                        {/* Desktop View: Normal Dropdown */}
                        <div className="profile-desktop">
                            <img src={assets.profile_icon} alt='Profile' />
                            <ul className="nav-profile-dropdown">
                                <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                                <hr />
                                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                            </ul>
                        </div>

                        {/* Mobile View: Horizontal Bag & Logout Icons */}
                        <div className="profile-mobile-icons">
                            <img src={assets.bag_icon} alt="Orders" onClick={() => navigate('/myorders')} className="nav-icon-sm" />
                            <img src={assets.logout_icon} alt="Logout" onClick={logout} className="nav-icon-sm" />
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;