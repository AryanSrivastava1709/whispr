const express = require("express");
const {
  register,
  login,
  logout,
  searchUser,
  addFriend,
  changeStatus,
} = require("../controllers/userController");
const { verifyToken } = require("../utils/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/:username", verifyToken, searchUser);
router.get("/addfriend/:friend", verifyToken, addFriend);
router.post("/status", verifyToken, changeStatus);

module.exports = router;
