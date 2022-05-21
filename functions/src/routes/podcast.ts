import * as express from "express";
import podcastController from "../controllers/podcast";
import streamController from "../controllers/stream";
import PodcastSchema from "./podcast-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", podcastController.getAllPodcasts);

router.get("/:podcastId", podcastController.getOnePodcast);

router.get("/:podcastId/stream", streamController.streamOnePodcast);

router.post(
  "/",
  PodcastSchema.PostSchema,
  requestSchemaValidator,
  podcastController.addOnePodcast
);

router.put(
  "/:podcastId",
  PodcastSchema.UpdateSchema,
  requestSchemaValidator,
  podcastController.updateOnePodcast
);

router.delete("/:podcastId", podcastController.deleteOnePodcast);

export default router;
