import * as express from "express";
import Podcast from "../controllers/podcast";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", Podcast.getAllPodcasts);
router.get("/:podcastId", Podcast.getOnePodcast);
router.post("/", Podcast.addOnePodcast);
router.put("/:podcastId", Podcast.updateOnePodcast);
router.delete("/:podcastId", Podcast.deleteOnePodcast);

export default router;
