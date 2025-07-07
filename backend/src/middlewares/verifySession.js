import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifySession = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: "Token expired", 
        code: "TOKEN_EXPIRED"
      });
    }
    
    console.error("Token verification failed:", err);
    return res.status(401).json({ 
      message: "Token invalid",
      code: "TOKEN_INVALID"
    });
  }
};

export default verifySession;
