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
  }}
>
      <h1>📚 Study Room</h1>

<p>
  Study together in real time with chat,
  shared notes, and a collaborative
  whiteboard.
</p>
<div style={{ marginBottom: "25px" }}>
  <p>💬 Real-Time Chat</p>
  <p>📝 Shared Notes</p>
  <p>🎨 Collaborative Whiteboard</p>
  <p>👥 Multi-User Rooms</p>
</div>

      <Link to="/create">
<button
  style={{
    padding: "12px 24px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  }}
>
  Join Study Room
</button>
      </Link>
    </div>
  );
}

export default Home;