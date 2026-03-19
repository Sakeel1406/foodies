import React, { useContext, useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false); // New state for scroll

    const { token, setToken, getTotalItems } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
                setIsMenuOpen(false); // Auto-close mobile menu on scroll
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

            {/* Menu Toggle - Hidden when scrolled */}
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

            {/* Main Links - Hidden when scrolled */}
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

            <div className="navbar-right">
                <div className="navbar-search-icon">
                    <Link to='/cart'><img src={assets.basket_icon} alt="Cart" /></Link>
                    {getTotalItems() > 0 && <div className="dot">{getTotalItems()}</div>}
                </div>

                {!token ? (
                    <button className={isScrolled ? 'hide-nav-items' : ''} onClick={() => setShowLogin(true)}>Sign in</button>
                ) : (
                    <div className="navbar-profile">
                        <div className={`profile-desktop ${isScrolled ? 'hide-nav-items' : ''}`}>
                            <img src={assets.profile_icon} alt='Profile' />
                            <ul className="nav-profile-dropdown">
                                <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                                <hr />
                                <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                            </ul>
                        </div>
                        {/* Mobile Icons usually stay visible for UX, but you can add hide-nav-items here too if needed */}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar;