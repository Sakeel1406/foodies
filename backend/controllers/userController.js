import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import nodemailer from "nodemailer";


// JWT TOKEN HELPER

const createToken = (id, expires = "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expires
  });
};


//     EMAIL TRANSPORTER

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


//     USER REGISTRATION

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword
    });

    // Welcome Email
    const welcomeOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Foodies!",
      html: `<div style="font-family: sans-serif; text-align: center;">
              <h1 style="color: #275e6d;">Welcome, ${name}!</h1>
              <p>Delicious meals are just a few clicks away.</p>
              <a href="${process.env.FRONTEND_URL}" style="background: #275e6d; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Ordering</a>
            </div>`
    };
    transporter.sendMail(welcomeOptions);

    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: "Registration failed" });
  }
};


//  USER LOGIN

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Login Alert Email
    const loginMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "New Login Detected - Foodies",
      html: `<div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #275e6d;">Hello ${user.name},</h2>
              <p>You have successfully logged into your account at ${new Date().toLocaleString()}.</p>
            </div>`
    };
    transporter.sendMail(loginMailOptions);

    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    res.json({ success: false, message: "Login failed" });
  }
};


//     ADMIN LOGIN

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email !== "foodiesofficial82@gmail.com") {
      return res.json({ success: false, message: "Unauthorized admin email" });
    }
    const admin = await userModel.findOne({ email });
    if (!admin) {
      return res.json({ success: false, message: "Admin account not found" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid admin password" });
    }
    const token = createToken(admin._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: "Admin login failed" });
  }
};


//     FORGOT & RESET PASSWORD

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const resetToken = createToken(user._id, "15m");
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<h3>Reset Your Password</h3><p>Click <a href="${resetLink}">here</a> to reset. Valid for 15 mins.</p>`
    });

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (error) {
    res.json({ success: false, message: "Failed to send reset email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    if (password.length < 8) return res.json({ success: false, message: "Password too short" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await userModel.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.json({ success: false, message: "Token invalid or expired" });
  }
};


//     PROFILE ACTIONS (PERSISTENT ADDRESS)


// Used to fetch user details to auto-fill the form on mount
export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: "Error fetching profile" });
  }
};

// Used to save the address during checkout for future use
export const updateProfile = async (req, res) => {
  const { firstName, lastName, address, city, pincode, phone } = req.body;
  try {
    await userModel.findByIdAndUpdate(req.userId, {
      firstName,
      lastName,
      address,
      city,
      pincode,
      phone
    });
    res.json({ success: true, message: "Address saved for next time!" });
  } catch (error) {
    res.json({ success: false, message: "Failed to update address" });
  }
};