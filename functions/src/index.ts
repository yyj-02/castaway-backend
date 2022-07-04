import * as express from "express";
import * as cors from "cors";
import helmet from "helmet";
import * as morgan from "morgan";
import * as functions from "firebase-functions";

// Routers
import podcastRouter from "./routes/podcast";
import uploadRouter from "./routes/upload";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import livestreamRouter from "./routes/livestream";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Initializing
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "LogRocket Express API with Swagger",
//       version: "0.1.0",
//       description:
//         "This is a simple CRUD API application made with Express and documented with Swagger",
//       license: {
//         name: "MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "LogRocket",
//         url: "https://logrocket.com",
//         email: "info@email.com",
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:3000/books",
//       },
//     ],
//   },
//   apis: ["./routes/*.ts"],
// };

// const specs = swaggerJsDoc(options);
// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Endpoints
app.get("/", (req, res) => {
  res.send("<h2>Castaway backend service is up and running.</h2>");
});

app.use("/api/podcasts", podcastRouter);

app.use("/api/uploads", uploadRouter);

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use("/api/livestreams", livestreamRouter);

// Convert to Firebase functions
exports.app = functions.https.onRequest(app);
