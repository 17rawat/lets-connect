import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const usernameToSocket = new Map();
  const socketToUsername = new Map();

  io.on("connection", (socket) => {
    console.log(`socket connected ${socket.id}`);

    socket.on("join-room", ({ roomId, username }) => {
      usernameToSocket.set(username, socket.id);
      socketToUsername.set(socket.id, username);

      socket.join(roomId);

      socket.emit("joined-room", { roomId });
      console.log(`${username} joined room ${roomId}`);

      socket.broadcast.to(roomId).emit("user-joined", { username });
    });

    socket.on("offer-call-user", ({ offer, username }) => {
      const socketId = usernameToSocket.get(username);
      // console.log(socketId);
      const callFrom = socketToUsername.get(socket.id);
      // console.log(socket.id);
      console.log(`Call from ${callFrom} `);

      socket.to(socketId).emit("offer-incoming-call", { offer, callFrom });
    });

    socket.on("answer", (username, answer) => {
      const socketId = usernameToSocket.get(username);
      socket.to(socketId).emit("answer", { answer });
    });

    socket.on("ice-candidate", (roomId, candidate) => {
      socket.to(roomId).emit("ice-candidate", socket.id, candidate);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
