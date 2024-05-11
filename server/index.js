const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/messageRoutes");
const { getAllUsers } = require("./controllers/userController");
const socketHandler = require("./utils/socket");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.status(200).send("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.use("/all", getAllUsers);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", socketHandler);

server.listen(process.env.PORT || 5000, () => {
  console.log("Server is running on port 3000");
});
