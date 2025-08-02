import { useContext } from "react";
import { SocketContext } from "./SocketContext";

export const useSocket = () => {
  const socket = useContext(SocketContext);

  {
    /*
  if (!socket) {
    throw new Error("Socket is not defined");
  }
  */
  }

  return socket;
};
