import { useState, useEffect, useRef } from "react";

const ElapsedTimer = ({ isActive, isGameOver }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && !isGameOver) {
      intervalRef.current = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, isGameOver]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;

  return (
    <p className="border border-blue-200 bg-blue-100 rounded text-center py-1 font-mono w-60">
      {formatted}
    </p>
  );
};

export default ElapsedTimer;
