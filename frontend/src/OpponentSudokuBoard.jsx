import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";
import ElapsedTimer from "./ElapsedTimer";

const OpponentSudokuBoard = ({ isActive, isGameOver }) => {
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
      setLives((prevLives) => prevLives - 1);
    };
    socket.on("lose-life", onLoseLifeEvent);

    return () => {
      socket.off("valid-move", onValidMoveEvent);
      socket.off("lose-life", onLoseLifeEvent);
    };
  }, []);

  return (
    <>
      <div className="flex gap-12 items-start">
        <div className="bg-white shadow-lg rounded-2xl p-10 border border-gray-200">
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
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200 flex flex-col gap-6">
          <p className="border border-red-200 bg-red-100 rounded text-center py-1 font-mono w-60">
            Lives: {lives}
          </p>
          <ElapsedTimer isActive={isActive} isGameOver={isGameOver} />
        </div>
      </div>
    </>
  );
};

export default OpponentSudokuBoard;
