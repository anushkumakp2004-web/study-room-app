import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  return (
    <div
  style={{
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  }}
>
    <div
  style={{
    background: "rgba(255,255,255,0.1)",
    padding: "50px 45px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    maxWidth: "500px",
    width: "90%",
  }}
>
      <h1
  style={{
    fontSize: "3rem",
    marginBottom: "15px",
    color: "white",
  }}
>
  📚 Study Room
</h1>

<p
  style={{
    color: "rgba(255,255,255,0.9)",
    fontSize: "1.2rem",
    marginBottom: "30px",
    lineHeight: "1.6",
  }}
>
  Study together in real time with chat,
  shared notes, and a collaborative
  whiteboard.
</p>
<div
  style={{
    marginBottom: "30px",
    color: "white",
    fontSize: "1.1rem",
    lineHeight: "2",
  }}
>
    <p>💬 Real-Time Chat</p>
  <p>📝 Shared Notes</p>
  <p>🎨 Collaborative Whiteboard</p>
  <p>👥 Multi-User Rooms</p>
</div>
<input
  type="text"
  placeholder="Enter Room ID"
  value={roomId}
  onChange={(e) => setRoomId(e.target.value)}
  style={{
    padding: "12px",
    width: "100%",
    maxWidth: "300px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    fontSize: "16px",
  }}
/>
<input
  type="text"
  placeholder="Enter Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
    padding: "12px",
    width: "100%",
    maxWidth: "300px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "20px",
    fontSize: "16px",
  }}
/>

      <div>
      <br />
<br />

<button
  onClick={() => {
  if (!roomId.trim()) return;
  if (!username.trim()) return;

  navigate(`/room/${roomId}`, {
    state: {
      username,
    },
  });
}}
  style={{
    padding: "14px 28px",
    borderRadius: "12px",
    border: "1px solid white",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    background: "transparent",
    color: "white",
  }}
>
  Join Existing Room
</button>
<Link to="/create">
  <button
    style={{
      padding: "16px 32px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold",
      background: "#ffffff",
      color: "#5b4bdb",
      boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    }}
  >
    Join Study Room
  </button>
</Link>
      </div>
    </div>
    </div>
    
  );
}

export default Home;