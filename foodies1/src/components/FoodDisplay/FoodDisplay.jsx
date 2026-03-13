import React, { useContext, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({ category }) => {
    const { food_list, url } = useContext(StoreContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const filteredList = food_list.filter(item => 
        category === "All" || category === item.category
    );

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

    
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
                        image={url + "/images/" + item.image}
                        rating={item.rating} 
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
                    
                    <span>Page {currentPage} - {totalPages}</span>

                    <button 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default FoodDisplay;