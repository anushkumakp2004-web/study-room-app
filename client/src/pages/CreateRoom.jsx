import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://study-room-app-backend.onrender.com");

function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
  const randomRoomId = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  navigate(`/room/${randomRoomId}`);
};
  return (
    <div>
      <h1>Create Room</h1>

      <input
        placeholder="Room Name"
        value={roomId}
        onChange={(e) =>
          setRoomId(e.target.value)
        }
      />

      <button onClick={createRoom}>
        Create Room
      </button>
    </div>
  );
}

export default CreateRoom;