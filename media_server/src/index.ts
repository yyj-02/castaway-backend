import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
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

const room = "demo";
const stream = io.of("/stream");
stream.on("connection", streamerController);

const listen = io.of("/listen");
listen.on("connection");

// Opening port
const PORT = process.env.PORT || 8080;

server.listen(3000);

app.listen(PORT, () => {
  console.log(`Service is up on port http://localhost:${PORT}`);
});
