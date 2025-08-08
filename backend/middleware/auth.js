// backend/middleware/auth.js

module.exports = (req, res, next) => {
  // Example dummy check - you can replace this with JWT or session auth logic
  const token = req.headers.authorization;

  if (token) {
    // You could add JWT verification here
    next();
  } else {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }
};
