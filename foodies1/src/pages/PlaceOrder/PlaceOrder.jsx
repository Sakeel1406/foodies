import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PlaceOrder.css";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    cartItems,
    food_list,
    getTotalCartAmount,
    token,
    url,
    userData,
    setUserData,
    discount,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  // Calculate amounts
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 20;
  const discountAmount = discount > 0 ? (subtotal * discount) / 100 : 0;
  const totalAmount = subtotal + deliveryFee - discountAmount;

 
  useEffect(() => {
    if (!token) {
      toast.error("Please login to proceed");
      navigate("/cart");
    } else if (subtotal === 0) {
      toast.warn("Your cart is empty");
      navigate("/cart");
    }
  }, [token, subtotal, navigate]);

  
  useEffect(() => {
    if (userData && isInitialLoad) {
      const nameParts = userData.name ? userData.name.trim().split(/\s+/) : [];
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "";

      setAddress({
        firstName: userData.firstName || fName,
        lastName: userData.lastName || lName,
        email: userData.email || "",
        address: userData.address || "",
        city: userData.city || "",
        pincode: userData.pincode || "",
        phone: userData.phone || "",
      });
      

      setIsInitialLoad(false);
    }
  }, [userData, isInitialLoad]);

  const onChangeHandler = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    const items = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    try {
      const updateRes = await axios.post(
        `${url}/api/user/update-profile`,
        address,
        { headers: { token } }
      );

      if (updateRes.data.success) {
        setUserData(updateRes.data.userData); 
      }

      
      const orderData = {
        address,
        items,
        amount: totalAmount,
        discountPercent: discount,
      };

      const res = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (res.data.success) {
        const { session_url } = res.data;
        toast.info("Redirecting to payment...");
        window.location.replace(session_url); 
      } else {
        toast.error(res.data.message || "Order placement failed.");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err.response?.data?.message || "Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            value={address.firstName}
            onChange={onChangeHandler}
            placeholder="First Name"
            type="text"
            required
          />
          <input
            name="lastName"
            value={address.lastName}
            onChange={onChangeHandler}
            placeholder="Last Name"
            type="text"
            required
          />
        </div>
        <input
          name="email"
          type="email"
          value={address.email}
          onChange={onChangeHandler}
          placeholder="Email address"
          required
        />
        <input
          name="address"
          value={address.address}
          onChange={onChangeHandler}
          placeholder="Street Address"
          type="text"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            value={address.city}
            onChange={onChangeHandler}
            placeholder="City"
            type="text"
            required
          />
          <input
            name="pincode"
            value={address.pincode}
            onChange={onChangeHandler}
            placeholder="Pincode"
            type="text"
            required
          />
        </div>
        <input
          name="phone"
          value={address.phone}
          onChange={onChangeHandler}
          placeholder="Phone Number"
          type="tel"
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹{subtotal}</p>
          </div>
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>₹{deliveryFee}</p>
          </div>
          {discount > 0 && (
            <div className="cart-total-details" style={{ color: "green" }}>
              <p>Discount ({discount}%)</p>
              <p>-₹{discountAmount.toFixed(2)}</p>
            </div>
          )}
          <hr />
          <div className="cart-total-details total">
            <b>Total</b>
            <b>₹{totalAmount.toFixed(2)}</b>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "PROCESSING..." : `PAY ₹${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;