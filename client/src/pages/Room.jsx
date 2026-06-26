import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { ReactSketchCanvas } from "react-sketch-canvas";
import "../styles/Room.css";

const socket = io(
  "https://study-room-app-backend.onrender.com"
);
  function Room() {
  const [canvasData, setCanvasData] = useState([]);
  const { roomId } = useParams();
  const location = useLocation();
const [username, setUsername] = useState(
  location.state?.username || ""
);
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [poll, setPoll] = useState(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState("");
  const [owner, setOwner] = useState("");
  const [showPollForm, setShowPollForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (roomId) {
    setRoom(roomId);
  }
}, [roomId]);
useEffect(() => {
  if (
    location.state?.username &&
    room &&
    !joined
  ) {
    socket.emit(
      "join-room",
      {
        room,
        username: location.state.username,
        password: "",
      },
      (response) => {
  if (!response?.success) {
setError(response?.message || "Unable to join room");
    navigate("/");
    return;
  }

  setJoined(true);
}
    );
  }
}, [room]); 

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [messages]);

  useEffect(() => {
  const handleMessage = (msg) => {

  setMessages((prev) => {
    const updated = [...prev, msg];


    return updated;
  });
};

  socket.on("chat-message", handleMessage);

  socket.on("old-messages", (oldMessages) => {

  setMessages((prev) => {
    if (prev.length > 0) {
      return [...oldMessages, ...prev];
    }

    return oldMessages;
  });
});

  socket.on("load-notes", (savedNotes) => {
    setNotes(savedNotes);
  });

  socket.on("users-list", (usersList) => {
  setUsers(usersList);
});

 socket.on("room-owner", (roomOwner) => {
  setOwner(roomOwner || "");
});

  socket.on("poll-created", (pollData) => {
  setPoll(pollData);
});

socket.on("user-typing", (name) => {
  console.log("USER TYPING:", name);

  setTypingUser(name);

  setTimeout(() => {
    setTypingUser("");
  }, 2000);
});

socket.on("poll-updated", (updatedPoll) => {
  setPoll({
    ...updatedPoll,
    votes: { ...updatedPoll.votes },
  });
});
  socket.on("notes-change", (updatedNotes) => {
    setNotes(updatedNotes);
  });

  socket.on("chat-cleared", () => {
  setMessages([]);
});
socket.on("room-deleted", () => {
  alert("Room deleted by owner");
  window.location.href = "/";
});
socket.on("kicked", () => {
  alert("You were removed from the room");

  window.location.href = "/";
});

  socket.on("canvas-update", async (data) => {
    console.log(JSON.stringify(data, null, 2));

    if (!canvasRef.current) return;

    try {
      await canvasRef.current.clearCanvas();
      await canvasRef.current.loadPaths(data);
      console.log("Canvas loaded");
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("canvas-clear", async () => {
  if (canvasRef.current) {
    await canvasRef.current.clearCanvas();
  }
});
  return () => {
  socket.off("chat-message", handleMessage);
  socket.off("chat-cleared");
  socket.off("old-messages");
  socket.off("load-notes");
  socket.off("users-list");
  socket.off("room-owner");
  socket.off("notes-change");
  socket.off("canvas-update");
  socket.off("canvas-clear");
  socket.off("room-deleted");
  socket.off("kicked");
};
}, []);
useEffect(() => {
  console.log("USERNAME:", username);
  console.log("OWNER:", owner);
}, [username, owner]);
const joinRoom = () => {
  if (!username.trim() || !room.trim()) return;

  const enteredPassword = prompt(
  "Enter room password (leave blank if none)"
);

socket.emit(
  "join-room",
  {
    room,
    username,
    password: enteredPassword || "",
  },
  (response) => {
    if (!response?.success) {
      setError(
        response?.message || "Unable to join room"
      );
      return;
    }

    setError("");
    setJoined(true);
  }
);
};
const sendCanvas = async () => {
  if (!canvasRef.current) return;

  const paths = await canvasRef.current.exportPaths();

  socket.emit("canvas-update", {
    room,
    data: paths,
  });
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
<div
  className={`room-container ${
    darkMode ? "dark" : ""
  }`}
>      <h1
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    fontSize: "2rem",
  }}
>
  <span>📚 Study Room</span>

  <span
    style={{
      background: "#4f46e5",
      color: "white",
      padding: "6px 14px",
      borderRadius: "20px",
      fontSize: "15px",
      fontWeight: "600",
    }}
  >
    {room}
  </span>
</h1>
<h2>📚 Room {room}</h2>

<h4>
  👥 {users.length} {users.length === 1 ? "User" : "Users"} Online
</h4>
<div
  style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  flexWrap: "wrap",
  gap: "15px",
  margin: "20px 0",
}}
>
<div
  style={{
    padding: "12px 18px",
    borderRadius: "12px",
    background: darkMode ? "#1f2937" : "#f3f4f6",
    display: "inline-block",
    marginBottom: "15px",
  }}
>
  <p
    style={{
      margin: 0,
      fontWeight: "600",
      fontSize: "16px",
    }}
  >
    👑 Owner: {owner}
  </p>
</div>
<button
  style={{
    padding: "10px 18px",
    borderRadius: "10px",
    background: "#ef4444",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  }}
  onClick={() => {
    setJoined(false);
    setUsers([]);
    setMessages([]);
    setNotes("");
    setOwner("");
    setRoom("");

    window.location.href = "/";
  }}
>
  🚪 Leave Room
</button>
<button
  style={{
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: darkMode ? "#facc15" : "#374151",
    color: darkMode ? "#000" : "#fff",
    cursor: "pointer",
    fontWeight: "600",
  }}
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀️ Light" : "🌙 Dark"}
</button>
</div>
      {!joined ? (
        <div className="chat-layout">
          <input
  type="text"
  placeholder="Enter Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
/>
          

<button onClick={joinRoom}>
  Join Room
</button>

{error && (
  <p
    style={{
      color: "#ff6b6b",
      marginTop: "10px",
      fontWeight: "bold",
    }}
  >
    ❌ {error}
  </p>
)}
        </div>
      ) : (
      <>
      
<div
  style={{
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    flexWrap: "wrap",
    margin: "20px 0",
  }}
>
  {username === owner && (
    <button
      style={{
        width: "160px",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
      }}
      onClick={() => {
        socket.emit("clear-chat", room);
      }}
    >
      🗑️ Clear Chat
    </button>
  )}

  {username === owner && (
    <button
      style={{
        width: "160px",
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "#dc2626",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
      }}
      onClick={() => {
        const confirmDelete = window.confirm(
          "Delete this room permanently?"
        );

        if (!confirmDelete) return;

        socket.emit("delete-room", room);
      }}
    >
      🗑️ Delete Room
    </button>
  )}

  {username === owner && (
    <div>
      <button
        style={{
          width: "160px",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          background: "#10b981",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
        }}
        onClick={() => setShowPollForm(!showPollForm)}
      >
        {showPollForm
          ? "❌ Hide Poll"
          : "📊 Create Poll"}
      </button>

      {showPollForm && (
        <div
          style={{
            marginTop: "15px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: darkMode ? "#1f2937" : "#f9fafb",
          }}
        >
          <h3>Create Poll</h3>

          <input
            type="text"
            placeholder="Poll Question"
            value={pollQuestion}
            onChange={(e) =>
              setPollQuestion(e.target.value)
            }
          />

          <br />
          <br />

          <input
            type="text"
            placeholder="Option1,Option2,Option3"
            value={pollOptions}
            onChange={(e) =>
              setPollOptions(e.target.value)
            }
          />

          <br />
          <br />

          <button
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#4f46e5",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              socket.emit("create-poll", {
                room,
                question: pollQuestion,
                options: pollOptions
                  .split(",")
                  .map((o) => o.trim()),
              });

              setPollQuestion("");
              setPollOptions("");
              setShowPollForm(false);

              toast.success("Poll created!");
            }}
          >
            ✅ Create Poll
          </button>
        </div>
      )}
    </div>
  )}
</div>

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    margin: "20px 0",
  }}
>
  <h4
    style={{
      marginBottom: "10px",
      color: darkMode ? "#fff" : "#374151",
    }}
  >
    🔗 Share Room
  </h4>

  <button
    style={{
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      background: "#4f46e5",
      color: "white",
      fontWeight: "600",
      cursor: "pointer",
    }}
    onClick={() => {
      navigator.clipboard.writeText(
        `${window.location.origin}/room/${room}`
      );

      toast.success("Invite link copied!");
    }}
  >
    📋 Copy Invite Link
  </button>
</div>
  
  <div
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  }}
>
  <input
    type="text"
    placeholder="Type a message..."
    value={message}
    onChange={(e) => {
      setMessage(e.target.value);

      socket.emit("typing", {
        room,
        username,
      });
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    }}
    style={{
      flex: 1,
      padding: "12px",
      borderRadius: "10px",
      border: "1px solid #ccc",
      fontSize: "15px",
    }}
  />

  <button
    onClick={sendMessage}
    style={{
      padding: "12px 20px",
      borderRadius: "10px",
      border: "none",
      background: "#4f46e5",
      color: "white",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    📨 Send
  </button>
</div>

  <div className="chat-layout">

    <div className="users-panel">
      <h3
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  }}
>
  <span>👥 Online Users</span>

  <span
    style={{
      background: "#10b981",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "bold",
    }}
  >
    {users.length}
  </span>
</h3>
      {users.map((user, index) => (
  <div
    key={index}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "8px",
    }}
  >
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }}
>
  <div
    style={{
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      background: [
  "#667eea",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
][user.charCodeAt(0) % 6],
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    }}
  >
    {user.charAt(0).toUpperCase()}
  </div>

  <span>
    {user}
    {user === owner ? " 👑" : ""}
  </span>
</div>

    {owner &&
      username &&
      username.trim().toLowerCase() ===
        owner.trim().toLowerCase() &&
      user !== owner && (
        <button
          onClick={() => {
            socket.emit("kick-user", {
              username: user,
              room,
            });
          }}
        >
          Kick
        </button>
      )}
  </div>
))}
    </div>

    <div className="chat-panel">
      <h3
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <span>💬 Messages</span>

  <span
    style={{
      background: "#4f46e5",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "14px",
    }}
  >
    {messages.length}
  </span>
</h3>
     {messages.map((msg, index) => {
  if (msg.username === "System") {
    return (
      <div
        key={index}
        style={{
          textAlign: "center",
          margin: "10px 0",
          opacity: 0.7,
        }}
      >
        <small>{msg.message}</small>
      </div>
    );
  }

  return (
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
          {msg.createdAt
            ? new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
        </small>
      </div>

      <p>{msg.message}</p>
    </div>
  );
})}
{typingUser && (
  <p
    style={{
      color: "#6b7280",
      fontStyle: "italic",
      marginTop: "10px",
    }}
  >
    ✍️ {typingUser} is typing...
  </p>
)}
<div ref={messagesEndRef}></div>
    </div>
    {poll && (
  <div
  className="poll-panel"
  style={{
    padding: "20px",
    borderRadius: "16px",
    background: darkMode ? "#1f2937" : "#ffffff",
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    marginBottom: "20px",
  }}
>
    <h3
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  }}
>
  <span>📊 Live Poll</span>

  <span
    style={{
      background: "#6366f1",
      color: "white",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "13px",
    }}
  >
    Active
  </span>
</h3>

    <p>
      <strong>{poll.question}</strong>
    </p>

    {poll.options.map((option) => (
  <button
    key={option}
    onClick={() => {
  console.log("BUTTON CLICKED");
  console.log("ROOM:", room);
  console.log("OPTION:", option);

  socket.emit("vote-poll", {
  room,
  option,
  username,
});

  console.log("VOTE EMITTED");
}}
    style={{
      display: "block",
      width: "100%",
      marginBottom: "8px",
      padding: "8px",
      cursor: "pointer",
    }}
  >
{option} (
  {poll.votes && poll.votes[option] !== undefined
    ? poll.votes[option]
    : 0}
)
  </button>
))}
  </div>
)}
<div className="notes-panel">
  <h3>Shared Notes</h3>
  <div
  style={{
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  }}
>
  <button
    onClick={() => {
  navigator.clipboard.writeText(notes);

  toast.success("Notes copied!");
}}
  >
    Copy Notes
  </button>

  <button
  onClick={() => {
    const blob = new Blob([notes], {
      type: "text/plain",
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = `${room}-notes.txt`;

    link.click();

    URL.revokeObjectURL(link.href);
  }}
>
  Download Notes
</button>
</div>

  <textarea
    placeholder="Write study notes here..."
    value={notes}
    onChange={(e) => {
      setNotes(e.target.value);

      socket.emit("notes-change", {
        room,
        notes: e.target.value,
      });
    }}
  />
</div>
<div className="whiteboard-panel">
  <h3>🖍️ Whiteboard</h3>

  <div
    style={{
      borderRadius: "18px",
      overflow: "hidden",
      marginBottom: "15px",
      background: "#fff",
    }}
  >
    <ReactSketchCanvas
      ref={canvasRef}
      width="100%"
      height="400px"
      strokeWidth={4}
      strokeColor="black"
      onStroke={() => sendCanvas()}
    />
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginTop: "10px",
    }}
  >
    <button
      style={{ flex: 1 }}
      onClick={() => {
        canvasRef.current.clearCanvas();
        socket.emit("canvas-clear", room);
        toast.success("Whiteboard cleared!");
      }}
    >
      🗑️ Clear
    </button>

    <button
      style={{ flex: 1 }}
      onClick={() => {
        canvasRef.current.exportImage().then((data) => {
          const link = document.createElement("a");

          link.href = data;
          link.download = `${room}-whiteboard.png`;

          link.click();

          toast.success("Whiteboard downloaded!");
        });
      }}
    >
      📥 Download
    </button>
  </div>
</div>

      </div>
    </>
  )}
</div>
);
}

export default Room;