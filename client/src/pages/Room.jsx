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
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const canvasRef = useRef(null);
  const [notesCopied, setNotesCopied] = useState(false);

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
>      <h1>Study Room</h1>
      <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
</button>

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
      
<h2>📚 Room {room}</h2>

<p>
  👥 {users.length} Users Online
</p>
  {username === owner && (
  <button
    onClick={() => {
      socket.emit("clear-chat", room);
    }}
  >
    Clear Chat
  </button>
)}
{username === owner && (
  <button
    onClick={() => {
      const confirmDelete = window.confirm(
        "Delete this room permanently?"
      );

      if (!confirmDelete) return;

      socket.emit("delete-room", room);
    }}
  >
    Delete Room
  </button>
)}

{username === owner && (
  <div
    style={{
      marginTop: "15px",
      marginBottom: "15px",
    }}
  >
  <button
  onClick={() =>
    setShowPollForm(!showPollForm)
  }
>
  {showPollForm
    ? "Hide Poll Form"
    : "Create New Poll"}
</button>
    {showPollForm && (
  <>
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
      onClick={() => {
        console.log("CREATING POLL", {
  room,
  question: pollQuestion,
  options: pollOptions
    .split(",")
    .map((o) => o.trim()),
});

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
      }}
    >
      Create Poll
    </button>
      </>
)}
  </div>
)}
<p>
  Owner: {owner} 👑
</p><button
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
  Leave Room
</button>
<p className="invite-link">
  Invite Link: {window.location.origin}/room/{room}
</p>

<button
  onClick={() => {
    navigator.clipboard.writeText(
  `${window.location.origin}/room/${room}`
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
/>

  <button onClick={sendMessage}>
    Send
  </button>

  <div className="chat-layout">

    <div className="users-panel">
      <h3>Online Users ({users.length})</h3>
      <p>Count: {users.length}</p>

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
      <h3>Messages</h3>
      <h4>Total Messages: {messages.length}</h4>
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
  <div className="poll-panel">
    <h3>📊 Live Poll</h3>

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

      setNotesCopied(true);

      setTimeout(() => {
        setNotesCopied(false);
      }, 2000);
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

  {notesCopied && (
    <p
      style={{
        color: "#4ade80",
        fontWeight: "bold",
      }}
    >
      ✅ Notes copied
    </p>
  )}

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

  <button
    onClick={() => {
      canvasRef.current.clearCanvas();

      socket.emit("canvas-clear", room);
    }}
  >
    🗑️ Clear Whiteboard
  </button>
</div>
  </div>
</>
      )}
    </div>
  );
}
export default Room;