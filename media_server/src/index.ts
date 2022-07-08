import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import "dotenv/config";
import { Server } from "socket.io";

import streamerController from "./controllers/streamer";
import listenerController from "./controllers/listener";

// Initializing
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

// Endpoints
app.get("/", (req, res) => {
  res.send("Media server is up and running.");
});

const streamer = io.of("/streamer");
streamer.on("connection", streamerController);

export const listener = io.of("/listener");
listener.on("connection", listenerController);

// Opening ports
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Service is up on port http://localhost:${PORT}`);
});

server.listen(3000);
