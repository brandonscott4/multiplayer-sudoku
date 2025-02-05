import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

const OpponentSudokuBoard = () => {
  const initialSudokuBoard = [
    [true, true, false, false, true, false, false, false, false],
    [true, false, false, true, true, true, false, false, false],
    [false, true, true, false, false, false, false, true, false],
    [true, false, false, false, true, false, false, false, true],
    [true, false, false, true, false, true, false, false, true],
    [true, false, false, false, true, false, false, false, true],
    [false, true, false, false, false, false, true, true, false],
    [false, false, false, true, true, true, false, false, true],
    [false, false, false, false, true, false, false, true, true],
  ];

  const [board, setBoard] = useState(initialSudokuBoard);
  const [lives, setLives] = useState(3);
  const socket = useSocket();

  useEffect(() => {
    const onValidMoveEvent = ({ rowIndex, colIndex }) => {
      let newSudokuBoard = [...board];
      newSudokuBoard[rowIndex][colIndex] = true;
      setBoard(newSudokuBoard);
    };
    socket.on("valid-move", onValidMoveEvent);

    const onLoseLifeEvent = () => {
      setLives(lives - 1);
    };
    socket.on("lose-life", onLoseLifeEvent);

    return () => {
      socket.off("valid-move", onValidMoveEvent);
      socket.off("lose-life", onLoseLifeEvent);
    };
  }, []);

  return (
    <>
      <p>Lives: {lives}</p>
      <div className="border-2">
        <div className="grid grid-cols-9 grid-rows-9">
          {board.map((row, rowIndex) =>
            row.map((bool, colIndex) => (
              <div
                key={rowIndex + colIndex}
                className={`w-12 h-12 border border-gray-200 ${
                  colIndex === 2 || colIndex === 5
                    ? "border-r-2 border-r-black"
                    : ""
                } ${
                  rowIndex === 2 || rowIndex === 5
                    ? "border-b-2 border-b-black"
                    : ""
                } ${
                  board[rowIndex][colIndex] === true
                    ? "bg-green-200"
                    : "bg-white"
                }`}
              ></div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default OpponentSudokuBoard;
