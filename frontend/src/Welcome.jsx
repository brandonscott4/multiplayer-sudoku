import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSocket } from "./useSocket";
import { CgSpinner } from "react-icons/cg";

const Welcome = () => {
  const [nickname, setNickname] = useState("");
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      return;
    }

    setConnected(socket.connected);

    const onConnectEvent = () => setConnected(true);
    socket.on("connect", onConnectEvent);

    return () => {
      socket.off("connect", onConnectEvent);
    };
  }, [socket]);

  const handleClick = () => {
    if (nickname.length === 0) {
      alert("Please enter a nickname");
      return;
    }

    localStorage.setItem("nickname", nickname);
    navigate("/lobby");
  };

  if (!socket || !connected) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <CgSpinner className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="flex flex-col bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
        <h1 className="font-medium text-xl mb-8 text-center">
          Welcome to Multiplayer Sudoku
        </h1>
        <label>
          Enter a nickname:
          <input
            className="border border-gray-300 outline-none ml-2 rounded px-0.5"
            type="text"
            placeholder="Bob"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            handleClick();
          }}
          className="w-full border bg-green-100 hover:bg-green-200 hover:cursor-pointer mt-3 rounded "
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Welcome;
