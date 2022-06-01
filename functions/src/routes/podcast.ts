import * as express from "express";
import podcastController from "../controllers/podcast";
import streamController from "../controllers/stream";
import PodcastSchema from "./podcast-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";
import idTokenValidator from "../middlewares/idTokenValidator";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", podcastController.getAllPodcasts);

router.get(
  "/:podcastId",
  PodcastSchema.GetOnePodcastSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.getOnePodcast
);

router.get(
  "/:podcastId/stream",
  PodcastSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  streamController.streamOnePodcast
);

router.post(
  "/",
  PodcastSchema.PostPodcastSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.addOnePodcast
);

router.put(
  "/:podcastId",
  PodcastSchema.UpdatePodcastSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.updateOnePodcast
);

router.put(
  "/:podcastId/podcast",
  PodcastSchema.UpdateAudioSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.updateOnePodcastAudio
);

router.put(
  "/:podcastId/image",
  PodcastSchema.UpdateImageSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.updateOnePodcastImage
);

router.delete(
  "/:podcastId",
  PodcastSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.deleteOnePodcast
);

export default router;
