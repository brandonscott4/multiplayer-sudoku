import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("User joined room: ", room);
  });

  socket.on("ready", (data) => {
    socket.to(data.roomId).emit("ready", data.readyStatus);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
