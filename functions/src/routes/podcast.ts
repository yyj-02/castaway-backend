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
  PodcastSchema.PostPodcastSchema,
  requestSchemaValidator,
  podcastController.addOnePodcast
);

router.put(
  "/:podcastId",
  PodcastSchema.UpdatePodcastSchema,
  requestSchemaValidator,
  podcastController.updateOnePodcast
);

router.put(
  "/:podcastId/podcast",
  PodcastSchema.UpdateAudioSchema,
  requestSchemaValidator,
  podcastController.updateOnePodcastAudio
);

router.put(
  "/:podcastId/image",
  PodcastSchema.UpdateImageSchema,
  requestSchemaValidator,
  podcastController.updateOnePodcastImage
);

router.delete("/:podcastId", podcastController.deleteOnePodcast);

export default router;
