import { Request, Response } from "express";
import uploadService from "../services/upload";

const postOneUpload = async (req: Request, res: Response) => {
  const {
    locals: { podcastFile },
  } = res;

  try {
    const data = await uploadService.postOneUpload(podcastFile.path);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const updateOneUpload = async (req: Request, res: Response) => {
  const {
    params: { uploadId },
  } = req;
  const {
    locals: { podcastFile },
  } = res;

  try {
    const data = await uploadService.updateOneUpload(
      uploadId,
      podcastFile.path
    );
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

const deleteOneUpload = async (req: Request, res: Response) => {
  const {
    params: { uploadId },
  } = req;

  try {
    const data = await uploadService.deleteOneUpload(uploadId);
    res.json(data);
  } catch (err: any) {
    res
      .status(err?.status || 500)
      .json({ status: "FAILED", data: { error: err?.message || err } });
  }
};

export default {
  postOneUpload,
  updateOneUpload,
  deleteOneUpload,
};
