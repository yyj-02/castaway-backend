import { Request, Response } from "express";
import UploadService from "../services/upload";

const postOneUpload = async (req: Request, res: Response) => {
  try {
    const data = await UploadService.postOneUpload(res.locals.podcastFile.path);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  postOneUpload,
};
