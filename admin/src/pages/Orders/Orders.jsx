import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem("token");

const fetchAllOrders = async () => {
    try {
        const response = await axios.get(`${url}/api/order/list`, { headers: { token } });
        if (response.data.success) {
            setOrders(response.data.data);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error("Frontend Fetch Error:", error);
        toast.error("Could not fetch orders");
    }
};

    const statusHandler = async (event, orderId) => {
        try {
            const response = await axios.post(`${url}/api/order/status`, {
                orderId,
                status: event.target.value
            }, { headers: { token } });
            
            if (response.data.success) {
                await fetchAllOrders();
                toast.success("Status Updated");
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div className='order add'>
            <h3>Admin Order Page</h3>
            <div className="order-list">
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={order._id || index} className='order-item'>
                            <img src={assets.parcel_icon} alt="parcel-icon" />
                            <div>
                                <p className='order-item-food'>
                                    {order.items && order.items.length > 0 
                                        ? order.items.map((item, idx) => `${item.name} x ${item.quantity}`).join(", ")
                                        : "No items listed"}
                                </p>
                                
                               
                                <p className='order-item-name'>
                                    {order.address.firstName 
                                        ? `${order.address.firstName} ${order.address.lastName}` 
                                        : (order.address.fullName || "No Name Provided")}
                                </p>
                                <div className='order-item-address'>
                                    <p>{order.address.street || order.address.address || "No Street Info"},</p>
                                    <p>
                                        {order.address.city}, {order.address.state || ""}, {order.address.zipcode || ""}
                                    </p>
                                </div>
                                <p className='order-item-phone'>{order.address.phone}</p>
                            </div>
                            
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            
                            <div className="order-price-details">
                                <p className='order-amount'>Total: ₹{order.amount}</p>
                                {order.discount > 0 && (
                                    <p style={{ color: "green", fontSize: "14px", fontWeight: "600" }}>
                                        Discount: -₹{order.discount}
                                    </p>
                                )}
                            </div>

                            <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                                <option value="Food Processing">Food Processing</option>
                                <option value="Out for delivery">Out for delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Orders;