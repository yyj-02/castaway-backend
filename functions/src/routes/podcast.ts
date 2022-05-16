import * as express from "express";
import Podcast from "../controllers/podcast";
import PodcastSchema from "./podcast-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", Podcast.getAllPodcasts);
router.get("/:podcastId", Podcast.getOnePodcast);
router.post("/", PodcastSchema, requestSchemaValidator, Podcast.addOnePodcast);
router.put(
  "/:podcastId",
  PodcastSchema,
  requestSchemaValidator,
  Podcast.updateOnePodcast
);
router.delete("/:podcastId", Podcast.deleteOnePodcast);

export default router;
