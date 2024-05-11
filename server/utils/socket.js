const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const generateText = require("../utils/languageModel");
const dotenv = require("dotenv");
dotenv.config();

const socketHandler = (socket) => {
  console.log("New connection");

  // Authenticate the user
  socket.on("authenticate", (data) => {
    const { token } = data;
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
          return socket.emit("error", "Invalid token");
        }
        socket.userId = user.id;
        socket.join(user.id);
        console.log(`User authenticated with ${user.id}`);
        console.log(`Socket ID: ${socket.userId}`);
      });
    } catch (err) {
      socket.disconnect();
      return socket.emit("error", "Invalid token");
    }
  });

  // Send a private message
  socket.on("private-message", async (data) => {
    const { recepient, content } = data;

    try {
      const recepientUser = await User.findById(recepient);
      if (!recepientUser) {
        return socket.emit("error", "User not found");
      }
      if (recepientUser.status === "BUSY") {
        const llmResponse = await generateText(content);

        const senderMessage = new Message({
          sender: socket.userId,
          recipient: recepient,
          content,
        });

        const llmResponseMessage = new Message({
          sender: recepient,
          recipient: socket.userId,
          content: llmResponse,
        });

        await senderMessage.save();
        await llmResponseMessage.save();

        socket.to(recepient).emit("receive-message", senderMessage);
        socket.to(socket.userId).emit("receive-message", llmResponseMessage);
      } else {
        // Create a new message
        const newMessage = new Message({
          sender: socket.userId,
          recipient: recepient,
          content,
        });

        // Save the message to the database
        await newMessage.save();

        // Emit the message to the recipient
        socket.to(recepient).emit("receive-message", newMessage);
      }
    } catch (err) {
      console.error("Error sending private message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

module.exports = socketHandler;
