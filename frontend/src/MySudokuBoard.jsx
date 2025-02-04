import { useState } from "react";
import NumberSelection from "./NumberSelection";

const MySudokuBoard = () => {
  const initialSudokuBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
  ];

  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  const [board, setBoard] = useState(initialSudokuBoard);
  const [activeCell, setActiveCell] = useState({
    rowIndex: 0,
    colIndex: 0,
  });
  const [lives, setLives] = useState(3);

  const handleClick = (rowIndex, colIndex) => {
    setActiveCell({ rowIndex, colIndex });
  };

  const handleCheck = (num) => {
    //check to see if cell is already filled
    if (board[activeCell.rowIndex][activeCell.colIndex] !== 0) {
      return;
    }

    //check if isn't correct number
    if (num !== solution[activeCell.rowIndex][activeCell.colIndex]) {
      if (lives - 1 === 0) {
        setLives(lives - 1);
        console.log("Game Over");
        return;
        //TODO: handle game over
      }

      setLives(lives - 1);
      return;
    }

    //update board
    let newBoard = [...board];
    newBoard[activeCell.rowIndex][activeCell.colIndex] = num;
    setBoard(newBoard);
  };

  return (
    <>
      <p>Lives: {lives}</p>
      <div className="flex gap-12">
        <div className="border-2">
          <div className="grid grid-cols-9 grid-rows-9">
            {board.map((row, rowIndex) =>
              row.map((num, colIndex) => (
                <button
                  className={`border ${
                    activeCell.rowIndex === rowIndex &&
                    activeCell.colIndex === colIndex
                      ? "bg-blue-100"
                      : "bg-white"
                  } ${
                    colIndex === 2 || colIndex === 5
                      ? "border-r-2 border-r-black"
                      : ""
                  } ${
                    rowIndex === 2 || rowIndex === 5
                      ? "border-b-2 border-b-black"
                      : ""
                  } border-gray-200 w-12 h-12 hover:cursor-pointer text-gray-700 text-3xl`}
                  key={rowIndex + colIndex}
                  onClick={() => handleClick(rowIndex, colIndex)}
                >
                  {num === 0 ? " " : num}
                </button>
              ))
            )}
          </div>
        </div>
        <NumberSelection handleCheck={handleCheck} />
      </div>
    </>
  );
};

export default MySudokuBoard;
