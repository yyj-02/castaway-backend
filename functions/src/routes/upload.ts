import * as express from "express";
import uploadController from "../controllers/upload";
import UploadSchema from "./upload-schema";
import uploadMiddleware from "../middlewares/upload";
import requestSchemaValidator from "../middlewares/requestSchemaValidator";
import idTokenValidator from "../middlewares/idTokenValidator";

// Initializing
const router = express.Router();

// Endpoints for podcasts
router.post(
  "/podcasts",
  uploadMiddleware.uploadAudio,
  uploadController.postOneUpload
);

router.put(
  "/podcasts/:uploadId",
  uploadMiddleware.uploadAudio,
  uploadController.updateOneUpload
);

router.delete(
  "/podcasts/:uploadId",
  UploadSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  uploadController.deleteOneUpload
);

// Endpoints for images
router.post(
  "/images",
  uploadMiddleware.uploadImage,
  uploadController.postOneUpload
);

router.put(
  "/images/:uploadId",
  uploadMiddleware.uploadImage,
  uploadController.updateOneUpload
);

router.delete(
  "/images/:uploadId",
  UploadSchema.IdTokenSchema,
  requestSchemaValidator,
  idTokenValidator,
  uploadController.deleteOneUpload
);

export default router;
