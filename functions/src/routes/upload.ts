import * as express from "express";
import uploadController from "../controllers/upload";
import upload from "../middlewares/upload";

// Initializing
const router = express.Router();

// Endpoints
router.post("/", upload, uploadController.postOneUpload);

router.put("/:uploadId", upload, uploadController.updateOneUpload);

router.delete("/:uploadId", uploadController.deleteOneUpload);

export default router;
