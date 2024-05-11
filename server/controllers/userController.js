const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken, verifyToken } = require("../utils/auth");

//Register a new user
const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Please use another email/username" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email,
        username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Login a user and return a token
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Please register yourself" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials" });
    }
    user.status = "AVAILABLE";
    await user.save();
    const token = generateToken(user);
    return res.status(200).json({
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//logout user
const logout = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }
    if (req.user.email !== email) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.status = "BUSY";
    await user.save();
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Search User route
const searchUser = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Please provide a username" });
    }
    if (username === req.user.username) {
      return res
        .status(200)
        .json({ message: "You are searching for yourself" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//Friend Add route
const addFriend = async (req, res) => {
  try {
    const friendName = req.params.friend;
    if (!friendName) {
      return res.status(400).json({ message: "Please provide a friend" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    if (friendName === req.user.username) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    }
    const user = await User.findOne({ username: req.user.username });
    const friend = await User.findOne({ username: friendName });

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    user.friends.push(friend._id);
    await user.save();

    friend.friends.push(user._id);
    await friend.save();

    return res.status(200).json({ message: "Friend added successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Please provide a status" });
    }
    if (!req.user) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    const user = await User.findOne({ username: req.user.username });
    user.status = status;
    await user.save();
    return res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//test controller
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  searchUser,
  addFriend,
  getAllUsers,
  changeStatus,
};
