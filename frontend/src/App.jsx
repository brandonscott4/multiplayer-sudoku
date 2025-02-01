import { io } from "socket.io-client";
const socket = io("http://localhost:3000", { autoConnect: false });

const App = () => {
  return (
    <>
      <h1 className="text-3xl">Hello World!</h1>
      <button
        onClick={() => {
          socket.connect();
        }}
        className="border px-3 py-1 hover:bg-gray-100 hover:cursor-pointer"
      >
        Connect
      </button>
      <button
        onClick={() => {
          socket.disconnect();
        }}
        className="border px-3 py-1 ml-4 hover:bg-gray-100 hover:cursor-pointer"
      >
        Disconnect
      </button>
    </>
  );
};

export default App;
