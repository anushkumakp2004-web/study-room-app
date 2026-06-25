console.log("SERVER BUILD: JUNE22-TEST-123");
console.log("SERVER VERSION: CORS FIX APPLIED");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Room = require("./models/Room");
const userSockets = {};
require("dotenv").config();

const Message = require("./models/Message");
const Note = require("./models/Note");
const Whiteboard = require("./models/Whiteboard");
const Poll = require("./models/Poll");

const app = express();
app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://study-room-app-eight.vercel.app",
  "https://study-room-dsqgvwxby-anushbuilds.vercel.app",
  "https://study-room-9lgg9eb7i-anushbuilds.vercel.app",
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
  "https://study-room-dsqgvwxby-anushbuilds.vercel.app",
  "https://study-room-9lgg9eb7i-anushbuilds.vercel.app",
],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("🔥 CLIENT CONNECTED:", socket.id);

  socket.emit(
    "server-test",
    "hello from backend"
  );

  socket.onAny((event) => {
    console.log("EVENT RECEIVED:", event);
  });
  socket.on("kick-user", ({ username, room }) => {
  const targetSocketId = userSockets[username];

  if (!targetSocketId) return;

  io.to(targetSocketId).emit("kicked");

  const targetSocket = io.sockets.sockets.get(
    targetSocketId
  );

  if (targetSocket) {
    targetSocket.leave(room);
  }
});
  console.log("SOCKET CONNECTED:", socket.id);
  socket.on("canvas-clear", (room) => {
  socket.to(room).emit("canvas-clear");
});
  socket.on(
  "create-room",
  async ({ roomId, password, owner }, callback) => {
    console.log("CREATE ROOM EVENT RECEIVED");

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
      owner,
    });

    callback({
      success: true,
    });
  }
);
socket.on(
  "create-poll",
  async ({ room, question, options }) => {

    console.log("CREATE POLL RECEIVED");
    console.log("ROOM:", room);
    console.log("QUESTION:", question);
    console.log("OPTIONS:", options);

    await Poll.deleteMany({
      room,
    });

    const votes = {};

    options.forEach((option) => {
      votes[option] = 0;
    });

    const poll = await Poll.create({
  room,
  question,
  options,
  votes,
  voters: [],
});

    console.log("POLL CREATED:", poll);

    io.to(room).emit(
      "poll-created",
      poll
    );
  }
);

socket.on(
  "vote-poll",
  async ({ room, option, username }) => {
    try {
      console.log("VOTE RECEIVED");
      console.log("ROOM:", room);
      console.log("OPTION:", option);

      const poll = await Poll.findOne({ room });

      console.log("POLL FOUND:", poll);

      if (!poll) return;

      if (!poll.voters) {
        poll.voters = [];
      }

      if (poll.voters.includes(username)) {
        return;
      }

      const currentVotes =
        poll.votes.get(option) || 0;

      poll.votes.set(
        option,
        currentVotes + 1
      );

      poll.voters.push(username);

      await poll.save();

      console.log("POLL SAVED");

      io.to(room).emit(
        "poll-updated",
        poll
      );
    } catch (err) {
      console.error("VOTE ERROR:", err);
    }
  }
);
socket.on("typing", ({ room, username }) => {
  socket.to(room).emit("user-typing", username);
});
  socket.on("canvas-update", async ({ room, data }) => {

  await Whiteboard.findOneAndUpdate(
    { room },
    { data },
    { upsert: true }
  );

  socket.to(room).emit("canvas-update", data);
});
  socket.on("canvas-clear", (room) => {
  socket.to(room).emit("canvas-clear");
});
  console.log("User connected");

  // JOIN ROOM
  socket.on(
  "join-room",
  async ({ room, username, password }, callback) => {
      console.log("JOIN EVENT RECEIVED:", room, username);
      try {
        socket.room = room;
        socket.username = username;
        userSockets[username] = socket.id;
        console.log("CHECKING ROOM:", room);
        const roomData = await Room.findOne({
  roomId: room,
});

if (!roomData) {
  callback({
    success: false,
    message: "Room not found",
  });

  return;
}
  console.log("ROOM DATA:", roomData);
  console.log("ROOM OWNER:", roomData?.owner);
socket.emit("room-owner", roomData?.owner || "");
if (roomData && roomData.password) {
  if (password !== roomData.password) {
    callback({
      success: false,
      message: "Wrong password",
    });

    return;
  }
}
        socket.join(room);
        callback({
  success: true,
});
        // Online users
        if (!rooms[room]) {
          rooms[room] = [];
        }

        if (!rooms[room].includes(username)) {
          rooms[room].push(username);
        }

        console.log("SENDING USERS:", rooms[room]);

io.to(room).emit("users-list", rooms[room]);
        io.to(room).emit("chat-message", {
  username: "System",
  message: `${username} joined the room`,
  createdAt: new Date(),
});

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
        let whiteboard = await Whiteboard.findOne({
  room,
});

if (whiteboard) {
  socket.emit("canvas-update", whiteboard.data);
}
       console.log("EMITTING OWNER:", roomData?.owner);
        console.log(`${username} joined ${room}`);
        callback({
  success: true,
});
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
socket.on("clear-chat", async (room) => {
  await Message.deleteMany({ room });

  io.to(room).emit("chat-cleared");
});
socket.on("delete-room", async (room) => {
  console.log("DELETE ROOM EVENT:", room);

  const roomResult = await Room.deleteOne({
    roomId: room,
  });

  console.log("ROOM DELETE RESULT:", roomResult);

  await Message.deleteMany({ room });
  await Note.deleteMany({ room });
  await Whiteboard.deleteMany({ room });

  io.to(room).emit("room-deleted");
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
      io.to(room).emit("chat-message", {
  username: "System",
  message: `${username} left the room`,
  createdAt: new Date(),
});
    }

    if (username) {
  delete userSockets[username];
  console.log(`${username} disconnected`);
}
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });

const PORT = process.env.PORT || 5000;
app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT");
  res.send("BACKEND WORKING");
});
app.get("/socket-check", (req, res) => {
  res.json({
    socketClients: io.engine.clientsCount,
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/build", (req, res) => {
  res.send("JUNE22-SOCKET-TEST");
});