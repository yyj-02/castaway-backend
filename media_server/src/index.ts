import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Initializing
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

// Endpoints
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Opening port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Service is up on port ${PORT}`);
});
