const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blackList.model");
const redis = require("../config/cache")

// Cross-site cookies (separate frontend domain) need SameSite=None + Secure in production
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 3 * 24 * 60 * 60 * 1000,
};

async function registerUser(req, res) {

  const { username, email, password } = req.body;

  if (!username || !email || !password || password.length < 6) {
    return res.status(400).json({
      message: "Username, email and a password of at least 6 characters are required",
    });
  }

  const isAlreadyExist = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isAlreadyExist) {
    return res.status(400).json({
      message: "user with the same email or username already exist",
    });
  }

  let hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash,
  });

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    message: "user register successfully",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}
async function loginUser(req, res) {
  const { username, email, password } = req.body;

  if (!password || (!username && !email)) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await userModel.findOne({
    $or: [username && { username }, email && { email }].filter(Boolean),
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "invalid credentials",
    });
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
   return res.status(400).json({
      message: "invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token, cookieOptions)

  return res.status(200).json({
    message: "user login successfully",
    token,
    user: {
        id: user._id,
        username: user.username,
        email: user.email
    }
  })
}

async function getMe(req,res){
  const user = await userModel.findById(req.user.id)

  return res.status(200).json({
    message: 'User fetch successfully',
    user
  })
}

async function logoutUser(req,res){
  const token = req.cookies.token

  res.clearCookie('token', { httpOnly: true, secure: isProd, sameSite: isProd ? "none" : "lax" })

  // Blacklist for the token's remaining lifetime (3 days)
  if (token) await redis.set(token, Date.now().toString(), "EX", 3 * 24 * 60 * 60)

  return res.status(200).json({
    message: "Logout Successfully"
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser
};
