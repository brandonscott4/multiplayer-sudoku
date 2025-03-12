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

const rooms = {};

const createRoom = (roomName, nickname, socket) => {
  rooms[roomName] = {
    playerCount: 1,
    hostNickname: nickname,
    hostId: socket.id,
  };
  console.log(rooms);
};

const joinRoom = (roomName, nickname, socket) => {
  rooms[roomName].playerCount += 1;
  rooms[roomName].guestNickname = nickname;
  rooms[roomName].guestId = socket.id;
  rooms[roomName].isGameOver = false;
  console.log(rooms);
};

const leaveRoom = (roomName, socket) => {
  const room = rooms[roomName];

  if (room.playerCount === 1) {
    delete rooms[roomName];
    socket.leave(roomName);
    console.log(rooms);
    return;
  }

  if (socket.id === room.hostId) {
    room.hostNickname = room.guestNickname;
    delete room.guestNickname;

    room.hostId = room.guestId;
    delete room.guestId;
  } else if (socket.id === room.guestId) {
    delete room.guestNickname;
    delete room.guestId;
  }

  room.playerCount -= 1;
  room.isGameOver = true;
  socket.to(roomName).emit("opponent-left");

  console.log(rooms);
};

io.on("connection", (socket) => {
  console.log("A user connected ", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected ", socket.id);
  });

  socket.on("create-room", ({ roomName, nickname }) => {
    if (roomName in rooms) {
      socket.emit("create-failure", { failure: "Room already exists" });
      return;
    }

    createRoom(roomName, nickname, socket);
    socket.emit("create-success");
    socket.join(roomName);

    console.log("User created room: ", roomName);
  });

  socket.on("join-room", ({ roomName, nickname }) => {
    if (!(roomName in rooms)) {
      socket.emit("join-failure", { failure: "Room doesn't exist" });
      return;
    }

    if (rooms[roomName].playerCount === 2) {
      socket.emit("join-failure", { failure: "Room is full" });
      return;
    }

    if (rooms[roomName].isGameOver) {
      socket.emit("join-failure", { failure: "Game is over" });
      return;
    }

    joinRoom(roomName, nickname, socket);
    socket.emit("join-success");
    socket.join(roomName);

    //look for better fix here with potential mounting timing issue
    setTimeout(() => {
      io.to(roomName).emit("opponent-joined");
    }, 500);

    console.log("User joined room: ", roomName);
  });

  socket.on("ready", (data) => {
    socket.to(data.roomId).emit("ready", data.readyStatus);
  });

  socket.on("valid-move", (data) => {
    socket
      .to(data.roomId)
      .emit("valid-move", { rowIndex: data.rowIndex, colIndex: data.colIndex });
  });

  socket.on("lose-life", (data) => {
    socket.to(data.roomId).emit("lose-life");
  });

  socket.on("opponent-loses", (data) => {
    rooms[data.roomId].isGameOver = true;
    socket.to(data.roomId).emit("opponent-loses");
  });

  socket.on("opponent-wins", (data) => {
    rooms[data.roomId].isGameOver = true;
    socket.to(data.roomId).emit("opponent-wins");
  });

  socket.on("leave-room", (data) => {
    leaveRoom(data.roomId, socket);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
