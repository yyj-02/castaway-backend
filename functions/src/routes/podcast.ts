import * as express from "express";
import podcastController from "../controllers/podcast";
import streamController from "../controllers/stream";
import PodcastSchema from "./podcast-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";
import idTokenValidator from "../middlewares/idTokenValidator-old";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", podcastController.getAllPodcasts);

router.post(
  "/:podcastId/info",
  PodcastSchema.GetOnePodcastSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.getOnePodcast
);

router.post(
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

router.post(
  "/:podcastId/delete",
  PodcastSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  podcastController.deleteOnePodcast
);

export default router;
