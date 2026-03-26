import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// EMAIL SETUP (SAFE)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
});

const sendSafeEmail = async (options) => {
  try {
    await transporter.sendMail(options);
    console.log("Email sent");
  } catch (error) {
    console.error("Email failed:", error.message);
  }
};

// 1. PLACE ORDER
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address, amount, discountPercent = 0 } = req.body;

    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty." });

    const discountAmount =
      discountPercent > 0 ? (amount * discountPercent) / 100 : 0;

    const finalAmount = amount - discountAmount + 20;

    const newOrder = new orderModel({
      userId,
      items,
      address,
      amount: finalAmount,
      discount: discountAmount,
      status: "Payment Pending",
      payment: false,
    });

    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Fee" },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });

    const sessionOptions = {
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
      metadata: {
        userId: userId.toString(),
        orderId: newOrder._id.toString(),
      },
    };

    if (discountPercent > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discountPercent,
        duration: "once",
      });
      sessionOptions.discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ success: false, message: "Order placement failed." });
  }
};

// 2. VERIFY ORDER (FIXED)
export const verifyOrder = async (req, res) => {
  try {
    const { success, orderId, session_id } = req.body;

    if (success === "true" || success === true) {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        const updatedOrder = await orderModel.findByIdAndUpdate(
          orderId,
          { payment: true, status: "Order Placed" },
          { new: true }
        );

        const user = await userModel.findByIdAndUpdate(
          session.metadata.userId,
          { cartData: {} },
          { new: true }
        );

        // SEND RESPONSE FIRST
        res.json({ success: true, message: "Order verified" });

        // EMAIL AFTER RESPONSE (NO CRASH)
        sendSafeEmail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Order Confirmed - #${orderId.slice(-6).toUpperCase()}`,
          html: `<h2>Order Confirmed</h2>
                 <p>Hi ${user.name}, your payment of ₹${updatedOrder.amount} was successful.</p>`,
        });

        return;
      }
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "Payment failed." });

  } catch (error) {
    console.error("Verify Order Error:", error);
    res.status(500).json({ success: false, message: "Verification failed." });
  }
};

// 3. USER ORDERS
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders." });
  }
};

// 4. UPDATE STATUS (ADMIN)
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder)
      return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, data: updatedOrder });

  } catch (error) {
    res.status(500).json({ success: false, message: "Status update failed." });
  }
};

// 5. LIST ORDERS
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch {
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// 6. FEEDBACK
export const addFeedback = async (req, res) => {
  try {
    const { orderId, feedback } = req.body;

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { feedback },
      { new: true }
    );

    if (!updatedOrder)
      return res.json({ success: false, message: "Order not found." });

    res.json({ success: true, message: "Feedback submitted!" });

  } catch {
    res.status(500).json({ success: false, message: "Error saving feedback" });
  }
};

// 7. GET USER DATA
export const getUserData = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password");

    if (!user)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, userData: user });

  } catch {
    res.status(500).json({ success: false });
  }
};

// 8. UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, address, city, pincode, phone } = req.body;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        { name: fullName, address, city, pincode, phone },
        { new: true }
      )
      .select("-password");

    if (!updatedUser)
      return res.status(404).json({ success: false });

    res.json({ success: true, userData: updatedUser });

  } catch {
    res.status(500).json({ success: false });
  }
};