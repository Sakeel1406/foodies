import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "https://foodies-backend-nf43.onrender.com";

  // --- State Management ---
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");

  // --- API Calls ---

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
      const response = await axios.get(`${url}/api/order/get-profile`, {
        headers: { token: authToken },
      });
      if (response.data.success) {
        setUserData(response.data.userData);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // If profile fetch fails due to auth, logout
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

  // --- Cart Actions ---

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

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
    await syncCart("add", itemId);
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const count = (prev[itemId] || 0) - 1;
      if (count <= 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: count };
    });
    await syncCart("remove", itemId);
  };

  // --- Authentication ---

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUserData(null);
    setCartItems({});
    setDiscount(0);
    setPromoCode("");
  };

  // --- Calculations ---

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getFinalTotal = () => {
    const total = getTotalCartAmount();
    const deliveryFee = total === 0 ? 0 : 20;
    const discountAmount = discount > 0 ? (total * discount) / 100 : 0;
    return total > 0 ? total + deliveryFee - discountAmount : 0;
  };

  // --- Initial Data Load ---

  useEffect(() => {
    async function loadData() {
      // 1. Always fetch the food list
      await fetchFoodList();

      // 2. If token exists, fetch user-specific data
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
        await fetchUserData(storedToken);
      }
    }
    loadData();
  }, [token]); // Re-runs when token changes (login/logout)

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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
