import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const googleLogin = async (req, res) => {
  const { email, name, image, googleId } = req.body;

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({
        email,
        name,
        profileImage: image,
        googleId
      });
      await user.save();
      console.log("New user created:", { email: user.email, role: user.role });
    } else {
      console.log("User logged in:", { email: user.email, role: user.role });
    }

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || "user",
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET, { expiresIn: "1d" });

    return res.status(200).json({
      message: user ? "Login successful" : "User created successfully",
      user,
      token,
    });

  } catch (error) {
    console.error("Error during Google login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getRole = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(401).json({ message: "Missing email in request body" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      role: user.role,
      id: user._id
    });
  } catch (error) {
    console.error("Error fetching user role:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyToken = (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or invalid" });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);

    res.status(200).json({
      message: "Token is valid",
      user: decoded
    });

  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
