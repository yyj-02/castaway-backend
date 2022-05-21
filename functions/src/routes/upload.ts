import * as express from "express";
import Upload from "../controllers/upload";
import upload from "../middlewares/upload";

// Initializing
const router = express.Router();

// Endpoints
router.post("/", upload, Upload.postOneUpload);

router.put("/:uploadId", upload, Upload.updateOneUpload);

router.delete("/:uploadId", Upload.deleteOneUpload);

export default router;
