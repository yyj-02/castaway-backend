import * as express from "express";
import uploadController from "../controllers/upload";
import uploadMiddleware from "../middlewares/upload";

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

router.delete("/podcasts/:uploadId", uploadController.deleteOneUpload);

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

router.delete("/images/:uploadId", uploadController.deleteOneUpload);

export default router;
