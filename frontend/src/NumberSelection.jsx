const NumberSelection = ({ handleCheck }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-rows-3 grid-cols-3 gap-3 w-52 h-52">
      {numbers.map((num) => (
        <button
          key={num}
          className="bg-gray-200 hover:bg-gray-300 hover:cursor-pointer rounded"
          onClick={() => {
            handleCheck(num);
          }}
        >
          {num}
        </button>
      ))}
    </div>
  );
};

export default NumberSelection;
