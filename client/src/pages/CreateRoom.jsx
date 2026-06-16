import { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function CreateRoom() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    if (!roomId.trim()) return;

    navigate(`/room/${roomId}`);
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