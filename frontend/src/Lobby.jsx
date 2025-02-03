import { useState } from "react";
import { useSocket } from "./useSocket";
import { useNavigate } from "react-router";

const Lobby = () => {
  const [roomName, setRoomName] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (roomName.length === 0) {
      alert("Please enter a room name");
      return;
    }

    //add check for room size, will need to handle in backend
    socket.emit("join-room", roomName);
    navigate(`/room/${roomName}`);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col border p-6 rounded">
          <h1 className="font-medium text-xl mb-8 text-center">Lobby</h1>

          <div>
            <label>
              Join a room:
              <input
                className="border border-gray-300 outline-none ml-2 rounded px-0.5"
                type="text"
                placeholder="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                handleJoinRoom();
              }}
              className="w-full border bg-blue-100 hover:bg-blue-200 hover:cursor-pointer mt-3 rounded"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
