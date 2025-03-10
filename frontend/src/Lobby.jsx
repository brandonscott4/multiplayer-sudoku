import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import { useNavigate } from "react-router";

const Lobby = () => {
  const [createRoomName, setCreateRoomName] = useState("");
  const [joinRoomName, setJoinRoomName] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const nickname = localStorage.getItem("nickname");

  const handleJoinRoom = () => {
    if (joinRoomName.length === 0) {
      alert("Please enter a room name to join");
      return;
    }

    socket.emit("join-room", { roomName: joinRoomName, nickname });
  };

  const handleCreateRoom = () => {
    if (createRoomName.length === 0) {
      alert("Please enter a room name to create");
      return;
    }

    socket.emit("create-room", { roomName: createRoomName, nickname });
  };

  useEffect(() => {
    const onJoinFailureEvent = ({ failure }) => {
      alert(failure);
    };
    socket.on("join-failure", onJoinFailureEvent);

    const onJoinSuccessEvent = () => {
      navigate(`/room/${joinRoomName}`);
    };
    socket.on("join-success", onJoinSuccessEvent);

    const onCreateFailureEvent = ({ failure }) => {
      alert(failure);
    };
    socket.on("create-failure", onCreateFailureEvent);

    const onCreateSuccessEvent = () => {
      navigate(`/room/${createRoomName}`);
    };
    socket.on("create-success", onCreateSuccessEvent);
    return () => {
      socket.off("join-failure", onJoinFailureEvent);
      socket.off("join-success", onJoinSuccessEvent);
      socket.off("create-failure", onCreateFailureEvent);
      socket.off("create-success", onCreateSuccessEvent);
    };
  }, [socket, joinRoomName, createRoomName, navigate]);

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col border p-6 rounded">
          <h1 className="font-medium text-xl mb-8 text-center">Lobby</h1>
          <div className="flex flex-col gap-12">
            <div>
              <label>
                Create a room:
                <input
                  className="border border-gray-300 outline-none ml-2 rounded px-0.5"
                  type="text"
                  placeholder="Room Name"
                  value={createRoomName}
                  onChange={(e) => setCreateRoomName(e.target.value)}
                />
              </label>
              <button
                onClick={() => {
                  handleCreateRoom();
                }}
                className="w-full border bg-yellow-100 hover:bg-yellow-200 hover:cursor-pointer mt-3 rounded"
              >
                Create
              </button>
            </div>

            <div>
              <label>
                Join a room:
                <input
                  className="border border-gray-300 outline-none ml-2 rounded px-0.5"
                  type="text"
                  placeholder="Room Name"
                  value={joinRoomName}
                  onChange={(e) => setJoinRoomName(e.target.value)}
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
      </div>
    </>
  );
};

export default Lobby;
