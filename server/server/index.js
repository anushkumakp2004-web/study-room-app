const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const Message = require("./models/Message");
const Note = require("./models/Note");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected");

  // JOIN ROOM
  socket.on("join-room", async ({ room, username }) => {
    socket.room = room;
    socket.username = username;

    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = [];
    }

    if (!rooms[room].includes(username)) {
      rooms[room].push(username);
    }

    io.to(room).emit("users-list", rooms[room]);

    try {
      const oldMessages = await Message.find({ room })
        .sort({ createdAt: 1 });

      socket.emit("old-messages", oldMessages);
      let note = await Note.findOne({ room });

if (!note) {
  note = await Note.create({
    room,
    content: "",
  });
}

socket.emit("load-notes", note.content);
    } catch (err) {
      console.log("Error loading messages:", err);
    }

    console.log(`${username} joined ${room}`);
  });

  // NOTES
  socket.on("notes-change", async ({ room, notes }) => {
  await Note.findOneAndUpdate(
    { room },
    { content: notes },
    { upsert: true }
  );

  socket.to(room).emit("notes-change", notes);
});

  // CHAT
  socket.on("chat-message", async ({ username, room, message }) => {
    try {
      const newMessage = new Message({
        username,
        room,
        message,
      });

      await newMessage.save();

      io.to(room).emit("chat-message", {
        username,
        message,
        createdAt: newMessage.createdAt,
      });
    } catch (err) {
      console.log("Message save error:", err);
    }
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const room = socket.room;
    const username = socket.username;

    if (room && rooms[room]) {
      rooms[room] = rooms[room].filter(
        (user) => user !== username
      );

      io.to(room).emit("users-list", rooms[room]);
    }

    if (username) {
  console.log(`${username} disconnected`);
}
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});