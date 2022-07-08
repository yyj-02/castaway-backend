import axios from "axios";
import { Socket } from "socket.io";
import { listener } from "..";
import { livestreamsCollection } from "../database/db";

const streamerController = async (socket: Socket) => {
  try {
    // Start of validating headers
    const idToken = socket.handshake.headers["id-token"];
    const livestreamId = socket.handshake.headers["livestream-id"];
    if (idToken === undefined || typeof idToken !== "string") {
      socket.emit("error", "Id token not provided.");
      throw {
        status: 400,
        message: "Id token not provided.",
      };
    }
    if (livestreamId === undefined || typeof livestreamId !== "string") {
      socket.emit("error", "Livestream id not provided.");
      throw {
        status: 400,
        message: "Livestream id not provided.",
      };
    }

    // Check if user is registered
    const userData = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.IDENTITY_SERVER_API_KEY}`,
      { idToken }
    );
    const userId = userData.data.users[0].localId;

    // Check if user is authorized
    const livestreamDoc = await livestreamsCollection.doc(livestreamId).get();
    if (
      livestreamDoc.data()?.artistId !== userId ||
      livestreamDoc.data()?.streamerConnected !== false
    ) {
      socket.emit(
        "error",
        "User is not authorized to livestream in this room."
      );
      throw {
        status: 401,
        message: "User is not authorized to livestream in this room.",
      };
    }

    // Update the status of the livestream room
    await livestreamsCollection
      .doc(livestreamId)
      .update({ streamerConnected: true });

    // User is connected
    console.log(
      `User ${userId} connected as streamer to livestream ${livestreamId}.`
    );

    socket.emit(
      "success",
      `User ${userId} connected as streamer to livestream ${livestreamId}.`
    );

    socket.on("upload", (audioBlob) => {
      socket.emit("success", `Packet received from user ${userId}`);
      listener.to(livestreamId).emit("audio", audioBlob);
    });

    socket.on("disconnect", async (reason) => {
      try {
        // Update the status of the livestream room
        await livestreamsCollection
          .doc(livestreamId)
          .update({ streamerConnected: false });
        console.log(
          `User ${userId} disconnected as streamer from livestream ${livestreamId} due to ${reason}`
        );
      } catch (err) {
        console.log({ err });
      }
    });
  } catch (err) {
    console.log({ err });
    socket.disconnect();
  }
};

export default streamerController;
