import React, { useState } from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter menu based on search term
  const filteredMenu = menu_list.filter(item =>
    item.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menu featuring a delectable array of dishes. Our mission is to satisfy your carvings and elevate your dining experience.
      </p>

      {/* Search bar */}
      <div className="explore-menu-search-container">
  <input
    type="text"
    placeholder="Search for a food..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="explore-menu-search"
  />
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.71 20.29l-3.388-3.388a8 8 0 10-1.414 1.414l3.388 3.388a1 1 0 001.414-1.414zM10 16a6 6 0 110-12 6 6 0 010 12z"/>
  </svg>
</div>

      <div className='explore-menu-list'>
        {filteredMenu.map((item, index) => (
          <div
            onClick={() => setCategory(prev => prev === item.menu_name ? "All" : item.menu_name)}
            key={index}
            className='explore-menu-list-item'
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;