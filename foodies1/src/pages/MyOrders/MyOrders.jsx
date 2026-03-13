import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [feedbackData, setFeedbackData] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);

  const { url, token } = useContext(StoreContext);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.post(`${url}/api/order/userorders`, {}, { headers: { token } });
      if (res.data.success) {
        setOrders(res.data.data.reverse());
      }
    } catch (error) {
      toast.error("Error loading your orders.");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  const cancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const res = await axios.post(`${url}/api/order/status`, 
          { orderId, status: "Cancelled" }, 
          { headers: { token } }
        );
        if (res.data.success) {
          toast.success("Order cancelled successfully");
          fetchOrders(); // Refresh orders to get the new status and timestamp
        }
      } catch (error) {
        toast.error("Failed to cancel order.");
      }
    }
  };

  const submitFeedback = async (orderId) => {
    const feedbackText = feedbackData[orderId];
    if (!feedbackText?.trim()) {
      toast.warn("Please enter feedback before submitting.");
      return;
    }
    try {
      setSubmittingId(orderId);
      const res = await axios.post(`${url}/api/order/feedback`, 
        { orderId, feedback: feedbackText }, 
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Feedback submitted!");
        setSubmittedFeedback((prev) => [...prev, orderId]);
        setFeedbackData((prev) => ({ ...prev, [orderId]: "" }));
        fetchOrders();
      }
    } catch (error) {
      toast.error("Error submitting feedback.");
    } finally {
      setSubmittingId(null);
    }
  };

  // Fetch orders on mount
  useEffect(() => {
    if (token) fetchOrders();
  }, [token, fetchOrders]);

  // Update clock every 30 seconds for higher accuracy on the 10-min filter
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter: Shows all active orders, but only shows Cancelled orders for 10 minutes
  const displayedOrders = useMemo(() => {
    return orders.filter((order) => {
      if (order.status !== "Cancelled") return true;

      const orderUpdateTime = new Date(order.updatedAt || order.date).getTime();
      const tenMinutesInMs = 10 * 60 * 1000;
      
      return currentTime - orderUpdateTime < tenMinutesInMs;
    });
  }, [orders, currentTime]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading your delicious history...</p>
          </div>
        ) : displayedOrders.length > 0 ? (
          displayedOrders.map((order) => (
            <div
              key={order._id}
              className={`my-orders-order ${order.status === "Cancelled" ? "order-cancelled" : ""}`}
            >
              <img src={assets.parcel_icon} alt="parcel" />

              <div className="order-details-col">
                <p className="order-items">
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity}
                      {idx !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                
                <div className="order-price-info">
                   {order.discount > 0 && (
                     <p className="discount-applied">
                       Discount Applied: <span>-₹{order.discount}.00</span>
                     </p>
                   )}
                   <p className="order-amount">Total: ₹{order.amount}.00</p>
                </div>

                {order.status === "Delivered" && !order.feedback && !submittedFeedback.includes(order._id) && (
                  <div className="feedback-section">
                    <p><b>How was your meal?</b></p>
                    <div className="feedback-input-group">
                      <input
                        type="text"
                        placeholder="Leave feedback..."
                        value={feedbackData[order._id] || ""}
                        onChange={(e) => setFeedbackData((prev) => ({ ...prev, [order._id]: e.target.value }))}
                      />
                      <button
                        onClick={() => submitFeedback(order._id)}
                        className="feedback-btn"
                        disabled={submittingId === order._id}
                      >
                        {submittingId === order._id ? "..." : "Submit"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="order-status-container">
                <p className="order-status">
                  <span className={order.status === "Cancelled" ? "status-dot-cancelled" : "status-dot-active"}>
                    ●
                  </span>
                  <b className={order.status === "Cancelled" ? "status-text-cancelled" : ""}>
                    {" "}{order.status}
                  </b>
                </p>
                {order.status === "Cancelled" && (
                  <small className="fade-text">(Removing from list shortly)</small>
                )}
              </div>

              <div className="order-actions">
                <button className="track-btn" onClick={fetchOrders}>
                  Track Order
                </button>

                {(order.status === "Order Placed" || 
                  order.status === "Food Processing" || 
                  order.status === "Payment Pending") && (
                  <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
              // <p className="order-status">
              //   <span className={order.status === "Cancelled" ? "status-dot-cancelled" : "status-dot-active"}>●</span>
              //   <b className={order.status === "Cancelled" ? "status-text-cancelled" : ""}>
              //     {" "}{order.status}
              //   </b>
              //   {order.status === "Cancelled" && (
              //     <span style={{display:'block', fontSize: '10px', color: '#666'}}>
              //       (Removing from list shortly)
              //     </span>
              //   )}