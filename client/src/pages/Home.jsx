import { Link } from "react-router-dom";

function Home() {
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
    padding: "70px 60px",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    backdropFilter: "blur(10px)",
    maxWidth: "600px",
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
    
  );
}

export default Home;