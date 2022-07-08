import axios from "axios";
import { Socket } from "socket.io";
import { livestreamsCollection } from "../database/db";

const listenerController = async (socket: Socket) => {
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

    // Check if livestream exist
    const livestreamDoc = await livestreamsCollection.doc(livestreamId).get();
    if (!livestreamDoc.exists) {
      socket.emit("error", `Livestream ${livestreamId} does not exist.`);
      throw {
        status: 401,
        message: `Livestream ${livestreamId} does not exist.`,
      };
    }

    // Check if the streamer is online
    if (livestreamDoc.data()?.streamerConnected !== true) {
      socket.emit("error", `Livestream ${livestreamId} has not started.`);
      throw {
        status: 401,
        message: `Livestream ${livestreamId} has not started.`,
      };
    }

    // User is connected
    socket.join(livestreamId);
    console.log(
      `User ${userId} connected as listener to livestream ${livestreamId}.`
    );

    socket.emit(
      "success",
      `User ${userId} connected as listener to livestream ${livestreamId}.`
    );

    socket.on("disconnect", async (reason) => {
      try {
        console.log(
          `User ${userId} disconnected as listener from livestream ${livestreamId} due to ${reason}`
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

export default listenerController;
