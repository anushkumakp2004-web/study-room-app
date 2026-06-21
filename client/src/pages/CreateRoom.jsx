import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io(
  "https://study-room-backend.onrender.com"
);
function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
  console.log("CREATE BUTTON CLICKED");
  const randomRoomId = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  socket.emit(
  "create-room",
  {
    roomId: randomRoomId,
    password,
    owner: username,
  },
    (response) => {
      console.log("CREATE RESPONSE:", response);

      if (response.success) {
        navigate(`/room/${randomRoomId}`);
      }
    }
  );
};
  return (
  <div
    style={{
      maxWidth: "500px",
      margin: "60px auto",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      textAlign: "center",
    }}
  >
    <h1>Create Room</h1>

    <input
      placeholder="Your Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />
    const finalRoomId =
  roomId.trim() || randomRoomId;

    <input
      type="password"
      placeholder="Room Password (optional)"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={createRoom}>
      Create Room
    </button>
  </div>
);
}

export default CreateRoom;