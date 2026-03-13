import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    food_list,
    url,
    getTotalCartAmount,
    discount,
    setDiscount,
    setPromoCode,
    token
  } = useContext(StoreContext);

  const [promoInput, setPromoInput] = useState("");
  const navigate = useNavigate();

  const PROMO_CODES = {
    "SAVE10": 10,
    "FOODIE20": 20,
    "FIRST50": 50,
    "BINGE5": 5,
    "SPECIAL15": 15
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 20;
  const discountAmount = (subtotal * discount) / 100;
  const finalTotal = subtotal + deliveryFee - discountAmount;

  const handlePromoSubmit = () => {
    const code = promoInput.toUpperCase().trim();
    if (subtotal === 0) {
      toast.error("Add items to your cart first!");
      return;
    }
    if (PROMO_CODES[code]) {
      setDiscount(PROMO_CODES[code]);
      setPromoCode(code);
      toast.success(`Code Applied! You saved ${PROMO_CODES[code]}%`);
      setPromoInput("");
    } else {
      if (discount > 0) {
        setDiscount(0);
        setPromoCode("");
        toast.info("Discount removed.");
      } else {
        toast.error("Invalid Promo Code. Try again.");
      }
    }
  };

  const handleCheckout = () => {
    if (subtotal === 0) {
      toast.warn("Please add items to cart before checking out");
    } else if (!token) {
      toast.warn("Please login before checking out");
    } else {
      navigate("/order");
    }
  };

  return (
    <div className="cart">
      
      {/* <div className="cart-back-container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← BACK TO MENU
        </button>
      </div> */}

      {subtotal === 0 ? (
        /* Empty State: Shown when no items are in cart */
        <div className="empty-cart-message">
          <img src={url + "/images/empty_cart.png"} alt="" style={{width: "150px", opacity: "0.5"}} />
          <h2>Your cart is currently empty</h2>
          <p>Browse our menu to add some delicious meals!</p>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            View Menu
          </button>
        </div>
      ) : (
 
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <hr />
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id}>
                    <div className="cart-items-title cart-items-item">
                      <img src={url + "/images/" + item.image} alt={item.name} />
                      <p>{item.name}</p>
                      <p>₹{item.price}</p>
                      <div className="cart-quantity-controls">
                        <span onClick={() => removeFromCart(item._id)} className="cart-q-btn">-</span>
                        <p>{cartItems[item._id]}</p>
                        <span onClick={() => addToCart(item._id)} className="cart-q-btn">+</span>
                      </div>
                      <p>₹{item.price * cartItems[item._id]}</p>
                      <p onClick={() => removeFromCart(item._id)} className="cross">x</p>
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart Totals</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>₹{subtotal}</p>
                </div>
                <hr />
                <div className="cart-total-details">
                  <p>Delivery Fee</p>
                  <p>₹{deliveryFee}</p>
                </div>
                <hr />
                {discount > 0 && (
                  <>
                    <div className="cart-total-details" style={{ color: "green", fontWeight: "500" }}>
                      <p>Discount ({discount}%)</p>
                      <p>-₹{discountAmount.toFixed(2)}</p>
                    </div>
                    <hr />
                  </>
                )}
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>₹{finalTotal > 0 ? finalTotal.toFixed(2) : 0}</b>
                </div>
              </div>
              <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
            </div>

            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, enter it here</p>
                <div className="cart-promocode-input">
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button onClick={handlePromoSubmit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;