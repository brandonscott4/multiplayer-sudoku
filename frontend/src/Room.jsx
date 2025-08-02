import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import MySudokuBoard from "./MySudokuBoard";
import OpponentSudokuBoard from "./OpponentSudokuBoard";
import { TbLogout2 } from "react-icons/tb";

const Room = () => {
  const roomId = useParams().roomId;
  const nickname = localStorage.getItem("nickname");
  const [opponentNickname, setOpponentNickname] = useState("Opponent");
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

  const handleLeaveRoomClick = (hasGameStarted) => {
    socket.emit("leave-room", { roomId, hasGameStarted });
    navigate("/lobby");
  };

  const handleLeaveRoomClickWaiting = () => {
    socket.emit("opponent-left-waiting", { roomId });
    handleLeaveRoomClick(false);
  };

  useEffect(() => {
    const onReadyEvent = (readyStatus) => {
      setOpponentReady(readyStatus);
    };
    socket.on("ready", onReadyEvent);

    const onOpponentJoinedEvent = () => {
      console.log("Opponent Joined!");
      setHasOpponent(true);
      socket.emit("opponent-nickname", { roomId });
    };
    socket.on("opponent-joined", onOpponentJoinedEvent);

    const onSelfJoinedEvent = () => {
      console.log("You joined!");
      setHasOpponent(true);
      socket.emit("opponent-nickname", { roomId });
    };
    socket.on("self-joined", onSelfJoinedEvent);

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

    const onOpponentLeftEvent = (hasGameStarted) => {
      if (hasGameStarted) {
        setIsGameOver(true);
      }

      alert("Opponent left the room");
    };
    socket.on("opponent-left", onOpponentLeftEvent);

    const onOpponentLeftWaitingEvent = () => {
      setReady(false);
      setOpponentNickname("Opponent");
      setHasOpponent(false);
      setOpponentReady(false);
    };
    socket.on("opponent-left-waiting", onOpponentLeftWaitingEvent);

    const onOpponentNicknameEvent = ({ oppNickname }) => {
      setOpponentNickname(oppNickname);
    };
    socket.on("opponent-nickname", onOpponentNicknameEvent);

    return () => {
      socket.off("ready", onReadyEvent);
      socket.off("opponent-joined", onOpponentJoinedEvent);
      socket.off("self-joined", onSelfJoinedEvent);
      socket.off("opponent-loses", onOpponentLosesEvent);
      socket.off("opponent-wins", onOpponentWinsEvent);
      socket.off("opponent-left", onOpponentLeftEvent);
      socket.off("opponent-left-waiting", onOpponentLeftWaitingEvent);
      socket.off("opponent-nickname", onOpponentNicknameEvent);
    };
  }, [socket]);

  return (
    <>
      <div className="flex h-screen divide-x-2 divide-gray-200 bg-gray-50">
        {/*
        <div className="flex gap-6">
          <h1 className="text-3xl">Room: {roomId}</h1>
          <button
            className="border bg-yellow-100 p-1 hover:bg-yellow-200 hover:cursor-pointer rounded"
            onClick={handleLeaveRoomClick}
          >
            <IconLogout2 stroke={2} />
          </button>
        </div>
        */}
        <div className="w-1/2 flex flex-col justify-center items-center">
          <div className="flex items-center gap-3 mb-6">
            <p className="font-mono text-2xl">{nickname}</p>
            <button
              className="hover:cursor-pointer rounded"
              onClick={() => handleLeaveRoomClick(true)}
            >
              <TbLogout2
                className={`w-6 h-6 hover:text-gray-600 ${
                  isGameOver
                    ? "animate-pulse text-red-500 hover:text-red-600 hover:animate-none"
                    : ""
                }`}
              />
            </button>
          </div>
          <MySudokuBoard
            roomId={roomId}
            isGameOver={isGameOver}
            setIsGameOver={setIsGameOver}
            nickname={nickname}
          />
        </div>
        <div className="w-1/2 flex flex-col justify-center items-center">
          <p className="font-mono text-2xl mb-6">{opponentNickname}</p>
          <OpponentSudokuBoard
            isActive={ready && opponentReady}
            isGameOver={isGameOver}
          />
        </div>
      </div>
      {/*isGameOver && <h2 className="mt-10 text-3xl">Game Over!</h2> */}

      {(!ready || !opponentReady) && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-50 z-10">
          <div className="flex justify-center items-center h-full">
            <div className="flex flex-col justify-center items-center bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
              <div className="flex gap-3 mb-6">
                <p className="text-2xl">
                  {!opponentReady
                    ? "Waiting for opponent..."
                    : "Opponent ready!"}
                </p>
                <button
                  className="hover:cursor-pointer rounded"
                  onClick={handleLeaveRoomClickWaiting}
                >
                  <TbLogout2 className="w-6 h-6 hover:text-gray-600" />
                </button>
              </div>
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
        </div>
      )}
    </>
  );
};

export default Room;
