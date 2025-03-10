import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import MySudokuBoard from "./MySudokuBoard";
import OpponentSudokuBoard from "./OpponentSudokuBoard";

const Room = () => {
  const roomId = useParams().roomId;
  const nickname = localStorage.getItem("nickname");
  const [ready, setReady] = useState(false);
  const [hasOpponent, setHasOpponent] = useState(false);
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

    const onOpponentJoinedEvent = () => {
      console.log("Opponent Joined!");
      setHasOpponent(true);
    };
    socket.on("opponent-joined", onOpponentJoinedEvent);

    return () => {
      socket.off("ready", onReadyEvent);
      socket.off("opponent-joined", onOpponentJoinedEvent);
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-3xl">Room: {roomId}</h1>
        <div className="flex gap-24">
          <div className="flex flex-col">
            <div>
              <p className="font-medium">{nickname}</p>
              <MySudokuBoard roomId={roomId} />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Nickname</p>
            <OpponentSudokuBoard roomId={roomId} />
          </div>
        </div>
      </div>

      {(!ready || !opponentReady) && (
        <div className="absolute top-0 left-0 w-full h-full bg-white z-10">
          <div className="flex flex-col justify-center items-center h-full">
            <p className="mb-8 text-2xl">
              {!opponentReady ? "Waiting for opponent..." : "Opponent ready!"}
            </p>
            {hasOpponent && (
              <button
                className="border bg-green-100 w-32 px-3 py-1 hover:bg-green-200 hover:cursor-pointer rounded"
                onClick={() => {
                  handleClick();
                }}
              >
                {ready ? "Unready" : "Ready"}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Room;
