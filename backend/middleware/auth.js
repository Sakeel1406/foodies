import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    let token = req.headers.token;

    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Login Again" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or Expired Token" 
    });
  }
};

export default authMiddleware;
