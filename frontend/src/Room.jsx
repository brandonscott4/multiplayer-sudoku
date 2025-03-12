import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import MySudokuBoard from "./MySudokuBoard";
import OpponentSudokuBoard from "./OpponentSudokuBoard";
import { IconLogout2 } from "@tabler/icons-react";

const Room = () => {
  const roomId = useParams().roomId;
  const nickname = localStorage.getItem("nickname");
  const [ready, setReady] = useState(false);
  const [hasOpponent, setHasOpponent] = useState(false);
  const [opponentReady, setOpponentReady] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const socket = useSocket();
  const navigate = useNavigate();

  const handleClick = () => {
    const newReady = !ready;
    setReady(newReady);
    socket.emit("ready", { readyStatus: newReady, roomId: roomId });
  };

  const handleLeaveRoomClick = () => {
    socket.emit("leave-room", { roomId });
    navigate("/lobby");
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

    const onOpponentLosesEvent = () => {
      setIsGameOver(true);
      alert("You Win!");
    };
    socket.on("opponent-loses", onOpponentLosesEvent);

    const onOpponentWinsEvent = () => {
      setIsGameOver(true);
      alert("You Lose!");
    };
    socket.on("opponent-wins", onOpponentWinsEvent);

    const onOpponentLeftEvent = () => {
      setIsGameOver(true);
      alert("Opponent left the room");
    };
    socket.on("opponent-left", onOpponentLeftEvent);

    return () => {
      socket.off("ready", onReadyEvent);
      socket.off("opponent-joined", onOpponentJoinedEvent);
      socket.off("opponent-loses", onOpponentLosesEvent);
      socket.off("opponent-wins", onOpponentWinsEvent);
      socket.off("opponent-left", onOpponentLeftEvent);
    };
  }, [socket]);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex gap-6">
          <h1 className="text-3xl">Room: {roomId}</h1>
          <button
            className="border bg-yellow-100 p-1 hover:bg-yellow-200 hover:cursor-pointer rounded"
            onClick={handleLeaveRoomClick}
          >
            <IconLogout2 stroke={2} />
          </button>
        </div>
        <div className="flex gap-24">
          <div className="flex flex-col">
            <div>
              <p className="font-medium">{nickname}</p>
              <MySudokuBoard
                roomId={roomId}
                isGameOver={isGameOver}
                setIsGameOver={setIsGameOver}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Nickname</p>
            <OpponentSudokuBoard roomId={roomId} />
          </div>
        </div>
        {isGameOver && <h2 className="mt-10 text-3xl">Game Over!</h2>}
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
