import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
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
    transition: "all 0.3s ease",
    padding: "50px 45px",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    maxWidth: "500px",
    width: "90%",
  }}
  onMouseEnter={(e) => {
  e.currentTarget.style.transform = "translateY(-8px)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "translateY(0)";
}}
>
  <img
  src="/logo.png"
  alt="Study Room Logo"
  style={{
  width: "110px",
  height: "110px",
  display: "block",
  margin: "0 auto 16px",
  borderRadius: "16px",
}}
/>

<h1
  style={{
    fontSize: "3rem",
    color: "#fff",
    marginTop: "0",
    marginBottom: "0",
    fontWeight: "800",
    letterSpacing: "1px",
    lineHeight: "1.2",
  }}
>
  Study Room
</h1>
<p
  style={{
    color: "#e5e7eb",
    fontSize: "18px",
    marginTop: "4px",
    marginBottom: "35px",
    lineHeight: "1.5",
  }}
>
  Study together. Chat together. Learn together.
</p>

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
placeholder="🔗 Enter Room ID"
  value={roomId}
  onChange={(e) => setRoomId(e.target.value)}
  style={{
  width: "100%",
  padding: "15px",
  marginBottom: "18px",

  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.3)",

  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",

  color: "white",
  fontSize: "16px",

  outline: "none",

  boxSizing: "border-box",
}}
/>
<input
  type="text"
placeholder="👤 Enter your username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  style={{
  width: "100%",
  padding: "15px",
  marginBottom: "18px",

  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.3)",

  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",

  color: "white",
  fontSize: "16px",

  outline: "none",

  boxSizing: "border-box",
}}
onFocus={(e) => {
  e.target.style.border = "1px solid white";
}}
/>


      <div>

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
    width: "100%",
    padding: "15px",
    marginTop: "8px",
    borderRadius: "12px",
    border: "2px solid white",
    cursor: "pointer",
    fontSize: "17px",
    fontWeight: "600",
    background: "transparent",
    color: "white",
    transition: "0.3s",
  }}
>
  🔗 Join Existing Room
</button>

<Link
  to="/create"
  style={{
    width: "100%",
    textDecoration: "none",
  }}
>
  <button
    style={{
      width: "100%",
      padding: "15px",
      marginTop: "12px",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
      fontSize: "17px",
      fontWeight: "600",
      background: "#ffffff",
      color: "#5b4bdb",
      boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
      transition: "0.3s",
    }}
  >
    🚀 Create Study Room
  </button>
</Link>
      </div>
    </div>
    </div>
    
  );
}


export default Home;
