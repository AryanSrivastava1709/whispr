const express = require("express");
const { fetchMessages } = require("../controllers/messageController");
const { verifyToken } = require("../utils/auth");

const router = express.Router();

router.get("/:sender/:receiver", verifyToken, fetchMessages);

module.exports = router;
