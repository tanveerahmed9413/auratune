const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListModel = require("../models/blackList.model");
const redis = require("../config/cache")

async function registerUser(req, res) {

  const { username, email, password } = req.body;

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

  res.cookie("token", token);

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

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
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

  res.cookie("token",token)

  return res.status(201).json({
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
  let token = req.cookies.token

  res.clearCookie('token')


  
   await redis.set(token,Date.now().toString(),"EX", 60*60)

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
