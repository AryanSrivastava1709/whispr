const Message = require("../models/Message");

//fetch all the messages between two users

const fetchMessages = async (req, res) => {
  try {
    console.log("fetching messages");
    const { sender, receiver } = req.params;

    if (!sender || !receiver) {
      return res
        .status(400)
        .json({ message: "Please provide sender and receiver" });
    }
    if (sender === receiver) {
      return res
        .status(400)
        .json({ message: "You cannot search for yourself" });
    }
    const messages = await Message.find({
      $or: [
        { sender: sender, recipient: receiver },
        { sender: receiver, recipient: sender },
      ],
    })
      .populate("sender", "username")
      .populate("recipient", "username");
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { fetchMessages };
