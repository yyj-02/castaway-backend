import { Socket } from "socket.io";

const listenerController = (socket: Socket) => {
  console.log(`${socket.id} connected to listen`);
  socket.emit("success", `Socket ${socket.id} connected to listen`);

  socket.join(room);
  socket.emit("success", `Socket ${socket.id} joined demo room`);

  socket.on("disconnect", (reason) => {
    console.log(`disconnect ${socket.id} due to ${reason}`);
  });
};

export default listenerController;
