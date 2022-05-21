import * as express from "express";
import Upload from "../controllers/upload";
import upload from "../middlewares/upload";

// Initializing
const router = express.Router();

// Endpoints
router.post("/", upload, Upload.postOneUpload);

export default router;
