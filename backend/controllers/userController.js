import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";


const createToken = (id, expires = "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expires,
  });
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// REGISTER 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists)
      return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send Welcome Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Foodies!",
      html: `
        <div style="text-align:center;font-family:sans-serif">
          <h2>Welcome ${name} 🍔</h2>
          <p>Your food journey starts here.</p>
          <a href="${process.env.FRONTEND_URL}" 
             style="padding:10px 20px;background:#275e6d;color:#fff;border-radius:5px;text-decoration:none">
             Start Ordering
          </a>
        </div>
      `,
    });

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Registration failed" });
  }
};

//  LOGIN 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid credentials" });

    // Login Alert Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login Alert",
      html: `
        <div style="font-family:sans-serif">
          <h3>Hello ${user.name}</h3>
          <p>New login detected at ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Login failed" });
  }
};

// ADMIN LOGIN 
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL)
      return res.json({ success: false, message: "Unauthorized admin" });

    const admin = await userModel.findOne({ email });
    if (!admin)
      return res.json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.json({ success: false, message: "Wrong password" });

    const token = createToken(admin._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Admin login failed" });
  }
};

// FORGOT PASSWORD 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "User not found" });

    const resetToken = createToken(user._id, "15m");

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below link (valid 15 mins)</p>
        <a href="${resetLink}">${resetLink}</a>
      `,
    });

    res.json({ success: true, message: "Reset link sent" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error sending email" });
  }
};

//  RESET PASSWORD 
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (password.length < 8)
      return res.json({ success: false, message: "Password too short" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.findByIdAndUpdate(decoded.id, {
      password: hashedPassword,
    });

    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

//  GET PROFILE 
export const getProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select("-password");

    if (!user)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: "Error fetching profile" });
  }
};

//  UPDATE PROFILE 
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, address, city, pincode, phone } = req.body;

    await userModel.findByIdAndUpdate(req.userId, {
      firstName,
      lastName,
      address,
      city,
      pincode,
      phone,
    });

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    res.json({ success: false, message: "Update failed" });
  }
};