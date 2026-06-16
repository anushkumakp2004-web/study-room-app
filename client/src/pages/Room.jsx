import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import "../styles/Room.css";

const socket = io("http://localhost:5000");

function Room() {
  const { roomId } = useParams();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
  if (roomId) {
    setRoom(roomId);
  }
}, [roomId]);
  const messagesEndRef = useRef(null);
  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);
  useEffect(() => {
  const handleMessage = (msg) => {
    console.log("Received:", msg);

    setMessages((prev) => [...prev, msg]);
  };

  socket.on("chat-message", handleMessage);

  socket.on("old-messages", (oldMessages) => {
    setMessages(oldMessages);
  });
  socket.on("load-notes", (savedNotes) => {
  setNotes(savedNotes);
});

  socket.on("users-list", (usersList) => {
    setUsers(usersList);
  });

  socket.on("notes-change", (updatedNotes) => {
    console.log("Received notes:", updatedNotes);

    setNotes(updatedNotes);
  });

  return () => {
    socket.off("chat-message", handleMessage);
    socket.off("old-messages");
    socket.off("users-list");
    socket.off("notes-change");
  };
}, []);

  const joinRoom = () => {
  if (!username.trim() || !room.trim()) return;

  socket.emit("join-room", {
  room,
  username,
});
  setJoined(true);
};

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("chat-message", {
  username,
  room,
  message,
});

    setMessage("");
  };

 return (
  <div className="room-container">
      <h1>Study Room</h1>

      {!joined ? (
        <div className="chat-layout">
          <input
  type="text"
  placeholder="Enter Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
          <input
            type="text"
            placeholder="Enter Room Code"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button onClick={joinRoom}>
            Join Room
          </button>
        </div>
      ) : (
      <>
      
  <h3>Room: {room}</h3>

<p className="invite-link">
  Invite Link: http://localhost:5173/room/{room}
</p>

<button
  onClick={() => {
    navigator.clipboard.writeText(
      `http://localhost:5173/room/${room}`
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }}
>
  {copied ? "Copied!" : "Copy Invite Link"}
</button>
  
  <input
  type="text"
  placeholder="Type a message"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
/>

  <button onClick={sendMessage}>
    Send
  </button>

  <div className="chat-layout">

    <div className="users-panel">
      <h3>Online Users</h3>

      {users.map((user, index) => (
        <p key={index}>{user}</p>
      ))}
    </div>

    <div className="chat-panel">
      <h3>Messages</h3>

      {messages.map((msg, index) => (
  <div
    className={
      msg.username === username
        ? "message-bubble my-message"
        : "message-bubble other-message"
    }
    key={index}
  >
    <div className="message-header">
  <strong>{msg.username}</strong>

  <small>
    {new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}
  </small>
</div>
    <p>{msg.message}</p>
  </div>
))}
<div ref={messagesEndRef}></div>
    </div>
<div className="notes-panel">
  <h3>Shared Notes</h3>

  <textarea
  placeholder="Write study notes here..."
  value={notes}
  onChange={(e) => {
  console.log("Sending notes:", e.target.value);

  setNotes(e.target.value);

  socket.emit("notes-change", {
    room,
    notes: e.target.value,
  });
}}
/>
</div>
  </div>
</>
      )}
    </div>
  );
}

export default Room;