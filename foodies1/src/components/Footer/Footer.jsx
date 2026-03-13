import React from 'react'
import './Footer.css'
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets'
const Footer = () => {
    return (

        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.foodies_logo1} alt="" />
                    <p>Foodies Delivery: Fast Food, Faster Delivery.</p>

                    <div className="footer-social-icons">

                        <h2>SOCIAL LINKS</h2>
                        <div className="social-icons-wrapper">
                            <a href="https://www.facebook.com" target="_blank" rel="noreferrer">
                                <img src={assets.facebook_icon} alt="Facebook" />
                            </a>
                            <a href="https://www.x.com" target="_blank" rel="noreferrer">
                                <img src={assets.twitter_icon} alt="X" />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
                                <img src={assets.instagram_icon} alt="Instagram" />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                                <img className="youtube-icon" src={assets.youtube_icon} alt="YouTube" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><a href='#'>Home</a></li>
                        <li><a href='#app-download'>Mobile App</a></li>
                        <li><a href='#explore-menu'>Menu</a></li>
                        <li><a href='#footer'>Privacy Policy</a></li>
                    </ul>
                </div>
                <div className="footer-content-right">
                    <h2> CONTACT US</h2>
                    <ul>
                        <li>+91-89243-57689</li>
                        <li>foodiesofficial82@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">Copyright 2025  © Foodies Limited - All Right Reserved.</p>
        </div>

    )
}

export default Footer