import { createRoot } from "react-dom/client";
import Welcome from "./Welcome.jsx";
import Lobby from "./Lobby.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { SocketProvider } from "./SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  </SocketProvider>
);
