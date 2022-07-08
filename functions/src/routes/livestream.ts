import * as express from "express";
import livestreamController from "../controllers/livestream";
import LivestreamSchema from "./livestream-schema";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";
import idTokenValidator from "../middlewares/idTokenValidator";

// Initializing
const router = express.Router();

// Endpoints
router.get("/", livestreamController.getAllLivestream);

router.get("/:livestreamId", livestreamController.getOneLivestream);

router.post(
  "/",
  LivestreamSchema.PostLivestreamSchema,
  requestSchemaValidator,
  idTokenValidator,
  livestreamController.addOneLivestream
);

router.delete(
  "/:livestreamId",
  LivestreamSchema.DeleteLivestreamSchema,
  requestSchemaValidator,
  idTokenValidator,
  livestreamController.deleteOneLivestream
);

export default router;
