import userModel from "../models/userModel.js";


const updateCartInDb = async (userId, cartData) => {

  return await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
};


export const addToCart = async (req, res) => {
  try {
    const userId = req.userId; 
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    // Logic to increment quantity
    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await updateCartInDb(userId, cartData);
    res.json({ success: true, message: "Added to cart" });

  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Error adding item to cart" });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    // Logic to decrement item count
    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      
      // Clean up the key if the quantity reaches 0
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    } else {
      delete cartData[itemId];
    }

    await updateCartInDb(userId, cartData);
    res.json({ success: true, message: "Removed from cart" });

  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Error removing item from cart" });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });

  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Error fetching cart data" });
  }
};