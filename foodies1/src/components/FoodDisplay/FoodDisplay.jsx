import React, { useContext, useState, useEffect, useMemo } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list, url } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Reset page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  // Filter foods (memoized for performance)
  const filteredList = useMemo(() => 
    (food_list || []).filter(item => category === "All" || category === item.category)
  , [food_list, category]);

  // Pagination calculation (memoized)
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredList.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {currentItems.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            rating={item.rating || 0}
            // Handle Cloudinary or local uploads with fallback
            image={
              item.image
                ? item.image.startsWith("http")
                  ? item.image
                  : `${url}/images/${item.image}`
                : "/placeholder.png"
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>

          <span>Page {currentPage} of {totalPages}</span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
