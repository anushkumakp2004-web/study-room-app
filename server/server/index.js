console.log("SERVER VERSION: CORS FIX APPLIED");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Room = require("./models/Room");
require("dotenv").config();

const Message = require("./models/Message");
const Note = require("./models/Note");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://study-room-app-eight.vercel.app",
    ],
    credentials: true,
  })
);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://study-room-app-eight.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("canvas-clear", (room) => {
  socket.to(room).emit("canvas-clear");
});
  socket.on(
  "create-room",
  async ({ roomId, password }, callback) => {
    const existing = await Room.findOne({
      roomId,
    });

    if (existing) {
      callback({
        success: false,
        message: "Room already exists",
      });

      return;
    }

    await Room.create({
      roomId,
      password,
    });

    callback({
      success: true,
    });
  }
);
  socket.on("canvas-update", ({ room, data }) => {
  console.log("Canvas received:", room);

  socket.to(room).emit("canvas-update", data);

  console.log("Canvas broadcasted");
});
  socket.on("canvas-clear", (room) => {
  socket.to(room).emit("canvas-clear");
});
  console.log("User connected");

  // JOIN ROOM
socket.on(
  "join-room",
  async ({ room, username }, callback) => {
    try {
      socket.room = room;
      socket.username = username;

      socket.join(room);

      // Online users
      if (!rooms[room]) {
        rooms[room] = [];
      }

      if (!rooms[room].includes(username)) {
        rooms[room].push(username);
      }

      io.to(room).emit("users-list", rooms[room]);

      // Old messages
      const oldMessages = await Message.find({
        room,
      }).sort({ createdAt: 1 });

      socket.emit("old-messages", oldMessages);

      // Load notes
      let note = await Note.findOne({
        room,
      });

      if (!note) {
        note = await Note.create({
          room,
          content: "",
        });
      }

      socket.emit("load-notes", note.content);

      console.log(`${username} joined ${room}`);
    } catch (err) {
      console.log("Join room error:", err);
    }
  }
);
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