import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import MySudokuBoard from "./MySudokuBoard";

const Room = () => {
  const roomId = useParams().roomId;
  const nickname = localStorage.getItem("nickname");
  const [ready, setReady] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const socket = useSocket();

  const handleClick = () => {
    const newReady = !ready;
    setReady(newReady);
    socket.emit("ready", { readyStatus: newReady, roomId: roomId });
  };

  useEffect(() => {
    const onReadyEvent = (readyStatus) => {
      setOpponentReady(readyStatus);
    };
    socket.on("ready", onReadyEvent);

    return () => {
      socket.off("ready", onReadyEvent);
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-3xl">Room: {roomId}</h1>
        <div>
          <p className="font-medium">{nickname}</p>
          <MySudokuBoard />
        </div>
      </div>

      {(!ready || !opponentReady) && (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-10">
          <div className="flex flex-col justify-center items-center h-full">
            <p className="mb-8 text-2xl">
              {!opponentReady ? "Waiting for opponent..." : "Opponent ready!"}
            </p>
            <button
              className="border bg-green-100 w-32 px-3 py-1 hover:bg-green-200 hover:cursor-pointer rounded"
              onClick={() => {
                handleClick();
              }}
            >
              {ready ? "Unready" : "Ready"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
