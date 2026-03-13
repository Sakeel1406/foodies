import React from 'react'
import './Header.css'

import { assets } from '../../assets/assets' 

const Header = ({ setCategory }) => { 
    
   
    const scrollToMenu = () => {
        const menuElement = document.getElementById('explore-menu');
        if (menuElement) {
            menuElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'     
            });
        }
   
        // if (setCategory) {
        //     setCategory("All");
        // }
    }; 

    return (
        
        <div className='header' style={{ backgroundImage: `url(${assets.header_pic})` }}> 
            <div className='header-contents'>
              
                <a href='#explore-menu'>
                    <button onClick={scrollToMenu} >View Menu</button>
                </a>
            </div>
        </div>
    )
}

export default Header;