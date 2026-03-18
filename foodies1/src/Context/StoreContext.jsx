import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://foodies-backend-nf43.onrender.com";

  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(true); // ✅ loading state

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch food list:", error);
    }
  };

  const fetchUserData = async (authToken) => {
    try {
      const response = await axios.get(`${url}/api/user/get-profile`, {
        headers: { token: authToken },
      });
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      if (error.response?.status === 401) logout();
    }
  };

  const loadCartData = async (authToken) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token: authToken } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Failed to load cart data:", error);
    }
  };

  const syncCart = async (endpoint, itemId) => {
    if (!token) return;
    try {
      await axios.post(
        `${url}/api/cart/${endpoint}`,
        { itemId },
        { headers: { token } }
      );
    } catch (error) {
      console.error(`Failed to sync cart (${endpoint}):`, error);
    }
  };

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    syncCart("add", itemId);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const count = (prev[itemId] || 0) - 1;
      if (count <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: count };
    });
    syncCart("remove", itemId);
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUserData(null);
    setCartItems({});
    setDiscount(0);
    setPromoCode("");
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getFinalTotal = () => {
    const total = getTotalCartAmount();
    if (total === 0) return 0;
    const deliveryFee = 20;
    const discountAmount = discount > 0 ? (total * discount) / 100 : 0;
    return total + deliveryFee - discountAmount;
  };

  // ✅ Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Initial data load
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      await fetchFoodList();
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
        await fetchUserData(storedToken);
      } else {
        // ✅ Load guest cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cartItems")) || {};
        setCartItems(savedCart);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalItems,
    getFinalTotal,
    url,
    token,
    setToken,
    userData,
    setUserData,
    logout,
    discount,
    setDiscount,
    promoCode,
    setPromoCode,
    loading, // ✅ expose loading
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;