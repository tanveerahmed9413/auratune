const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue" });
  }

  try {
    if (await redis.get(token)) {
      return res.status(401).json({ message: "Session expired, please log in again" });
    }
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

module.exports = authUser;
