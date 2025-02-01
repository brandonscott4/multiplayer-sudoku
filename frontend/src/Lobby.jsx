import { useSocket } from "./useSocket";

const Lobby = () => {
  const socket = useSocket();

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col border p-6 rounded">
          <h1 className="font-medium text-xl mb-8 text-center">Lobby</h1>
          <div className="flex gap-12">
            <div>
              <button
                onClick={() => {
                  socket.connect();
                }}
                className="w-full border bg-green-100 hover:bg-green-200 hover:cursor-pointer mt-3 rounded "
              >
                Connect
              </button>
            </div>
            <div>
              <button
                onClick={() => {
                  socket.disconnect();
                }}
                className="w-full border bg-blue-100 hover:bg-blue-200 hover:cursor-pointer mt-3 rounded "
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Lobby;
