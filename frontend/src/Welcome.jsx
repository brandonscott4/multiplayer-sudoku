import { useState } from "react";
import { useNavigate } from "react-router";

const Welcome = () => {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (nickname.length === 0) {
      alert("Please enter a nickname");
      return;
    }

    localStorage.setItem("nickname", nickname);
    navigate("/lobby");
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col border p-6 rounded">
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
    </>
  );
};

export default Welcome;
