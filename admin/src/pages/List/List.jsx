import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const token = localStorage.getItem("token");

  const headers = {
    headers: {
      token: token,
    },
  };

  // FETCH FOOD LIST
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, headers);

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      toast.error("Server connection error");
      console.log(error);
    }
  };

  // UPDATE PRICE
  const changePrice = async (foodId, type) => {
    try {
      const response = await axios.post(
        `${url}/api/food/updateprice`,
        { id: foodId, type: type },
        headers
      );

      if (response.data.success) {
        setList((prev) =>
          prev.map((item) =>
            item._id === foodId
              ? {
                  ...item,
                  price:
                    type === "add"
                      ? item.price + 1
                      : item.price > 0
                      ? item.price - 1
                      : 0,
                }
              : item
          )
        );
      } else {
        toast.error("Price update failed");
      }
    } catch (error) {
      toast.error("Error updating price");
      console.log(error);
    }
  };

  // REMOVE FOOD
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
        headers
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setList((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      toast.error("Error removing item");
      console.log(error);
    }
  };

  // STAR RATING
  const renderStars = (rating = 0) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-add">
      <p className="title">All Foods List</p>

      <div className="list-table">

        <div className="list-table-format title">
          <b className="image">Image</b>
          <b className="name">Name</b>
          <b className="hide-on-mobile">Category</b>
          <b className="price">Price</b>
          <b className="rating">Rating</b>
          <b className="action">Action</b>
        </div>

        {list.length === 0 && (
          <p style={{ padding: "20px", textAlign: "center" }}>
            No food items found
          </p>
        )}

        {list.map((item) => (
          <div key={item._id} className="list-table-format">
            <img
              src={`${url}/images/${item.image}`}
              alt={item.name}
            />

            <p>{item.name}</p>

            <p className="hide-on-mobile">{item.category}</p>

            <div className="price-controls">
              <span
                className="price-btn"
                onClick={() => changePrice(item._id, "sub")}
              >
                -
              </span>

              <p>₹{item.price}</p>

              <span
                className="price-btn"
                onClick={() => changePrice(item._id, "add")}
              >
                +
              </span>
            </div>

            {renderStars(item.rating)}

            <p
              className="cursor"
              onClick={() => removeFood(item._id)}
            >
              X
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default List;