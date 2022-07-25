import { Socket } from "socket.io";
import { listener } from "..";
import { livestreamsCollection } from "../database/db";

const upload = (
  audioBlob: any,
  socket: Socket,
  livestreamId: string,
  userId: string
) => {
  socket.emit("success", `Packet received from user ${userId}`);
  console.log("This shit works");
  listener.to(livestreamId).emit("audio", audioBlob);
};

const disconnect = async (
  reason: string,
  livestreamId: string,
  userId: string
) => {
  try {
    // Update the status of the livestream room
    await livestreamsCollection
      .doc(livestreamId)
      .update({ streamerConnected: false });
    if (reason === "io client disconnect") {
      listener.to(livestreamId).disconnectSockets;
    }
    console.log(
      `User ${userId} disconnected as streamer from livestream ${livestreamId} due to ${reason}`
    );
  } catch (err) {
    console.log({ err });
  }
};

export default {
  upload,
  disconnect,
};
