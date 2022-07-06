import { Socket } from "socket.io";

const streamerController = (socket: Socket) => {
  console.log(`${socket.id} connected to stream`);
  socket.emit("success", `Socket ${socket.id} connected to stream`);

  let count = 0;

  socket.on("upload", (audioBlob) => {
    count += 1;
    console.log(`${count} audio packets received`);
    socket.emit("success", `Package received from ${socket.id}`);
    listen.to(room).emit("audio", audioBlob);
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
};

export default streamerController;
