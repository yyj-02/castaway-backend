import * as express from "express";
import * as cors from "cors";
import helmet from "helmet";
import * as morgan from "morgan";
import * as functions from "firebase-functions";

// Routers
import podcastRouter from "./routes/podcast";

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

// Endpoints
app.get("/", (req, res) => {
  res.send("<h2>Castaway backend service is up and running.</h2>");
});
app.use("/api/podcasts", podcastRouter);

// Convert to Firebase functions
exports.app = functions.https.onRequest(app);
