const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token is in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check if token is in cookies (fallback)
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Get user from the token
      console.log("decoded", decoded);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = {
  isAuthenticated,
};
