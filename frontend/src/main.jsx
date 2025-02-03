import { createRoot } from "react-dom/client";
import Welcome from "./Welcome.jsx";
import Lobby from "./Lobby.jsx";
import Room from "./Room.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { SocketProvider } from "./SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);
