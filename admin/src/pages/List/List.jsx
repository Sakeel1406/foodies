import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
<<<<<<< HEAD

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
=======
  const token = localStorage.getItem("token");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, {
        headers: { token },
      });
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220

      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      toast.error("Server connection error");
<<<<<<< HEAD
      console.log(error);
    }
  };

  // UPDATE PRICE
=======
      console.error(error);
    }
  };

>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
  const changePrice = async (foodId, type) => {
    try {
      const response = await axios.post(
        `${url}/api/food/updateprice`,
<<<<<<< HEAD
        { id: foodId, type: type },
        headers
=======
        { id: foodId, type },
        { headers: { token } }
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
      );

      if (response.data.success) {
        setList((prev) =>
          prev.map((item) =>
            item._id === foodId
              ? {
                  ...item,
<<<<<<< HEAD
                  price:
                    type === "add"
                      ? item.price + 1
                      : item.price > 0
                      ? item.price - 1
                      : 0,
=======
                  price: type === "add" ? item.price + 1 : item.price - 1,
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
                }
              : item
          )
        );
      } else {
        toast.error("Price update failed");
      }
    } catch (error) {
      toast.error("Error updating price");
<<<<<<< HEAD
      console.log(error);
=======
      console.error(error);
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
    }
  };

  // REMOVE FOOD
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(
        `${url}/api/food/remove`,
        { id: foodId },
<<<<<<< HEAD
        headers
=======
        { headers: { token } }
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setList((prev) => prev.filter((item) => item._id !== foodId));
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      toast.error("Error removing item");
<<<<<<< HEAD
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
=======
      console.error(error);
    }
  };

  const renderStars = (rating = 0) => (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? "filled" : ""}`}>
          ★
        </span>
      ))}
    </div>
  );
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list-add">
      <p className="title">All Foods List</p>

      <div className="list-table">
<<<<<<< HEAD

=======
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
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

<<<<<<< HEAD
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

=======
        {list.map((item) => {
          const imageUrl =
            item.image && item.image.startsWith("http")
              ? item.image
              : `${url}/images/${item.image}`;

          return (
            <div key={item._id} className="list-table-format">
              <img src={imageUrl} alt={item.name} />

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

              <p className="cursor" onClick={() => removeFood(item._id)}>
                X
              </p>
            </div>
          );
        })}
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default List;
=======
export default List;
>>>>>>> 0a311298d6ec06f98250eaedb34d6643d70fc220
